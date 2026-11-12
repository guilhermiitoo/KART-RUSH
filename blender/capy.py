"""KART RUSH · CAPY, a capivara aventureira (modelo de referência do elenco).
Visual da arte de abertura: capivara caramelo robusta, focinho grande com nariz escuro, olhar sonolento e confiante,
dentões, chapéu de explorador com uma laranja em cima, camisa cáqui de manga dobrada, colete verde com bolsos, cinto,
calça cáqui e botas.

Rodar:  blender -b -P blender/capy.py      → modelos/personagens_v2/capy.glb  (+ fotos em blender/previa/ com --previa)
"""
import os, sys, math
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
import kr_lib as K
from mathutils import Vector

RAIZ = os.path.dirname(AQUI)
SAIDA = os.path.join(RAIZ, 'modelos', 'personagens_v2', 'capy.glb')
PREVIA = '--previa' in sys.argv

K.limpa()
PELO = K.material('Pelo', rough=.85)
TEC = K.material('Tecido', rough=.9)
BRI = K.material('Brilho', rough=.18, clearcoat=.5)
MET = K.material('Metal', rough=.3, metal=.8)

PAL = dict(pelo=0xA8693A, focinho=0xC98E58, orelha=0x8A5634, pata=0x7A4A2A, camisa=0xE4D3A6, calca=0xC4AA78)

# ---------------- corpo (uma forma só: tudo se funde com transição suave)
F = K.Forma('Corpo', res=.017)
F.elip((0, 0, .64), .30, (1.12, .95, .85), 'calca')          # quadril
F.elip((0, -.02, .86), .36, (1.05, .98, 1.0), 'camisa')       # barriga
F.elip((0, 0, 1.04), .30, (1.15, .95, .85), 'camisa')         # peito
F.elip((0, 0, 1.21), .16, (1, 1, 1), 'pelo')                  # pescoço
F.elip((0, .02, 1.50), .33, (1, 1.05, .95), 'pelo')           # crânio
F.elip((0, -.30, 1.42), .27, (.92, 1.25, .82), 'focinho')     # focinho comprido
F.elip((0, -.52, 1.42), .19, (1.05, .9, .95), 'focinho')      # ponta do focinho
F.elip((.18, -.10, 1.38), .13, (1, 1, 1), 'pelo')             # bochecha
F.elip((.28, .08, 1.68), .075, (1, .55, 1.1), 'orelha')       # orelha
F.caps((.34, 0, 1.08), (.50, -.02, .84), .11, 'camisa')       # braço (manga)
F.caps((.50, -.02, .84), (.58, -.06, .62), .095, 'pelo')      # antebraço (manga dobrada)
F.elip((.60, -.08, .53), .11, (.8, .9, 1.1), 'pata')          # mão
for k in range(3):                                             # dedos gordinhos
    x = .60 - .035 + k * .035
    F.caps((x, -.13, .47), (x, -.15, .41), .03, 'pata')
F.caps((.55, -.13, .53), (.53, -.18, .49), .03, 'pata')        # polegar
F.caps((.16, 0, .56), (.18, 0, .32), .14, 'calca')            # coxa
F.caps((.18, 0, .32), (.19, .01, .14), .12, 'calca')          # canela
F.espelha()
corpo = F.malha(tris=5600)
K.pinta_forma(corpo, F, PAL)
K.usa(corpo, PELO)

# ---------------- colete (forma própria um pouco maior que o tronco, recortada antes de reduzir → bordas lisas)
def recorte_colete(p):
    return p.z > 1.15 or p.z < .73 or abs(p.x) > .37 or (abs(p.x) > .27 and p.z > .93) or (abs(p.x) < .085 and p.y < -.05)
FV = K.Forma('Colete', res=.012)
FV.elip((0, -.02, .86), .385, (1.05, .98, 1.0), 'v').elip((0, 0, 1.04), .325, (1.15, .95, .85), 'v')
CORTES = [((0, 0, 1.15), (0, 0, 1)), ((0, 0, .73), (0, 0, 1)), ((0, 0, .93), (0, 0, 1))] + [((s * x, 0, 0), (1, 0, 0)) for s in (1, -1) for x in (.085, .27, .37)]
colete = FV.malha(tris=1300, recorta=recorte_colete, cortes=CORTES)
K.espessa(colete, .014); K.pinta(colete, lambda q: 0x5F7A34); K.usa(colete, TEC)

pecas = []
def p(ob, osso):
    ob['osso'] = osso; pecas.append(ob); return ob

