"""KART RUSH · esqueleto e animações para os modelos do Meshy (vêm parados em pose T, sem esqueleto).

  blender -b -P blender/meshy_rig.py -- capy zorp

Para cada modelos/personagens_v2/<id>.glb:
 1. acha ombros, punhos, quadril, joelhos e pescoço pela forma da malha (pose T, frente −Y, pés em z=0);
 2. cria o esqueleto padrão (mesmos nomes de blender/PADRAO.md) e pesa cada vértice pela distância aos ossos
    (robusto mesmo com a malha da IA cheia de ilhas; cabeça e chapéu ficam rígidos na cabeça);
 3. grava as animações Parado, Sentado (no kart, mãos no volante), Acenar e Vitoria; exporta por cima do arquivo.
"""
import bpy, sys, os, math
import numpy as np
from mathutils import Vector, Quaternion, Matrix

AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
IDS = [a for a in args if not a.startswith('-')] or ['capy', 'zorp']

def ctx(ob, sel=None):
    sel = sel or [ob]
    for o in bpy.context.view_layer.objects: o.select_set(o in sel)
    bpy.context.view_layer.objects.active = ob
    return bpy.context.temp_override(object=ob, active_object=ob, selected_objects=sel, selected_editable_objects=sel)

def marcos(V):
    """V: vértices (n,3). Devolve posições das juntas."""
    zmax = V[:, 2].max(); ax = np.abs(V[:, 0]); xm = ax.max()
    braco = V[ax > xm * .72]                       # pontas dos braços (pose T)
    zb = float(np.median(braco[:, 2]))
    # largura do tronco na altura dos braços menos um pouco: onde o braço "sai" do corpo
    fatia = V[(V[:, 2] > zb - .05) & (V[:, 2] < zb + .05)]
    # ombro: primeiro vão na distribuição de |x| abaixo do braço (tronco), aproximado
    abaixo = V[(V[:, 2] > zb - .28) & (V[:, 2] < zb - .12)]
    xt = float(np.percentile(np.abs(abaixo[:, 0]), 96)) if len(abaixo) else xm * .3
    # entreperna: z mais alto em que não há malha perto de x=0, na parte de baixo
    zc = .1
    for z in np.arange(.05, zb, .01):
        sl = V[(V[:, 2] > z - .01) & (V[:, 2] < z + .01)]
        if len(sl) and (np.abs(sl[:, 0]) < .025).sum() == 0: zc = z
        elif len(sl): break
    pernas = V[V[:, 2] < zc]
    xp = float(np.median(np.abs(pernas[:, 0]))) if len(pernas) else .15
    yc = float(np.median(V[(V[:, 2] > zc) & (V[:, 2] < zb), 1]))
    return dict(zmax=zmax, xm=xm, zb=zb, xt=xt, zc=zc, xp=xp, yc=yc)

def seg_dist(P, a, b):
    ab = b - a; t = np.clip(((P - a) @ ab) / max(1e-9, ab @ ab), 0, 1)
    return np.linalg.norm(P - (a + np.outer(t, ab)), axis=1)

