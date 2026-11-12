"""KART RUSH · biblioteca de modelagem dos personagens (Blender 4.2+ / 5.x, roda sem interface).

Uso:  blender -b -P blender/capy.py        (no seu Blender portátil)
      ou  python blender/capy.py           (com o pacote 'bpy' instalado)

Padrão (igual para os 6 personagens — ver blender/PADRAO.md):
  · 1 unidade = 1 m · personagem em pé com ~2 m · pés em z=0 · frente para -Y (no glTF/Three.js vira +Z, igual ao kart)
  · formas orgânicas com METABALLS (as peças se fundem com transição suave) → malha → redução para o orçamento
  · cor por VÉRTICE (COLOR_0) pintada por região; poucos materiais (pelo/tecido, brilho, luz, metal)
  · esqueleto padrão (nomes fixos) + pesos automáticos no corpo e rígidos nas peças (olhos, chapéu, botas…)
  · animações como ações separadas: Parado, Sentado, Acenar, Vitoria, Surpresa, Olhar, Item, Derrota, Piscar
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix, Quaternion, Euler
from mathutils.kdtree import KDTree

def hexc(h, a=1.0):
    return ((h >> 16 & 255) / 255.0, (h >> 8 & 255) / 255.0, (h & 255) / 255.0, a)

def srgb2lin(c):
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) if i < 3 else x for i, x in enumerate(c))

# ------------------------------------------------------------------ cena
def limpa():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for c in (bpy.data.meshes, bpy.data.materials, bpy.data.metaballs, bpy.data.armatures, bpy.data.actions):
        for b in list(c):
            c.remove(b)

def _ctx(obj, sel=None):
    sel = sel or [obj]
    for o in bpy.context.view_layer.objects:
        o.select_set(o in sel)
    bpy.context.view_layer.objects.active = obj
    return bpy.context.temp_override(object=obj, active_object=obj, selected_objects=sel, selected_editable_objects=sel)

# ------------------------------------------------------------------ materiais
MATS = {}
def material(nome, rough=0.75, metal=0.0, emis=0.0, clearcoat=0.0):
    """Material que usa a cor do vértice (o exportador gera COLOR_0)."""
    if nome in MATS:
        return MATS[nome]
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get('Principled BSDF')
    ca = nt.nodes.new('ShaderNodeVertexColor')
    ca.layer_name = 'Col'
    nt.links.new(ca.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if emis:
        nt.links.new(ca.outputs['Color'], bsdf.inputs['Emission Color'])
        bsdf.inputs['Emission Strength'].default_value = emis
    if clearcoat and 'Coat Weight' in bsdf.inputs:
        bsdf.inputs['Coat Weight'].default_value = clearcoat
    MATS[nome] = m
    return m

# ------------------------------------------------------------------ formas orgânicas (metaballs)
class Forma:
    """Coleção de elementos que se FUNDEM. Cada elemento tem uma região (cor).
    el('e', centro, raio, escala, regiao, rot)  elipsoide · el('c', a, b, raio, regiao) cápsula entre a e b."""
    def __init__(self, nome, res=0.018):
        self.nome = nome; self.res = res; self.els = []
    def elip(self, c, r, s=(1, 1, 1), reg='pele', rot=(0, 0, 0)):
        self.els.append(('e', Vector(c), r, Vector(s), reg, Euler(rot).to_quaternion())); return self
    def caps(self, a, b, r, reg='pele'):
        self.els.append(('c', Vector(a), Vector(b), r, reg)); return self
    def espelha(self):
        """duplica os elementos com x>0.01 para o lado -x"""
        novos = []
        for e in self.els:
            if e[0] == 'e' and e[1].x > 0.01:
                c = e[1].copy(); c.x = -c.x
                q = e[5]; q2 = Quaternion((q.w, q.x, -q.y, -q.z))
                novos.append(('e', c, e[2], e[3], e[4], q2))
            elif e[0] == 'c' and (e[1].x > 0.01 or e[2].x > 0.01):
                a = e[1].copy(); b = e[2].copy(); a.x = -a.x; b.x = -b.x
                novos.append(('c', a, b, e[3], e[4]))
        self.els += novos; return self
    def _dist(self, p, e):
        """distância normalizada (1 = superfície aproximada do elemento)"""
        if e[0] == 'e':
            d = e[5].inverted() @ (p - e[1])
            s = e[3] * e[2]
            return Vector((d.x / s.x, d.y / s.y, d.z / s.z)).length
        a, b, r = e[1], e[2], e[3]
        ab = b - a; t = max(0.0, min(1.0, (p - a).dot(ab) / max(1e-9, ab.dot(ab))))
        return (p - (a + ab * t)).length / r
    def regiao(self, p):
        best = None; bd = 1e9
        for e in self.els:
            d = self._dist(p, e)
            if d < bd: bd = d; best = e
        return best[4]
    def malha(self, tris=6000, threshold=0.6, recorta=None, cortes=()):
        mb = bpy.data.metaballs.new(self.nome)
        mb.resolution = self.res; mb.render_resolution = self.res; mb.threshold = threshold
        for e in self.els:
            if e[0] == 'e':
                el = mb.elements.new(type='ELLIPSOID')
                # medido no Blender: a superfície fica a 0,575 × raio (×size em cada eixo)
                el.co = e[1]; el.radius = e[2] / .575
                el.size_x, el.size_y, el.size_z = e[3].x, e[3].y, e[3].z
                el.rotation = e[5]
            else:
                a, b, r = e[1], e[2], e[3]
                el = mb.elements.new(type='CAPSULE')
                el.co = (a + b) / 2; el.radius = r / .565
                ln = (b - a).length
                el.size_x = max(1e-4, ln / 2)
                el.rotation = Vector((1, 0, 0)).rotation_difference((b - a).normalized())
            el.stiffness = 2.0
        ob = bpy.data.objects.new(self.nome, mb)
        bpy.context.scene.collection.objects.link(ob)
        bpy.context.view_layer.update()
        with _ctx(ob):
            bpy.ops.object.convert(target='MESH')
        me_ob = bpy.context.view_layer.objects.active
        me_ob.data.validate(); me_ob.data.update()
        me_ob.name = self.nome
        if recorta:
            bm = bmesh.new(); bm.from_mesh(me_ob.data)
            for co, no in cortes:  # cortes retos (planos) antes de apagar: bordas lisas
                bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=Vector(co), plane_no=Vector(no))
            bmesh.ops.delete(bm, geom=[f for f in bm.faces if recorta(f.calc_center_median())], context='FACES')
            bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
            bm.to_mesh(me_ob.data); bm.free()
        _reduz(me_ob, tris)
        return me_ob

def _reduz(ob, tris):
    n = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    if n > tris:
        mod = ob.modifiers.new('red', 'DECIMATE'); mod.ratio = tris / n; mod.use_collapse_triangulate = True
        with _ctx(ob):
            bpy.ops.object.modifier_apply(modifier=mod.name)
    for p in ob.data.polygons:
        p.use_smooth = True

def pinta(ob, cor_de):
    """cor por vértice: cor_de(posição) -> cor hex"""
    me = ob.data
    if 'Col' not in me.color_attributes:
        me.color_attributes.new(name='Col', type='BYTE_COLOR', domain='CORNER')
    ca = me.color_attributes['Col']
    cache = {}
    for li, l in enumerate(me.loops):
        vi = l.vertex_index
        if vi not in cache:
            cache[vi] = hexc(cor_de(ob.matrix_world @ me.vertices[vi].co))
        ca.data[li].color_srgb = cache[vi]
    me.color_attributes.active_color = ca

def pinta_forma(ob, forma, pal, extra=None):
    def cor(p):
        if extra:
            r = extra(p)
            if r is not None: return r
        return pal[forma.regiao(p)]
    pinta(ob, cor)

def usa(ob, mat):
    ob.data.materials.clear(); ob.data.materials.append(mat)

# ------------------------------------------------------------------ peças rígidas (bmesh)
def _obj(nome, bm):
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nome, me); bpy.context.scene.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
    return ob

def esfera(nome, c, r, s=(1, 1, 1), rot=(0, 0, 0), seg=16, anel=10, cor=0xFFFFFF, mat=None, hemi=False):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=anel, radius=r)
    if hemi:
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -1e-4], context='VERTS')
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*s, 1))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    ob = _obj(nome, bm); pinta(ob, lambda p: cor)
    if mat: usa(ob, mat)
    return ob

def caixa(nome, c, tam, raio=0.02, rot=(0, 0, 0), cor=0xFFFFFF, mat=None, seg=3):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(tam), verts=bm.verts)
    if raio > 0:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=min(raio, min(tam) / 2 * .95), segments=seg, affect='EDGES', profile=0.5)
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4()
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    ob = _obj(nome, bm); pinta(ob, lambda p: cor)
    for p in ob.data.polygons: p.use_smooth = raio > 0
    if mat: usa(ob, mat)
    return ob

def cilindro(nome, c, r1, r2, h, rot=(0, 0, 0), seg=20, cor=0xFFFFFF, mat=None, tampa=True, s=(1, 1, 1)):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=tampa, cap_tris=False, segments=seg, radius1=r1, radius2=r2, depth=h)
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*s, 1))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    ob = _obj(nome, bm); pinta(ob, lambda p: cor)
    if mat: usa(ob, mat)
    return ob

def toro(nome, c, R, r, rot=(0, 0, 0), s=(1, 1, 1), seg=24, segr=8, cor=0xFFFFFF, mat=None, arco=math.tau):
    bm = bmesh.new(); vs = []
    for i in range(seg + (0 if arco >= math.tau - 1e-6 else 1)):
        a = arco * i / seg
        anel = []
        for j in range(segr):
            b = math.tau * j / segr
            p = Vector(((R + r * math.cos(b)) * math.cos(a), (R + r * math.cos(b)) * math.sin(a), r * math.sin(b)))
            anel.append(bm.verts.new(p))
        vs.append(anel)
    fech = arco >= math.tau - 1e-6
    for i in range(len(vs) - (0 if fech else 1)):
        A = vs[i]; Bv = vs[(i + 1) % len(vs)]
        for j in range(segr):
            bm.faces.new((A[j], A[(j + 1) % segr], Bv[(j + 1) % segr], Bv[j]))
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*s, 1))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    ob = _obj(nome, bm); pinta(ob, lambda p: cor)
    if mat: usa(ob, mat)
    return ob

def tubo(nome, pts, r, cor=0xFFFFFF, mat=None, segr=8, afina=1.0):
    """tubo passando pelos pontos (cintos, sorrisos, alças)"""
    pts = [Vector(p) for p in pts]; bm = bmesh.new(); aneis = []
    for i, p in enumerate(pts):
        t = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        u = t.orthogonal().normalized(); v = t.cross(u)
        rr = r * (1 - (1 - afina) * i / max(1, len(pts) - 1))
        aneis.append([bm.verts.new(p + (u * math.cos(math.tau * j / segr) + v * math.sin(math.tau * j / segr)) * rr) for j in range(segr)])
    for i in range(len(aneis) - 1):
        for j in range(segr):
            bm.faces.new((aneis[i][j], aneis[i][(j + 1) % segr], aneis[i + 1][(j + 1) % segr], aneis[i + 1][j]))
    for a in (aneis[0], aneis[-1]):
        bm.faces.new(a)
    ob = _obj(nome, bm); pinta(ob, lambda p: cor)
    if mat: usa(ob, mat)
    return ob

def casca(nome, base_ob, recorta, espessura=0.012, cor=0xFFFFFF, mat=None, offset=0.012, tris=1400):
    """roupa: cópia do corpo empurrada para fora, com partes recortadas (recorta(p)->True apaga)"""
    me = base_ob.data.copy(); ob = bpy.data.objects.new(nome, me); bpy.context.scene.collection.objects.link(ob)
    bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
    for v in bm.verts:
        v.co += v.normal * offset
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if recorta(f.calc_center_median())], context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bm.to_mesh(me); bm.free()
    _reduz(ob, tris)
    if espessura:
        m = ob.modifiers.new('esp', 'SOLIDIFY'); m.thickness = espessura; m.offset = 1
        with _ctx(ob): bpy.ops.object.modifier_apply(modifier=m.name)
    pinta(ob, lambda p: cor if not callable(cor) else cor(p))
    if mat: usa(ob, mat)
    for p in ob.data.polygons: p.use_smooth = True
    return ob

# ------------------------------------------------------------------ esqueleto padrão
OSSOS = [  # nome, cabeça, cauda, pai
    ('Quadril', 'Coluna', None), ('Coluna', 'Peito', 'Quadril'), ('Peito', 'Pescoco', 'Coluna'), ('Pescoco', 'Cabeca', 'Peito'),
]
def esqueleto(P):
    """P: dicionário nome -> (cabeça, cauda, pai). Devolve o objeto armature."""
    arm = bpy.data.armatures.new('Esqueleto'); ob = bpy.data.objects.new('Esqueleto', arm)
    bpy.context.scene.collection.objects.link(ob)
    with _ctx(ob):
        bpy.ops.object.mode_set(mode='EDIT')
        eb = arm.edit_bones
        for n, (h, t, pai) in P.items():
            b = eb.new(n); b.head = Vector(h); b.tail = Vector(t); b.roll = 0
        for n, (h, t, pai) in P.items():
            if pai: eb[n].parent = eb[pai]; eb[n].use_connect = False
        bpy.ops.object.mode_set(mode='OBJECT')
    return ob

def pesa_auto(corpo, arm, ossos_def=None):
    """pesos automáticos (calor) do corpo"""
    with _ctx(arm, [corpo, arm]):
        bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    if ossos_def:
        # só ossos "deform" do corpo: remove grupos de ossos rígidos (olhos, pálpebras…)
        for g in list(corpo.vertex_groups):
            if g.name not in ossos_def:
                corpo.vertex_groups.remove(g)

def pesa_rigido(ob, osso):
    g = ob.vertex_groups.new(name=osso); g.add(list(range(len(ob.data.vertices))), 1.0, 'REPLACE')

def copia_pesos(ob, fonte):
    """roupa/peça segue o corpo: copia os pesos do vértice mais próximo do corpo"""
    kd = KDTree(len(fonte.data.vertices))
    for i, v in enumerate(fonte.data.vertices): kd.insert(fonte.matrix_world @ v.co, i)
    kd.balance()
    for g in fonte.vertex_groups:
        if g.name not in ob.vertex_groups: ob.vertex_groups.new(name=g.name)
    idx = {g.index: g.name for g in fonte.vertex_groups}
    for v in ob.data.vertices:
        co, i, d = kd.find(ob.matrix_world @ v.co)
        for ge in fonte.data.vertices[i].groups:
            ob.vertex_groups[idx[ge.group]].add([v.index], ge.weight, 'REPLACE')

def junta(obs, nome):
    alvo = obs[0]
    with _ctx(alvo, obs):
        bpy.ops.object.join()
    alvo.name = nome; alvo.data.name = nome
    return alvo

def liga(ob, arm):
    ob.parent = arm
    m = ob.modifiers.new('Esqueleto', 'ARMATURE'); m.object = arm

# ------------------------------------------------------------------ animação
def _bq(arm, n):
    return arm.data.bones[n].matrix_local.to_quaternion()

def pose(arm, d):
    """d: osso -> (eixo_mundo, ângulo_graus) ou lista disso. Gira em torno de eixos do MUNDO (mais fácil de pensar)."""
    for pb in arm.pose.bones:
        pb.rotation_mode = 'QUATERNION'; pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0)
    for n, v in d.items():
        if n == '_loc':
            for bn, loc in v.items():
                B = arm.data.bones[bn].matrix_local.to_3x3()
                arm.pose.bones[bn].location = B.inverted() @ Vector(loc)
            continue
        lst = v if isinstance(v, list) else [v]
        qw = Quaternion()
        for eixo, g in lst:
            qw = Quaternion(Vector(eixo).normalized(), math.radians(g)) @ qw
        B = _bq(arm, n)
        arm.pose.bones[n].rotation_quaternion = B.inverted() @ qw @ B

def acao(arm, nome, quadros, fps=30, loop=True):
    """quadros: lista de (tempo_s, dict de pose). Cria uma ação e guarda no NLA."""
    arm.animation_data_create()
    ac = bpy.data.actions.new(nome); ac.use_fake_user = True
    arm.animation_data.action = ac
    nomes = set()
    for _, d in quadros:
        nomes |= {k for k in d if k != '_loc'} | set(d.get('_loc', {}).keys())
    for t, d in quadros:
        pose(arm, d)
        f = 1 + round(t * fps)
        for pb in arm.pose.bones:
            pb.keyframe_insert('rotation_quaternion', frame=f, group=pb.name)
            if pb.name in d.get('_loc', {}) or pb.name == 'Quadril':
                pb.keyframe_insert('location', frame=f, group=pb.name)
    tr = arm.animation_data.nla_tracks.new(); tr.name = nome
    st = tr.strips.new(nome, 1, ac); st.name = nome
    arm.animation_data.action = None
    return ac

# ------------------------------------------------------------------ exportação e prévia
def exporta(caminho):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    for o in bpy.context.view_layer.objects: o.select_set(True)
    kw = dict(filepath=caminho, export_format='GLB', export_yup=True, export_skins=True, export_animations=True, export_apply=False, export_morph=False)
    props = bpy.ops.export_scene.gltf.get_rna_type().properties
    if 'export_animation_mode' in props: kw['export_animation_mode'] = 'NLA_TRACKS'
    if 'export_vertex_color' in props: kw['export_vertex_color'] = 'ACTIVE'
    if 'export_all_vertex_colors' in props: kw['export_all_vertex_colors'] = True
    bpy.ops.export_scene.gltf(**kw)
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in bpy.context.view_layer.objects if o.type == 'MESH')
    print('EXPORTADO', caminho, 'triângulos:', tris, 'tamanho:', os.path.getsize(caminho) // 1024, 'KB')
    return tris

def previa(pasta, nome, vistas=(('frente', 0), ('lado', 90), ('costas', 180), ('tres4', 35)), res=640, alvo_z=1.1, dist=6.2):
    """fotos de prévia com o Cycles (CPU)"""
    sc = bpy.context.scene
    if sc.camera:
        co = sc.camera
        for nm, ang in vistas:
            a = math.radians(ang); co.location = (math.sin(a) * dist, -math.cos(a) * dist, alvo_z + 0.25 * dist / 2.4 if dist < 3 else alvo_z + 0.9)
            d = Vector((0, 0, alvo_z)) - co.location; co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
            sc.render.filepath = os.path.join(pasta, f'{nome}_{nm}.png'); bpy.ops.render.render(write_still=True)
        return
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 40
    try: sc.cycles.use_denoising = True
    except Exception: pass
    sc.render.resolution_x = sc.render.resolution_y = res
    sc.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('mundo'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.42, 0.5, 0.75, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = .9
    for nm, en, rot, cor in (('sol', 3.2, (math.radians(50), math.radians(10), math.radians(-35)), (1, .97, .9)), ('contra', 1.6, (math.radians(-60), 0, math.radians(160)), (.7, .8, 1))):
        L = bpy.data.lights.new(nm, 'SUN'); L.energy = en; L.color = cor; lo = bpy.data.objects.new(nm, L); lo.rotation_euler = rot; sc.collection.objects.link(lo)
    cam = bpy.data.cameras.new('cam'); cam.lens = 55; co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
    chao = bpy.data.meshes.new('chao'); bm = bmesh.new(); bmesh.ops.create_circle(bm, cap_ends=True, radius=3, segments=48); bm.to_mesh(chao); bm.free()
    cho = bpy.data.objects.new('chao', chao); sc.collection.objects.link(cho)
    mc = bpy.data.materials.new('chao'); mc.use_nodes = True; mc.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.25, .22, .45, 1); chao.materials.append(mc)
    out = []
    for nm, ang in vistas:
        a = math.radians(ang)
        co.location = (math.sin(a) * dist, -math.cos(a) * dist, alvo_z + 0.9)
        d = Vector((0, 0, alvo_z)) - co.location; co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        sc.render.filepath = os.path.join(pasta, f'{nome}_{nm}.png'); bpy.ops.render.render(write_still=True); out.append(sc.render.filepath)
    return out

def superficie(ob, origem, direcao):
    """ponto onde um raio (origem → direção) bate na malha (para colar olhos, nariz, chapéu… na pele de verdade)"""
    bpy.context.view_layer.update()
    ok, loc, nor, i = ob.ray_cast(Vector(origem), Vector(direcao).normalized())
    return (Vector(loc), Vector(nor)) if ok else (None, None)

def espessa(ob, esp):
    m = ob.modifiers.new('esp', 'SOLIDIFY'); m.thickness = esp; m.offset = 1
    with _ctx(ob): bpy.ops.object.modifier_apply(modifier=m.name)
    for p in ob.data.polygons: p.use_smooth = True