for s in (1, -1):
    # bolsos do colete com aba e botão
    p(K.caixa('bolso', (s * .16, -.355, .93), (.12, .025, .11), .015, rot=(0, 0, s * .42), cor=0x546B2C, mat=TEC), 'Peito')
    p(K.caixa('aba', (s * .16, -.37, .99), (.13, .03, .035), .012, rot=(0, 0, s * .42), cor=0x4A5E26, mat=TEC), 'Peito')
    p(K.esfera('botao', (s * .16, -.388, .985), .012, cor=0xC9A84A, mat=MET), 'Peito')
    # gola da camisa
    p(K.caixa('gola', (s * .075, -.17, 1.19), (.11, .018, .07), .01, rot=(.5, 0, s * .65), cor=PAL['camisa'], mat=TEC), 'Peito')
    # manga dobrada
    d = Vector((.16, -.02, -.24)) * Vector((s, 1, 1))
    p(K.toro('manga', (s * .49, -.02, .86), .108, .032, rot=Vector((0, 0, 1)).rotation_difference(d).to_euler(), cor=0xD6C496, mat=TEC), 'Braco.' + ('L' if s > 0 else 'R'))
    # botas
    p(K.esfera('bota', (s * .19, -.06, .09), .13, (1, 1.55, .72), cor=0x6B4226, mat=PELO), 'Pe.' + ('L' if s > 0 else 'R'))
    p(K.caixa('sola', (s * .19, -.07, .028), (.25, .41, .05), .02, cor=0x3A2A1E, mat=PELO), 'Pe.' + ('L' if s > 0 else 'R'))
    p(K.toro('cano', (s * .19, -.01, .16), .12, .026, cor=0x8A5A32, mat=PELO), 'Canela.' + ('L' if s > 0 else 'R'))

# cinto com fivela
p(K.toro('cinto', (0, -.01, .74), .37, .03, s=(1.03, .97, 1), cor=0x6B4226, mat=PELO), 'Quadril')
p(K.caixa('fivela', (0, -.385, .74), (.085, .02, .065), .01, cor=0xE0B84A, mat=MET), 'Quadril')

# ---------------- rosto e chapéu: tudo colado na superfície real da cabeça
S = lambda o, d: K.superficie(corpo, o, d)
for s, lado in ((1, 'L'), (-1, 'R')):
    hit, nor = S((s * .17, -1, 1.64), (0, 1, 0))
    c = hit + Vector((s * .01, .035, 0))                      # olho meio enterrado na cabeça
    olhar = Vector((-s * .15, -1, -.05)).normalized()
    p(K.esfera('olho', c, .085, cor=0xFFFFFF, mat=BRI), 'Cabeca')
    p(K.esfera('iris', c + olhar * .058, .05, (1, .5, 1), rot=(0, 0, -s * .15), cor=0x5A3418, mat=BRI), 'Cabeca')
    p(K.esfera('pupila', c + olhar * .084, .027, (1, .45, 1), rot=(0, 0, -s * .15), cor=0x111111, mat=BRI), 'Cabeca')
    p(K.esfera('brilho', c + olhar * .085 + Vector((s * .012, 0, .025)), .012, cor=0xFFFFFF, mat=BRI), 'Cabeca')
    p(K.esfera('palpebra', c, .094, hemi=True, rot=(math.radians(28), 0, 0), cor=PAL['pelo'], mat=PELO), 'Palpebra.' + lado)
    p(K.tubo('sobrancelha', [c + Vector((s * .065, -.03, .095)), c + Vector((0, -.07, .12)), c + Vector((-s * .065, -.06, .105))], .018, cor=0x5A3418, mat=PELO), 'Sobrancelha.' + lado)
    hit, nor = S((s * .05, -1.2, 1.52), (0, 1, 0))
    p(K.esfera('narina', hit + Vector((0, -.03, 0)), .024, (1, .6, 1), cor=0x1A100A, mat=BRI), 'Cabeca')
hit, nor = S((0, -1.2, 1.52), (0, 1, 0))
p(K.esfera('nariz', hit + Vector((0, .02, 0)), .1, (1.55, .7, .8), cor=0x3A2618, mat=BRI), 'Cabeca')
boca = []
for x in (-.15, -.08, 0, .08, .15):
    h, n = S((x, -1.2, 1.33 + (.02 if x > 0.1 else 0)), (0, 1, 0)); boca.append(h + Vector((0, -.006, 0)))
p(K.tubo('sorriso', boca, .012, cor=0x3A2618, mat=PELO), 'Cabeca')
p(K.esfera('boca', (0, -.53, 1.30), .12, (1, 1.2, .35), cor=0x3A1410, mat=PELO), 'Cabeca')
h, n = S((0, -1.2, 1.22), (0, 1, .25))
p(K.esfera('queixo', (0, (h.y if h else -.6) + .12, 1.25), .15, (.95, 1.2, .45), cor=PAL['focinho'], mat=PELO), 'Mandibula')
qy = (h.y if h else -.6) + .12
for s in (1, -1):  # dentões na frente do queixo, logo abaixo do sorriso
    p(K.caixa('dente', (s * .032, qy - .175, boca[2].z - .045), (.056, .035, .085), .014, cor=0xFFFBF0, mat=BRI), 'Cabeca')