def faz(id_):
    caminho = os.path.join(RAIZ, 'modelos', 'personagens_v2', id_ + '.glb')
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=caminho)
    ob = [o for o in bpy.data.objects if o.type == 'MESH'][0]
    ob.data.transform(ob.matrix_world); ob.matrix_world = Matrix(); ob.parent = None
    for o in list(bpy.data.objects):
        if o != ob: bpy.data.objects.remove(o)
    me = ob.data; V = np.array([v.co[:] for v in me.vertices])
    M = marcos(V); print(id_, {k: round(v, 3) for k, v in M.items()})
    zb, xt, xm, zc, xp, yc, zmax = M['zb'], M['xt'], M['xm'], M['zc'], M['xp'], M['yc'], M['zmax']
    zn = zb + .07                     # pescoço logo acima dos ombros
    zq = zc + .08                     # quadril
    J = {
     'Quadril': ((0, yc, zq - .05), (0, yc, zq + .1), None), 'Coluna': ((0, yc, zq + .1), (0, yc, (zq + zn) / 2), 'Quadril'),
     'Peito': ((0, yc, (zq + zn) / 2), (0, yc, zn), 'Coluna'), 'Pescoco': ((0, yc, zn), (0, yc, zn + .06), 'Peito'),
     'Cabeca': ((0, yc, zn + .06), (0, yc, zmax), 'Pescoco')}
    for s, L in ((1, 'L'), (-1, 'R')):
        ombro = xt * .95; cot = (ombro + xm) / 2; pun = xm - (xm - ombro) * .12
        J.update({
         'Ombro.' + L: ((s * .05, yc, zb), (s * ombro, yc, zb), 'Peito'), 'Braco.' + L: ((s * ombro, yc, zb), (s * cot, yc, zb), 'Ombro.' + L),
         'Antebraco.' + L: ((s * cot, yc, zb), (s * pun, yc, zb), 'Braco.' + L), 'Mao.' + L: ((s * pun, yc, zb), (s * xm, yc, zb), 'Antebraco.' + L),
         'Coxa.' + L: ((s * xp, yc, zq), (s * xp, yc, zc * .5), 'Quadril'), 'Canela.' + L: ((s * xp, yc, zc * .5), (s * xp, yc, .06), 'Coxa.' + L),
         'Pe.' + L: ((s * xp, yc, .06), (s * xp, yc - .15, .02), 'Canela.' + L)})
    arm = bpy.data.armatures.new('Esqueleto'); ao = bpy.data.objects.new('Esqueleto', arm); bpy.context.scene.collection.objects.link(ao)
    with ctx(ao):
        bpy.ops.object.mode_set(mode='EDIT')
        for n, (h, t, p) in J.items():
            b = arm.edit_bones.new(n); b.head = h; b.tail = t
        for n, (h, t, p) in J.items():
            if p: arm.edit_bones[n].parent = arm.edit_bones[p]
        bpy.ops.object.mode_set(mode='OBJECT')
    # ---------- pesos por região (sem misturar tronco e braço: evita a pele esticada)
    nomes = list(J); P = V; ax = np.abs(P[:, 0]); z = P[:, 2]
    gr = {n: ob.vertex_groups.new(name=n) for n in nomes}
    def put(vi, pares):
        t = sum(w for _, w in pares)
        for n, w in pares:
            if w > 1e-3: gr[n].add([vi], w / t, 'REPLACE')
    sm = lambda a, b, x: float(np.clip((x - a) / (b - a), 0, 1))
    ombro = xt * .95
    for vi in range(len(P)):
        x, zz = P[vi, 0], z[vi]; L = 'L' if x >= 0 else 'R'; a = ax[vi]
        if zz > zn + .02:
            put(vi, [('Cabeca', 1)]); continue
        if a > ombro * .8 and zz > zc + .12:                     # braço
            t = (a - ombro) / max(.01, xm - ombro)
            if t < 0: put(vi, [('Peito', 1 - sm(-.25, 0, t)), ('Braco.' + L, sm(-.25, 0, t))])
            elif t < .5: put(vi, [('Braco.' + L, 1 - sm(.4, .5, t)), ('Antebraco.' + L, sm(.4, .5, t))])
            elif t < .85: put(vi, [('Antebraco.' + L, 1 - sm(.78, .85, t)), ('Mao.' + L, sm(.78, .85, t))])
            else: put(vi, [('Mao.' + L, 1)])
            continue
        if zz < zc + .06:                                          # perna
            if zz < .07: put(vi, [('Pe.' + L, 1)])
            elif zz < zc * .5: put(vi, [('Canela.' + L, 1)])
            else: put(vi, [('Coxa.' + L, 1 - sm(zc - .02, zc + .06, zz) * .5), ('Quadril', sm(zc - .02, zc + .06, zz) * .5)])
            continue
        # tronco
        if zz < zq + .1: put(vi, [('Quadril', 1)])
        elif zz < (zq + zn) / 2: put(vi, [('Quadril', 1 - sm(zq + .1, (zq + zn) / 2, zz)), ('Coluna', sm(zq + .1, (zq + zn) / 2, zz))])
        else: put(vi, [('Coluna', 1 - sm((zq + zn) / 2, zn, zz)), ('Peito', sm((zq + zn) / 2, zn, zz))])
    ob.parent = ao; m = ob.modifiers.new('Esqueleto', 'ARMATURE'); m.object = ao
    # ---------- animações (eixos do mundo)
    X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
    def pose(d):
        for pb in ao.pose.bones:
            pb.rotation_mode = 'QUATERNION'; pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0)
        for n, v in d.items():
            if n == '_loc':
                for bn, l in v.items(): ao.pose.bones[bn].location = ao.data.bones[bn].matrix_local.to_3x3().inverted() @ Vector(l)
                continue
            q = Quaternion()
            for e, g in (v if isinstance(v, list) else [v]): q = Quaternion(e, math.radians(g)) @ q
            B = ao.data.bones[n].matrix_local.to_quaternion(); ao.pose.bones[n].rotation_quaternion = B.inverted() @ q @ B
    def acao(nome, quadros):
        ao.animation_data_create(); ac = bpy.data.actions.new(nome); ac.use_fake_user = True; ao.animation_data.action = ac
        for t, d in quadros:
            pose(d); f = 1 + round(t * 30)
            for pb in ao.pose.bones:
                pb.keyframe_insert('rotation_quaternion', frame=f, group=pb.name); pb.keyframe_insert('location', frame=f, group=pb.name)
        tr = ao.animation_data.nla_tracks.new(); tr.name = nome; st = tr.strips.new(nome, 1, ac); st.name = nome; ao.animation_data.action = None
    # braços: da pose T para baixo (gira em Y) e para frente (gira em Z)
    def bracos(baixo, frente, cot=0, lado=None):
        d = {}
        for s, L in ((1, 'L'), (-1, 'R')):
            if lado and L != lado: continue
            d['Braco.' + L] = [(Y, s * baixo), (Z, -s * frente)]
            if cot: d['Antebraco.' + L] = [(Z, -s * cot)]
        return d
    def junta(*ds):
        r = {}
        for d in ds:
            for k, v in d.items():
                if k == '_loc': r.setdefault('_loc', {}).update(v)
                else: r[k] = (r.get(k, []) if isinstance(r.get(k, []), list) else [r[k]]) + (v if isinstance(v, list) else [v])
        return r
    acao('Parado', [(t, junta(bracos(68 + 3 * math.sin(t * math.pi), 8), {'Cabeca': (Z, 8 * math.sin(t / 2 * math.pi)), 'Peito': (X, 2 * math.sin(t * math.pi)), '_loc': {'Quadril': (0, 0, .01 * math.sin(t * math.pi))}})) for t in [i / 4 for i in range(17)]])
    sent = junta(bracos(40, 50, 25), {'Coxa.L': (X, 80), 'Coxa.R': (X, 80), 'Canela.L': (X, -80), 'Canela.R': (X, -80)})
    acao('Sentado', [(0, sent), (1, sent)])
    acao('Acenar', [(t, junta(bracos(68, 8, lado='R'), {'Braco.L': [(Y, -20)], 'Antebraco.L': [(Y, -35 - 25 * math.sin(t * 4 * math.pi))], 'Cabeca': (Z, -10)})) for t in [i / 8 for i in range(17)]])
    acao('Vitoria', [(t, junta({'Braco.L': [(Y, -70)], 'Braco.R': [(Y, 70)], 'Antebraco.L': [(Y, -20)], 'Antebraco.R': [(Y, 20)], 'Cabeca': (X, 10 * math.sin(t * 2 * math.pi)),
        '_loc': {'Quadril': (0, 0, .12 * abs(math.sin(t / 1.2 * 2 * math.pi)))}})) for t in [i / 10 for i in range(13)]])
    pose({})
    for o in bpy.context.view_layer.objects: o.select_set(True)
    kw = dict(filepath=caminho, export_format='GLB', export_yup=True, export_skins=True, export_animations=True, export_image_format='JPEG', export_jpeg_quality=85)
    props = bpy.ops.export_scene.gltf.get_rna_type().properties
    if 'export_animation_mode' in props: kw['export_animation_mode'] = 'NLA_TRACKS'
    bpy.ops.export_scene.gltf(**{a: v for a, v in kw.items() if a in props or a == 'filepath'})
    print('EXPORTADO', id_, os.path.getsize(caminho) // 1024, 'KB')

for i in IDS: faz(i)
