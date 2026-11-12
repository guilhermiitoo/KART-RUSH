"""KART RUSH · prepara o modelo gerado no Meshy (Capy + Zorp juntos num arquivo) para o jogo.

  blender -b -P blender/meshy_prepara.py -- <entrada.glb>

1. Tira o capacete de vidro do ZORP (sobrou só a casca de trás, branca) e fecha a nuca com uma calota verde.
2. Separa os dois personagens (CAPY à esquerda, ZORP à direita).
3. Reduz a malha (~800 mil → ~14 mil triângulos cada) e as texturas (2048 → 1024).
4. Coloca cada um em pé na origem, com a frente para +Z do glTF (igual aos karts), 2 m de altura.
5. Exporta modelos/personagens_v2/capy.glb e zorp.glb.
"""
import bpy, bmesh, sys, os, math
import numpy as np
from mathutils import Vector, Matrix

AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
ENTRADA = [a for a in args if a.endswith('.glb')][0]
SAIDA = os.path.join(RAIZ, 'modelos', 'personagens_v2')
TRIS = 14000

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=ENTRADA)
ob = [o for o in bpy.data.objects if o.type == 'MESH'][0]
ob.data.transform(ob.matrix_world); ob.matrix_world = Matrix()
me = ob.data
mat = me.materials[0]
base = [n.image for n in mat.node_tree.nodes if n.type == 'TEX_IMAGE' and any(l.to_socket.name == 'Base Color' for l in n.outputs[0].links)][0]
W, H = base.size
px = np.array(base.pixels[:], dtype=np.float32).reshape(H, W, 4)

# ---------- ilhas (a malha do Meshy vem dividida em ilhas de textura)
n = len(me.polygons)
C = np.zeros((n, 3)); me.polygons.foreach_get('center', C.ravel())
uv = np.zeros(len(me.loops) * 2); me.uv_layers.active.data.foreach_get('uv', uv); uv = uv.reshape(-1, 2)
ls = np.zeros(n, int); me.polygons.foreach_get('loop_start', ls)
u = uv[ls]
COL = px[np.clip((u[:, 1] * H).astype(int), 0, H - 1), np.clip((u[:, 0] * W).astype(int), 0, W - 1), :3]
bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
lab = -np.ones(n, int); k = 0
for f in bm.faces:
    if lab[f.index] >= 0: continue
    st = [f]; lab[f.index] = k
    while st:
        x = st.pop()
        for e in x.edges:
            for g in e.link_faces:
                if lab[g.index] < 0: lab[g.index] = k; st.append(g)
    k += 1

# ---------- cabeça do Zorp: centro e tamanho pelas faces verdes da frente
al = C[:, 0] > 0.2
verde = al & (COL[:, 1] > COL[:, 0] + .08) & (COL[:, 1] > COL[:, 2] + .08) & (C[:, 2] > .02) & (C[:, 2] < .42) & (C[:, 1] < -.05)
HC = Vector(C[verde].mean(0)); HC.y = -.04
print('cabeça do Zorp', HC)

# ---------- capacete: ilhas claras e sem cor, longe do centro da cabeça, acima do pescoço
apaga = []
for i in range(k):
    m = lab == i; P = C[m]; cen = P.mean(0)
    if cen[0] < .25 or cen[0] > .88 or cen[2] < .03: continue
    cm = COL[m].mean(0); sat = cm.max() - cm.min()
    r = np.linalg.norm(P - np.array(HC), axis=1).mean()
    if (sat < .2 and cm.mean() > .7 and r > .24) or (sat < .45 and cm.mean() > .6 and r > .23 and cen[1] > -.02 and cen[2] < .12) or (sat < .3 and cm.mean() > .65 and r > .225 and cen[1] > -.08):
        apaga.append(i)
mata = np.isin(lab, apaga)
# lascas que sobraram: qualquer face clara e sem cor acima da gola, fora do rosto da frente (brilho dos olhos, boca)
SAT = COL.max(1) - COL.min(1)
mata |= (C[:, 0] > .25) & (C[:, 0] < .88) & (C[:, 2] > .03) & (C[:, 1] > -.14) & (SAT < .3) & (COL.mean(1) > .6)
# aro do capacete (bege) atrás da gola
mata |= (C[:, 0] > .3) & (C[:, 0] < .78) & (C[:, 2] > -.1) & (C[:, 2] < .05) & (C[:, 1] > -.02) & (COL[:, 0] > .45) & (COL[:, 1] > .4) & (COL[:, 2] < .6) & (COL[:, 0] > COL[:, 2] + .12)
# restos atrás da gola
mata |= (C[:, 0] > .32) & (C[:, 0] < .75) & (C[:, 2] > -.08) & (C[:, 2] <= .03) & (C[:, 1] > -.05) & (SAT < .3) & (COL.mean(1) > .55)
print('capacete: ilhas', len(apaga), 'faces', int(mata.sum()))
bmesh.ops.delete(bm, geom=[f for f in bm.faces if mata[f.index]], context='FACES')
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
bm.to_mesh(me); bm.free()