topo, n = S((0, .02, 3), (0, 0, -1))
zt = topo.z
p(K.esfera('chapeu', (0, .02, zt - .07), .38, (1, 1.08, .74), hemi=True, seg=28, anel=12, cor=0xE9D9A8, mat=TEC), 'Cabeca')
p(K.cilindro('aba_chapeu', (0, 0, zt - .065), .56, .53, .025, s=(1, 1.08, 1), rot=(math.radians(-6), 0, 0), seg=40, cor=0xDCC995, mat=TEC), 'Cabeca')
p(K.cilindro('fita', (0, .02, zt - .03), .386, .38, .075, s=(1, 1.08, 1), seg=32, cor=0x7A4E2C, mat=TEC, tampa=False), 'Cabeca')
p(K.esfera('laranja', (0, .04, zt + .29), .1, (1, 1, .92), cor=0xFF9A1F, mat=BRI), 'Cabeca')
p(K.cilindro('cabinho', (0, .04, zt + .39), .012, .01, .04, cor=0x4A3018, mat=PELO), 'Cabeca')
p(K.esfera('folha', (.05, .05, zt + .405), .07, (.4, 1, .12), rot=(0, math.radians(-25), math.radians(30)), cor=0x3FA34D, mat=TEC), 'Cabeca')

# ---------------- esqueleto padrão
B = {
 'Quadril': ((0, 0, .60), (0, 0, .76), None), 'Coluna': ((0, 0, .76), (0, 0, .96), 'Quadril'), 'Peito': ((0, 0, .96), (0, 0, 1.16), 'Coluna'),
 'Pescoco': ((0, 0, 1.16), (0, 0, 1.28), 'Peito'), 'Cabeca': ((0, 0, 1.28), (0, 0, 1.80), 'Pescoco'),
 'Mandibula': ((0, -.34, 1.33), (0, -.56, 1.26), 'Cabeca')}
for s, L in ((1, 'L'), (-1, 'R')):
    B.update({
     'Palpebra.' + L: ((s * .17, -.20, 1.62), (s * .17, -.32, 1.62), 'Cabeca'), 'Sobrancelha.' + L: ((s * .17, -.24, 1.72), (s * .17, -.34, 1.72), 'Cabeca'),
     'Orelha.' + L: ((s * .27, .08, 1.62), (s * .31, .09, 1.76), 'Cabeca'),
     'Ombro.' + L: ((s * .10, 0, 1.10), (s * .33, 0, 1.08), 'Peito'), 'Braco.' + L: ((s * .33, 0, 1.08), (s * .50, -.02, .84), 'Ombro.' + L),
     'Antebraco.' + L: ((s * .50, -.02, .84), (s * .59, -.07, .60), 'Braco.' + L), 'Mao.' + L: ((s * .59, -.07, .60), (s * .61, -.10, .42), 'Antebraco.' + L),
     'Coxa.' + L: ((s * .16, 0, .60), (s * .18, 0, .33), 'Quadril'), 'Canela.' + L: ((s * .18, 0, .33), (s * .19, 0, .12), 'Coxa.' + L),
     'Pe.' + L: ((s * .19, 0, .12), (s * .19, -.20, .04), 'Canela.' + L)})
arm = K.esqueleto(B)
RIG = [n for n in B if n.split('.')[0] in ('Mandibula', 'Palpebra', 'Sobrancelha', 'Pe')]
for n in RIG: arm.data.bones[n].use_deform = False
K.pesa_auto(corpo, arm)
for n in RIG: arm.data.bones[n].use_deform = True
K.copia_pesos(colete, corpo)
for ob in pecas: K.pesa_rigido(ob, ob['osso'])
capy = K.junta([corpo, colete] + pecas, 'Capy')
for m in list(capy.modifiers): capy.modifiers.remove(m)
K.liga(capy, arm)

# ---------------- animações (rotações em eixos do mundo: X = de lado, Y = frente/trás, Z = vertical)
X, Y, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)
def braco(lado, g): return {'Braco.' + lado: (Y, -g if lado == 'L' else g)}
def M(*ds):
    r = {}
    for d in ds:
        for k, v in d.items():
            if k == '_loc': r.setdefault('_loc', {}).update(v)
            else: r.setdefault(k, []); r[k] = (r[k] if isinstance(r[k], list) else [r[k]]) + (v if isinstance(v, list) else [v])
    return r

K.acao(arm, 'Parado', [(t, M({'Peito': (X, 2 * math.sin(t / 2 * math.tau)), 'Cabeca': [(Z, 6 * math.sin(t / 4 * math.tau)), (X, -2 * math.sin(t / 2 * math.tau))],
    'Orelha.L': (Y, -12 if abs(t - 2.6) < .15 else 0), '_loc': {'Quadril': (0, 0, .008 * math.sin(t / 2 * math.tau))}}, braco('L', 4), braco('R', 4))) for t in [i / 4 for i in range(17)]])
sentado = M({'Coxa.L': (X, -88), 'Coxa.R': (X, -88), 'Canela.L': (X, 92), 'Canela.R': (X, 92), 'Pe.L': (X, -6), 'Pe.R': (X, -6),
             'Braco.L': [(X, -62), (Y, 18)], 'Braco.R': [(X, -62), (Y, -18)], 'Antebraco.L': (X, -28), 'Antebraco.R': (X, -28), 'Peito': (X, -4), '_loc': {'Quadril': (0, 0, -.18)}})
K.acao(arm, 'Sentado', [(0, sentado), (1, sentado)])
ac = []
for i in range(13):
    t = i * .125; w = math.sin(t * 2 * math.tau)
    ac.append((t, M({'Braco.R': [(Y, 150)], 'Antebraco.R': (Y, 25 * w), 'Cabeca': [(Z, -12), (Y, 6)], 'Mandibula': (X, 10), 'Sobrancelha.L': (X, 0)}, braco('L', 6))))
K.acao(arm, 'Acenar', ac, loop=False)
vit = []
for i in range(13):
    t = i * .1; h = abs(math.sin(t / 1.2 * 2 * math.pi)) * .22
    vit.append((t, M(braco('L', 150 + 10 * math.sin(t * 12)), braco('R', 150 + 10 * math.sin(t * 12 + 1)), {'Cabeca': (X, -14), 'Mandibula': (X, 24), 'Palpebra.L': (X, -26), 'Palpebra.R': (X, -26),
        'Coxa.L': (X, -20 * h / .22), 'Coxa.R': (X, -20 * h / .22), 'Canela.L': (X, 30 * h / .22), 'Canela.R': (X, 30 * h / .22), '_loc': {'Quadril': (0, 0, h)}})))
K.acao(arm, 'Vitoria', vit)
sur = M(braco('L', 60), braco('R', 60), {'Cabeca': (X, -10), 'Mandibula': (X, 30), 'Palpebra.L': (X, -30), 'Palpebra.R': (X, -30), '_loc': {'Sobrancelha.L': (0, 0, .03), 'Sobrancelha.R': (0, 0, .03), 'Quadril': (0, 0, .03)}})
K.acao(arm, 'Surpresa', [(0, {}), (.15, sur), (1.0, sur), (1.3, {})], loop=False)
K.acao(arm, 'Olhar', [(0, {}), (.4, {'Cabeca': (Z, 40), 'Pescoco': (Z, 10)}), (1.2, {'Cabeca': (Z, 40), 'Pescoco': (Z, 10)}), (1.6, {'Cabeca': (Z, -40), 'Pescoco': (Z, -10)}), (2.4, {'Cabeca': (Z, -40), 'Pescoco': (Z, -10)}), (2.8, {})])
it = M(braco('L', 110), braco('R', 110), {'Mandibula': (X, 22), 'Palpebra.L': (X, -26), 'Palpebra.R': (X, -26), '_loc': {'Quadril': (0, 0, .12)}})
K.acao(arm, 'Item', [(0, {}), (.12, it), (.4, it), (.6, {})], loop=False)
der = M(braco('L', -6), braco('R', -6), {'Peito': (X, 18), 'Cabeca': (X, 22), 'Palpebra.L': (X, 22), 'Palpebra.R': (X, 22), 'Sobrancelha.L': (Y, -14), 'Sobrancelha.R': (Y, 14), '_loc': {'Quadril': (0, 0, -.04)}})
K.acao(arm, 'Derrota', [(0, {}), (.5, der), (2, der)])
K.acao(arm, 'Piscar', [(0, {}), (.07, {'Palpebra.L': (X, 62), 'Palpebra.R': (X, 62)}), (.16, {})], loop=False)

K.pose(arm, {})
tris = K.exporta(SAIDA)
if PREVIA:
    K.previa(os.path.join(AQUI, 'previa'), 'capy')
    K.previa(os.path.join(AQUI, 'previa'), 'capy_rosto', vistas=(('frente', 0), ('tres4', 35)), alvo_z=1.5, dist=2.4)