# ---------- nuca: calota verde (a cabeça veio aberta atrás; o capacete era a parte de trás)
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=20, radius=1)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.y < -.35], context='VERTS')
bmesh.ops.transform(bm, matrix=Matrix.Translation(HC + Vector((0, .005, -.005))) @ Matrix.Diagonal((.205, .19, .19, 1)), verts=bm.verts)
cm = bpy.data.meshes.new('Nuca'); bm.to_mesh(cm); bm.free()
nuca = bpy.data.objects.new('Nuca', cm); bpy.context.scene.collection.objects.link(nuca)
for p in cm.polygons: p.use_smooth = True
mv = bpy.data.materials.new('PeleZorp'); mv.use_nodes = True
# mesma cor da pele: mediana das faces verdes da cabeça na textura (a textura está em sRGB; o material quer linear)
pele = (C[:, 0] > .25) & (C[:, 2] > .05) & (COL[:, 1] > COL[:, 0] + .1) & (COL[:, 1] > COL[:, 2] + .3) & (COL.mean(1) > .45)
med = np.median(COL[pele], axis=0); print('cor da pele (sRGB)', med.round(3))
lin = [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in med]
b = mv.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*lin, 1); b.inputs['Roughness'].default_value = .7
if 'Specular IOR Level' in b.inputs: b.inputs['Specular IOR Level'].default_value = .3
cm.materials.append(mv)

def sel(objs, ativo):
    for o in bpy.context.view_layer.objects: o.select_set(o in objs)
    bpy.context.view_layer.objects.active = ativo

# ---------- separa os dois (pela posição de cada ilha)
bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
uvl = bm.loops.layers.uv.active
lab2 = {}
for f in bm.faces:
    if f.index in lab2: continue
    st = [f]; grp = [f]; lab2[f.index] = None
    while st:
        x = st.pop()
        for e in x.edges:
            for g in e.link_faces:
                if g.index not in lab2: lab2[g.index] = None; st.append(g); grp.append(g)
    cx = sum(g.calc_center_median().x for g in grp) / len(grp)
    for g in grp: lab2[g.index] = cx > .14
for f in bm.faces: f.select = lab2[f.index]
bm.to_mesh(me); bm.free()
sel([ob], ob)
with bpy.context.temp_override(object=ob, active_object=ob, selected_objects=[ob], selected_editable_objects=[ob]):
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.separate(type='SELECTED'); bpy.ops.object.mode_set(mode='OBJECT')
capy = ob; zorp = [o for o in bpy.data.objects if o.type == 'MESH' and o not in (ob, nuca)][0]
capy.name = 'Capy'; zorp.name = 'Zorp'

# ---------- texturas menores
for img in bpy.data.images:
    if img.size[0] > 1024: img.scale(1024, 1024)

def prepara(o, extras=()):
    objs = [o] + list(extras)
    if extras:
        sel(objs, o)
        with bpy.context.temp_override(object=o, active_object=o, selected_objects=objs, selected_editable_objects=objs):
            bpy.ops.object.join()
    t = sum(len(p.vertices) - 2 for p in o.data.polygons)
    if t > TRIS:
        m = o.modifiers.new('red', 'DECIMATE'); m.ratio = TRIS / t; m.use_collapse_triangulate = True
        sel([o], o)
        with bpy.context.temp_override(object=o, active_object=o, selected_objects=[o]):
            bpy.ops.object.modifier_apply(modifier=m.name)
    # pés no chão, centro no meio, 2 m de altura
    vs = [o.matrix_world @ v.co for v in o.data.vertices]
    mn = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))); mx = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
    s = 2.0 / (mx.z - mn.z)
    o.data.transform(Matrix.Diagonal((s, s, s, 1)) @ Matrix.Translation(Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z))))
    o.data.update()
    print(o.name, 'triângulos', sum(len(p.vertices) - 2 for p in o.data.polygons))

def exporta(o, nome):
    sel([o], o)
    kw = dict(filepath=os.path.join(SAIDA, nome + '.glb'), export_format='GLB', use_selection=True, export_yup=True, export_image_format='JPEG', export_jpeg_quality=85)
    props = bpy.ops.export_scene.gltf.get_rna_type().properties
    kw = {a: v for a, v in kw.items() if a in props or a == 'filepath'}
    bpy.ops.export_scene.gltf(**kw)
    print('EXPORTADO', nome, os.path.getsize(kw['filepath']) // 1024, 'KB')

os.makedirs(SAIDA, exist_ok=True)
prepara(capy); exporta(capy, 'capy')
prepara(zorp, [nuca]); exporta(zorp, 'zorp')
