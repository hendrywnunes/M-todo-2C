import { useState, useEffect, useCallback } from "react";

// ── BRAND COLORS ──
const C = {
  black: "#080808", g950: "#0E0E0E", g900: "#141414", g800: "#1C1C1C",
  g700: "#282828", g600: "#3A3A3A", g500: "#555555", g400: "#7A7A7A",
  g300: "#A0A0A0", g100: "#E2E2DC", white: "#F2F2ED",
  orange: "#E8560A", orange2: "#C44808",
};

// ── IMC QUESTIONS ──
const PILLARS = [
  {
    id: 1, name: "Posicionamento Comercial", icon: "◎",
    questions: [
      { id: 1, text: "Quando alguém te pergunta o que você faz, sua resposta é clara e direta sobre para quem você trabalha e qual problema resolve?", options: ["Nunca consigo explicar com clareza — minha resposta muda toda vez", "Às vezes consigo, mas ainda é genérico", "Na maioria das vezes sou claro, mas ainda não me diferencio bem", "Sempre — tenho um discurso claro, específico e que gera interesse imediato"] },
      { id: 2, text: "Seu potencial cliente consegue entender rapidamente por que deveria escolher você e não outro profissional?", options: ["Não — nunca pensei nisso de forma estruturada", "Às vezes, mas depende muito da conversa", "Na maioria das vezes sim, mas ainda sinto que falta algo", "Sim — tenho clareza do meu diferencial e sei comunicá-lo"] },
      { id: 3, text: "Você se posiciona como especialista ou como mais um profissional disponível no mercado?", options: ["Ainda não tenho posicionamento definido", "Tento me posicionar, mas ainda me sinto genérico", "Tenho um posicionamento claro, mas ainda estou construindo autoridade", "Sou reconhecido como referência no meu nicho"] },
    ]
  },
  {
    id: 2, name: "Prospecção", icon: "⊕",
    questions: [
      { id: 4, text: "Com que frequência você realiza ações ativas de prospecção?", options: ["Raramente ou nunca — espero que os clientes apareçam", "Prospecta de forma esporádica, sem consistência", "Prospecta com alguma regularidade, mas sem uma rotina definida", "Prospecta todos os dias com método e volume consistente"] },
      { id: 5, text: "Você sabe exatamente quantas abordagens faz por semana e qual canal gera mais resultado?", options: ["Não tenho controle nenhum sobre isso", "Tenho uma noção aproximada, mas não meço com precisão", "Acompanho parcialmente, mas ainda falta consistência nos dados", "Sim — tenho controle total e sei exatamente de onde vêm minhas oportunidades"] },
      { id: 6, text: "Você consegue gerar novas oportunidades de forma previsível — sem depender de indicações ou sorte?", options: ["Não — minha prospecção é totalmente imprevisível", "Às vezes consigo, mas é irregular", "Na maioria dos meses consigo gerar oportunidades, mas ainda não é previsível", "Sim — tenho um sistema de prospecção que gera oportunidades de forma consistente"] },
    ]
  },
  {
    id: 3, name: "Abordagem Inicial", icon: "◈",
    questions: [
      { id: 7, text: "Sua primeira mensagem ou abordagem gera interesse e conversa — ou costuma ser ignorada?", options: ["Raramente recebo resposta — minhas abordagens costumam ser ignoradas", "Às vezes gero conversa, mas sem consistência", "Na maioria das vezes consigo engajar, mas sinto que poderia ser melhor", "Minhas abordagens geram conversa de forma consistente e natural"] },
      { id: 8, text: "Você adapta sua abordagem conforme o canal e o perfil da pessoa que está contatando?", options: ["Não — uso sempre a mesma abordagem para todos", "Às vezes adapto, mas sem critério definido", "Na maioria das vezes adapto, mas ainda de forma intuitiva", "Sempre — tenho abordagens específicas por canal e perfil de cliente"] },
      { id: 9, text: "No início de uma conversa, o potencial cliente consegue entender claramente por que vale a pena continuar falando com você?", options: ["Raramente — minha abertura não gera interesse suficiente", "Às vezes sim, mas depende muito da pessoa", "Na maioria das vezes sim, mas ainda falta clareza em alguns momentos", "Sempre — minha abertura é clara, relevante e gera engajamento imediato"] },
    ]
  },
  {
    id: 4, name: "Diagnóstico Consultivo", icon: "◉",
    questions: [
      { id: 10, text: "Nas suas reuniões, você faz mais perguntas ou apresenta soluções antes de entender o cliente?", options: ["Apresento soluções logo no início — ainda não tenho o hábito de perguntar", "Faço algumas perguntas, mas apresento a solução cedo demais", "Faço um diagnóstico razoável, mas poderia aprofundar mais", "Sempre faço um diagnóstico profundo antes de apresentar qualquer solução"] },
      { id: 11, text: "Você consegue explorar as consequências e o impacto real do problema do cliente?", options: ["Não — minhas perguntas ficam na superfície", "Às vezes consigo, mas sem estratégia definida", "Na maioria das vezes sim, mas ainda de forma inconsistente", "Sempre — uso perguntas de impacto que geram consciência e urgência no cliente"] },
      { id: 12, text: "O cliente termina a conversa de diagnóstico mais consciente do próprio problema do que quando chegou?", options: ["Raramente — a conversa não muda a percepção do cliente", "Às vezes sim, mas não é algo intencional", "Na maioria das vezes sim, mas ainda falta profundidade", "Sempre — meu diagnóstico gera clareza e move o cliente para a decisão"] },
    ]
  },
  {
    id: 5, name: "Condução de Reunião", icon: "◐",
    questions: [
      { id: 13, text: "Suas reuniões têm estrutura definida — com começo, meio e fim claros — ou costumam ser improvisadas?", options: ["São totalmente improvisadas — cada reunião é diferente sem critério", "Tenho uma estrutura básica, mas ainda improviso muito", "Tenho estrutura na maioria das reuniões, mas perco o fio em alguns momentos", "Sempre — minhas reuniões têm estrutura clara e o cliente percebe profissionalismo"] },
      { id: 14, text: "Você define próximos passos concretos ao final de cada reunião — com data, hora e compromisso claro?", options: ["Raramente — as reuniões terminam sem definição clara", "Às vezes defino, mas nem sempre o cliente se compromete", "Na maioria das vezes sim, mas ainda há reuniões que ficam em aberto", "Sempre — toda reunião termina com próximo passo definido e confirmado"] },
      { id: 15, text: "Você controla o tempo e o ritmo da reunião — ou o cliente é quem dita o caminho?", options: ["O cliente sempre toma o controle e eu perco o fio", "Às vezes mantenho o controle, mas não de forma consistente", "Na maioria das vezes conduzo bem, mas ainda perco o controle em alguns momentos", "Sempre — conduzo a reunião com segurança do início ao fim"] },
    ]
  },
  {
    id: 6, name: "Tratamento de Objeções", icon: "◑",
    questions: [
      { id: 16, text: "Quando o cliente apresenta uma objeção — 'preciso pensar', 'está caro', 'não é o momento' — qual é sua reação?", options: ["Trave, desisto ou aceito sem questionar", "Tento responder, mas me sinto inseguro e perco força", "Respondo com razoável segurança, mas nem sempre avanço", "Aprofundo a objeção, entendo a raiz e avanço com naturalidade"] },
      { id: 17, text: "Você consegue diferenciar uma objeção real de uma objeção reflexa?", options: ["Não — trato todas as objeções da mesma forma", "Às vezes percebo a diferença, mas não tenho estratégia clara", "Na maioria das vezes identifico, mas ainda erro na abordagem", "Sempre — identifico o tipo de objeção e tenho estratégia específica para cada uma"] },
      { id: 18, text: "Após tratar uma objeção, você consegue retomar o avanço da conversa e caminhar para o fechamento?", options: ["Raramente — a objeção costuma encerrar a conversa", "Às vezes avanço, mas sem consistência", "Na maioria das vezes avanço, mas ainda perco algumas oportunidades", "Sempre — uso a objeção como ponto de virada para o fechamento"] },
    ]
  },
  {
    id: 7, name: "Follow-up e Pipeline", icon: "◒",
    questions: [
      { id: 19, text: "Você perde oportunidades de negócio por não fazer follow-up no momento certo?", options: ["Sim — perco muitas oportunidades por falta de acompanhamento", "Às vezes — tenho follow-up inconsistente", "Raramente — faço follow-up na maioria dos casos, mas ainda escapa algum", "Nunca — tenho cadência de follow-up estruturada e não deixo oportunidades escaparem"] },
      { id: 20, text: "Você tem seu pipeline organizado — sabendo exatamente em que etapa cada lead está?", options: ["Não — não tenho pipeline organizado", "Tenho uma noção geral, mas sem organização formal", "Tenho pipeline organizado, mas nem sempre atualizado", "Sim — meu pipeline está sempre atualizado e me dá visibilidade total"] },
      { id: 21, text: "Você consegue retomar conversas que esfriaram e transformar indecisos em clientes?", options: ["Raramente — quando esfria, considero perdido", "Às vezes consigo, mas sem estratégia definida", "Na maioria das vezes sim, mas ainda de forma intuitiva", "Sempre — tenho estratégia de reativação e sei como retomar indecisos"] },
    ]
  },
  {
    id: 8, name: "Rotina e Métricas", icon: "◓",
    questions: [
      { id: 22, text: "Você tem uma rotina comercial semanal definida — com blocos de tempo para prospecção, follow-up e reuniões?", options: ["Não — minha rotina comercial é totalmente reativa", "Tenho uma rotina básica, mas sem disciplina consistente", "Tenho rotina definida, mas ainda deixo o operacional tomar o tempo comercial", "Sim — tenho blocos protegidos para cada atividade comercial e sigo com disciplina"] },
      { id: 23, text: "Você conhece suas taxas de conversão — de abordagem para reunião, de reunião para fechamento?", options: ["Não tenho ideia das minhas taxas", "Tenho uma noção aproximada, mas sem dados precisos", "Acompanho algumas taxas, mas não todas", "Sim — conheço todas as minhas taxas e uso esses dados para tomar decisões"] },
      { id: 24, text: "Você consegue prever com razoável precisão qual será seu resultado comercial no próximo mês?", options: ["Não — meu resultado é sempre uma surpresa", "Às vezes consigo estimar, mas com muita margem de erro", "Na maioria das vezes consigo prever, mas ainda há muita variação", "Sim — opero com previsibilidade e sei com antecedência o que vou gerar"] },
    ]
  },
];

const STAGES = [
  { min: 0, max: 39, label: "E1 — O Processo", color: "#E8560A", desc: "Você está no estágio inicial da jornada comercial. O esforço é alto, o resultado ainda é baixo — e isso é completamente normal. O problema não é estar aqui. É não saber que está.", action: "O que você precisa agora é de estrutura, método e acompanhamento para atravessar esse estágio com velocidade e consciência." },
  { min: 40, max: 59, label: "E2 — A Acomodação", color: "#F59E0B", desc: "Você está no estágio mais perigoso — o da acomodação silenciosa. O resultado existe, mas é inconsistente. Você faz volume sem método claro, e o crescimento estacionou.", action: "O que você precisa agora é de um diagnóstico honesto sobre onde exatamente você está perdendo resultado — e de método para sair do automático." },
  { min: 60, max: 79, label: "E3 — A Ilusão", color: "#EAB308", desc: "Você gera resultado — mas na força bruta. Funciona enquanto o ritmo sustenta. Tire dez dias do processo e o resultado some. O que você construiu foi resistência, não processo.", action: "O que você precisa agora é transformar esforço em método — para que seu resultado seja sustentável e previsível, não dependente da sua energia." },
  { min: 80, max: 100, label: "E4 — A Consciência", color: "#22C55E", desc: "Você opera com consciência comercial. Conhece seus números, tem processo definido e consegue prever resultados. Está no estágio onde performance vira previsibilidade.", action: "O que você precisa agora é refinar, escalar e manter a consistência — porque chegar ao E4 é uma conquista, mas permanecer aqui exige evolução contínua." },
];

function calcIMC(answers) {
  const pillarScores = PILLARS.map(p => {
    const total = p.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    return Math.round((total / 9) * 10);
  });
  const rawTotal = pillarScores.reduce((a, b) => a + b, 0);
  const imc = Math.round((rawTotal / 80) * 100);
  return { imc, pillarScores };
}

function getStage(imc) {
  return STAGES.find(s => imc >= s.min && imc <= s.max) || STAGES[0];
}

// ── STYLES ──
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#080808; color:#F2F2ED; font-family:'Barlow',sans-serif; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#0E0E0E; }
  ::-webkit-scrollbar-thumb { background:#3A3A3A; border-radius:2px; }
  input, textarea { font-family:'Barlow',sans-serif; }
`;

const s = {
  // Layout
  app: { minHeight:"100vh", background:C.black, color:C.white, fontFamily:"'Barlow',sans-serif", position:"relative", overflow:"hidden" },
  noise: { position:"fixed", inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, opacity:.022, pointerEvents:"none", zIndex:9999 },
  
  // Nav
  nav: { position:"fixed", top:0, left:0, right:0, zIndex:100, borderBottom:`1px solid ${C.g800}`, background:"rgba(8,8,8,0.95)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:56 },
  navLogo: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, letterSpacing:"-.01em", textTransform:"uppercase", color:C.white, display:"flex", alignItems:"center", gap:10 },
  navLogoAccent: { color:C.orange },
  navOrangeDot: { width:6, height:6, borderRadius:"50%", background:C.orange },
  navLinks: { display:"flex", gap:4 },
  navLink: (active) => ({ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color: active ? C.white : C.g500, padding:"6px 14px", border: active ? `1px solid ${C.g700}` : "1px solid transparent", background: active ? C.g900 : "transparent", cursor:"pointer", transition:"all .2s" }),
  navBtn: { fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:C.black, background:C.orange, border:"none", padding:"8px 20px", cursor:"pointer" },

  // Pages
  page: { minHeight:"100vh", paddingTop:56 },
  
  // Hero
  hero: { minHeight:"calc(100vh - 56px)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 64px", position:"relative", overflow:"hidden" },
  heroGlow: { position:"absolute", top:"-20%", right:"-10%", width:600, height:600, background:"radial-gradient(circle,rgba(232,86,10,.07) 0%,transparent 65%)", pointerEvents:"none" },
  heroBg: { position:"absolute", bottom:-60, right:-20, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:320, lineHeight:1, letterSpacing:"-.04em", textTransform:"uppercase", color:C.white, opacity:.015, pointerEvents:"none", userSelect:"none" },
  heroTopLine: { position:"absolute", top:0, left:0, right:0, height:3, background:C.orange },
  heroTag: { fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:".25em", textTransform:"uppercase", color:C.orange, display:"flex", alignItems:"center", gap:12, marginBottom:32 },
  heroTitle: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(52px,8vw,96px)", lineHeight:.88, letterSpacing:"-.025em", textTransform:"uppercase", marginBottom:28 },
  heroSub: { fontFamily:"'Barlow',sans-serif", fontWeight:300, fontSize:16, color:C.g300, lineHeight:1.7, maxWidth:540, marginBottom:48 },
  heroActions: { display:"flex", gap:12, flexWrap:"wrap" },
  btnPrimary: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, textTransform:"uppercase", letterSpacing:".06em", color:C.black, background:C.orange, border:"none", padding:"14px 36px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:10, transition:"background .2s" },
  btnSecondary: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, textTransform:"uppercase", letterSpacing:".06em", color:C.white, background:"transparent", border:`1px solid ${C.g600}`, padding:"14px 36px", cursor:"pointer", transition:"all .2s" },

  // Cards grid
  grid3: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, margin:"48px 0" },
  grid2: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:2, margin:"16px 0" },
  card: { background:C.g900, padding:"32px 28px", borderTop:`2px solid ${C.orange}`, position:"relative" },
  cardLabel: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:10 },
  cardTitle: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, textTransform:"uppercase", color:C.white, marginBottom:8 },
  cardText: { fontSize:13, color:C.g300, lineHeight:1.65 },

  // Section
  section: { padding:"80px 64px", borderBottom:`1px solid ${C.g800}` },
  sectionTag: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:16, display:"flex", alignItems:"center", gap:10 },
  sectionTitle: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(36px,5vw,64px)", lineHeight:.9, letterSpacing:"-.02em", textTransform:"uppercase", marginBottom:20 },

  // IMC Quiz
  quizWrap: { maxWidth:720, margin:"0 auto", padding:"80px 32px" },
  progressBar: { width:"100%", height:2, background:C.g800, marginBottom:48, position:"relative" },
  progressFill: (pct) => ({ width:`${pct}%`, height:"100%", background:C.orange, transition:"width .4s ease" }),
  pillarTag: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:16, display:"flex", alignItems:"center", gap:8 },
  questionText: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"clamp(20px,3vw,28px)", lineHeight:1.1, letterSpacing:"-.01em", textTransform:"uppercase", color:C.white, marginBottom:32 },
  optionBtn: (selected) => ({ width:"100%", textAlign:"left", padding:"16px 20px", border:`1px solid ${selected ? C.orange : C.g700}`, background: selected ? "rgba(232,86,10,.08)" : C.g950, color: selected ? C.white : C.g300, fontFamily:"'Barlow',sans-serif", fontSize:14, lineHeight:1.5, cursor:"pointer", marginBottom:8, transition:"all .15s", display:"flex", alignItems:"center", gap:12 }),
  optionDot: (selected) => ({ width:14, height:14, borderRadius:"50%", border:`1px solid ${selected ? C.orange : C.g600}`, background: selected ? C.orange : "transparent", flexShrink:0 }),
  
  // Form
  formGroup: { marginBottom:20 },
  label: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, display:"block", marginBottom:8 },
  input: { width:"100%", background:C.g900, border:`1px solid ${C.g700}`, color:C.white, fontFamily:"'Barlow',sans-serif", fontSize:14, padding:"12px 16px", outline:"none", transition:"border .2s" },
  
  // Result
  imcScore: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:96, lineHeight:1, letterSpacing:"-.04em" },
  pillarBar: (pct, color) => ({ height:4, background:C.g800, borderRadius:0, overflow:"hidden", marginTop:6 }),
  pillarFill: (pct, color) => ({ height:"100%", width:`${pct}%`, background: color || C.orange, transition:"width 1s ease" }),

  // Dashboard
  dashGrid: { display:"grid", gridTemplateColumns:"280px 1fr", gap:0, minHeight:"calc(100vh - 56px)" },
  sidebar: { background:C.g950, borderRight:`1px solid ${C.g800}`, padding:"32px 0", position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto" },
  sideItem: (active) => ({ display:"flex", alignItems:"center", gap:12, padding:"10px 24px", cursor:"pointer", background: active ? C.g900 : "transparent", borderLeft: active ? `2px solid ${C.orange}` : "2px solid transparent", color: active ? C.white : C.g500, fontFamily:"'Barlow',sans-serif", fontSize:13, transition:"all .15s" }),
  mainContent: { padding:"40px 48px", overflowY:"auto" },
  
  // Login
  loginWrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.black, position:"relative" },
  loginBox: { width:"100%", maxWidth:400, background:C.g950, border:`1px solid ${C.g800}`, padding:"48px 40px" },
  loginTitle: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase", letterSpacing:"-.01em", marginBottom:8 },
  loginSub: { fontSize:13, color:C.g400, marginBottom:32 },

  // Mentorado card
  menteeCard: { background:C.g900, border:`1px solid ${C.g800}`, padding:"24px", marginBottom:2, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", transition:"border .15s" },
  badge: (color) => ({ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:".15em", textTransform:"uppercase", color: color || C.orange, border:`1px solid ${color || C.orange}`, padding:"3px 8px" }),

  // Session card
  sessionCard: { background:C.g900, border:`1px solid ${C.g800}`, padding:"20px 24px", marginBottom:2 },

  // Metric card
  metricCard: { background:C.g900, borderTop:`2px solid ${C.orange}`, padding:"24px", textAlign:"center" },
  metricNum: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:42, color:C.orange, lineHeight:1 },
  metricLabel: { fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:".18em", textTransform:"uppercase", color:C.g500, marginTop:6 },
};

// ── RADAR CHART SVG ──
function RadarChart({ scores, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = scores.length;
  const pts = scores.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ratio = s / 10;
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) };
  });
  const grid = Array.from({ length: 5 }, (_, gi) => {
    const ratio = (gi + 1) / 5;
    const gpts = Array.from({ length: n }, (__, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`;
    }).join(" ");
    return gpts;
  });
  const polygon = pts.map(p => `${p.x},${p.y}`).join(" ");
  const axes = Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {grid.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke={C.g700} strokeWidth={.5} />)}
      {axes.map((a, i) => <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke={C.g700} strokeWidth={.5} />)}
      <polygon points={polygon} fill="rgba(232,86,10,.15)" stroke={C.orange} strokeWidth={1.5} />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill={C.orange} />)}
    </svg>
  );
}

// ── IMC PUBLIC TEST ──
function IMCTest({ onComplete, isLoggedIn, menteeId }) {
  const [step, setStep] = useState("intro"); // intro | warning | quiz | capture | result
  const [currentPillar, setCurrentPillar] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [result, setResult] = useState(null);

  const allQuestions = PILLARS.flatMap(p => p.questions);
  const totalQ = allQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQ) * 100;

  const currentPillarData = PILLARS[currentPillar];
  const currentQuestion = currentPillarData?.questions[currentQ];

  function selectAnswer(qId, val) {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    setTimeout(() => {
      const nextQ = currentQ + 1;
      if (nextQ < currentPillarData.questions.length) {
        setCurrentQ(nextQ);
      } else {
        const nextP = currentPillar + 1;
        if (nextP < PILLARS.length) {
          setCurrentPillar(nextP);
          setCurrentQ(0);
        } else {
          if (isLoggedIn) {
            const { imc, pillarScores } = calcIMC(answers);
            setResult({ imc, pillarScores, ...formData });
            setStep("result");
          } else {
            setStep("capture");
          }
        }
      }
    }, 200);
  }

  function submitCapture() {
    if (!formData.name || !formData.email) return;
    const { imc, pillarScores } = calcIMC(answers);
    setResult({ imc, pillarScores, ...formData });
    setStep("result");
  }

  if (step === "intro") return (
    <div style={s.quizWrap}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ width:20, height:1, background:C.orange, display:"inline-block" }}></span>
        IMC — Índice de Maturidade Comercial
      </div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(44px,7vw,80px)", lineHeight:.88, letterSpacing:"-.025em", textTransform:"uppercase", marginBottom:24 }}>
        Quão maduro<br/><span style={{ color:C.orange }}>comercialmente</span><br/>você é hoje?
      </div>
      <p style={{ fontSize:15, color:C.g300, lineHeight:1.75, maxWidth:520, marginBottom:16 }}>
        O IMC avalia sua maturidade comercial em 8 pilares do ciclo de vendas no mercado financeiro — e te diz exatamente onde você precisa evoluir.
      </p>
      <p style={{ fontSize:13, color:C.g500, marginBottom:40, fontFamily:"'DM Mono',monospace" }}>24 perguntas · ~8 minutos · resultado imediato</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, marginBottom:40 }}>
        {PILLARS.map(p => (
          <div key={p.id} style={{ background:C.g900, padding:"16px 14px", borderTop:`2px solid ${C.g700}` }}>
            <div style={{ fontSize:18, marginBottom:6, color:C.orange }}>{p.icon}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, textTransform:"uppercase", color:C.g300 }}>{p.name}</div>
          </div>
        ))}
      </div>
      <button style={s.btnPrimary} onClick={() => setStep("warning")}>
        Iniciar diagnóstico →
      </button>
    </div>
  );

  if (step === "warning") return (
    <div style={s.quizWrap}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:32, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ width:20, height:1, background:C.orange, display:"inline-block" }}></span>
        Antes de começar
      </div>

      {/* Title */}
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(36px,5vw,60px)", lineHeight:.9, letterSpacing:"-.025em", textTransform:"uppercase", marginBottom:32 }}>
        Este teste só<br/>funciona se você<br/><span style={{ color:C.orange }}>for honesto.</span>
      </div>

      {/* Warning box */}
      <div style={{ border:`1px solid ${C.g700}`, borderLeft:`3px solid ${C.orange}`, background:C.g950, padding:"32px 36px", marginBottom:24 }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:20 }}>
          O que é este diagnóstico
        </div>
        <p style={{ fontSize:15, color:C.g100, lineHeight:1.8, marginBottom:0 }}>
          O IMC é um teste de <strong style={{ color:C.white }}>autoavaliação</strong>. Não existe resposta certa ou errada — existe a sua realidade comercial hoje.
        </p>
      </div>

      {/* Points */}
      <div style={{ display:"flex", flexDirection:"column", gap:2, marginBottom:32 }}>
        {[
          ["◎", "Leia cada pergunta com calma", "Não responda com base no que você acha que deveria fazer — responda com base no que você realmente faz, com consistência, no dia a dia."],
          ["◈", "Evite o viés do ideal", "A tendência natural é escolher a opção que representa quem queremos ser. Resista a isso. O diagnóstico precisa retratar quem você é hoje."],
          ["◉", "Seja específico, não genérico", "Se você faz algo 'às vezes' ou 'quando lembra', essa não é a opção que diz 'sempre'. Seja preciso."],
          ["◐", "Respostas infladas distorcem o resultado", "Um IMC alto baseado em respostas desonestas não te ajuda — apenas adia o enfrentamento dos seus pontos cegos. O diagnóstico é para você."],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ background:C.g900, padding:"20px 24px", display:"flex", gap:16, alignItems:"flex-start" }}>
            <span style={{ color:C.orange, fontSize:16, flexShrink:0, marginTop:2 }}>{icon}</span>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, textTransform:"uppercase", color:C.white, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:13, color:C.g400, lineHeight:1.65 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Final note */}
      <div style={{ background:C.g950, border:`1px solid ${C.g800}`, padding:"20px 24px", marginBottom:36, textAlign:"center" }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:C.g400, lineHeight:1.7 }}>
          Quanto mais honesto você for, mais preciso será o plano de evolução que o diagnóstico vai te entregar.
        </p>
      </div>

      <div style={{ display:"flex", gap:10 }}>
        <button style={s.btnPrimary} onClick={() => setStep("quiz")}>
          Estou pronto — iniciar →
        </button>
        <button style={s.btnSecondary} onClick={() => setStep("intro")}>
          Voltar
        </button>
      </div>
    </div>
  );

  if (step === "quiz") return (
    <div style={s.quizWrap}>
      <div style={s.progressBar}>
        <div style={s.progressFill(progress)}></div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40 }}>
        <div style={s.pillarTag}>
          <span style={{ color:C.orange, fontSize:18 }}>{currentPillarData.icon}</span>
          Pilar {currentPillarData.id} · {currentPillarData.name}
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.g600 }}>{answeredCount}/{totalQ}</div>
      </div>
      <div style={s.questionText}>{currentQuestion?.text}</div>
      <div>
        {currentQuestion?.options.map((opt, i) => (
          <button key={i} style={s.optionBtn(answers[currentQuestion.id] === i)} onClick={() => selectAnswer(currentQuestion.id, i)}>
            <div style={s.optionDot(answers[currentQuestion.id] === i)}></div>
            <span>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (step === "capture") return (
    <div style={s.quizWrap}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:24 }}>Quase lá</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:48, lineHeight:.9, letterSpacing:"-.02em", textTransform:"uppercase", marginBottom:16 }}>
        Seu resultado<br/><span style={{ color:C.orange }}>está pronto.</span>
      </div>
      <p style={{ fontSize:14, color:C.g300, lineHeight:1.7, maxWidth:480, marginBottom:40 }}>
        Preencha seus dados para liberar o diagnóstico completo — incluindo sua pontuação em cada pilar e o plano de evolução.
      </p>
      <div style={s.formGroup}>
        <label style={s.label}>Nome completo</label>
        <input style={s.input} value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Seu nome" />
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>WhatsApp</label>
        <input style={s.input} value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="(00) 00000-0000" />
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>E-mail</label>
        <input style={s.input} value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" />
      </div>
      <button style={{ ...s.btnPrimary, marginTop:8, width:"100%", justifyContent:"center" }} onClick={submitCapture}>
        Ver meu resultado →
      </button>
    </div>
  );

  if (step === "result" && result) {
    const stage = getStage(result.imc);
    return (
      <div style={{ maxWidth:800, margin:"0 auto", padding:"80px 32px" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:24 }}>
          Diagnóstico IMC {result.name ? `· ${result.name}` : ""}
        </div>
        {/* Score hero */}
        <div style={{ background:C.g950, borderTop:`3px solid ${stage.color}`, padding:"48px 40px", marginBottom:2, display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.g500, marginBottom:12 }}>Seu IMC</div>
            <div style={{ ...s.imcScore, color:stage.color }}>{result.imc}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, textTransform:"uppercase", color:C.white, marginTop:8 }}>{stage.label}</div>
          </div>
          <RadarChart scores={result.pillarScores} size={180} />
        </div>
        {/* Stage description */}
        <div style={{ background:C.g900, padding:"32px 40px", marginBottom:2, borderLeft:`3px solid ${stage.color}` }}>
          <p style={{ fontSize:15, color:C.g100, lineHeight:1.8, marginBottom:16 }}>{stage.desc}</p>
          <p style={{ fontSize:14, color:C.g300, lineHeight:1.7 }}>{stage.action}</p>
        </div>
        {/* Pillar breakdown */}
        <div style={{ background:C.g950, padding:"32px 40px", marginBottom:2 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:24 }}>Resultado por pilar</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 32px" }}>
            {PILLARS.map((p, i) => (
              <div key={p.id}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ fontSize:12, color:C.g300 }}>{p.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color: result.pillarScores[i] >= 7 ? "#22C55E" : result.pillarScores[i] >= 4 ? "#EAB308" : C.orange }}>{result.pillarScores[i]}/10</div>
                </div>
                <div style={s.pillarBar()}>
                  <div style={{ height:4, width:`${result.pillarScores[i] * 10}%`, background: result.pillarScores[i] >= 7 ? "#22C55E" : result.pillarScores[i] >= 4 ? "#EAB308" : C.orange, transition:"width 1s ease" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* CTA */}
        <div style={{ background:C.g900, padding:"40px", textAlign:"center", borderTop:`2px solid ${C.orange}` }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, textTransform:"uppercase", marginBottom:12 }}>
            Pronto para chegar ao <span style={{ color:C.orange }}>E4?</span>
          </div>
          <p style={{ fontSize:14, color:C.g300, maxWidth:440, margin:"0 auto 28px", lineHeight:1.7 }}>
            Este diagnóstico é o primeiro passo. O próximo é desenvolver as competências que vão transformar sua maturidade comercial com método e acompanhamento individualizado.
          </p>
          <button style={s.btnPrimary} onClick={() => window.open("https://nuneshendryw.com.br/diagnostico", "_blank")}>
            Quero o diagnóstico gratuito →
          </button>
        </div>
      </div>
    );
  }
  return null;
}

// ── PLATFORM DASHBOARD ──
function Dashboard({ user, onLogout }) {
  const [view, setView] = useState("home");
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [actionPlans, setActionPlans] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [showNewSession, setShowNewSession] = useState(false);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [showNewMentee, setShowNewMentee] = useState(false);
  const [newSession, setNewSession] = useState({ date: "", summary: "", insights: "", nextSteps: "" });
  const [newPlan, setNewPlan] = useState({ task: "", deadline: "", status: "pending" });
  const [newMentee, setNewMentee] = useState({ name: "", email: "", password: "", segment: "", goal: "" });
  const [imcView, setImcView] = useState(false);

  const isMentor = user.role === "mentor";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const m = await window.storage.get("mentees");
      if (m) setMentees(JSON.parse(m.value));
      const s = await window.storage.get("sessions");
      if (s) setSessions(JSON.parse(s.value));
      const a = await window.storage.get("actionPlans");
      if (a) setActionPlans(JSON.parse(a.value));
      const me = await window.storage.get("metrics");
      if (me) setMetrics(JSON.parse(me.value));
    } catch (e) {}
  }

  async function saveMentees(data) {
    setMentees(data);
    await window.storage.set("mentees", JSON.stringify(data));
  }
  async function saveSessions(data) {
    setSessions(data);
    await window.storage.set("sessions", JSON.stringify(data));
  }
  async function saveActionPlans(data) {
    setActionPlans(data);
    await window.storage.set("actionPlans", JSON.stringify(data));
  }
  async function saveMetrics(data) {
    setMetrics(data);
    await window.storage.set("metrics", JSON.stringify(data));
  }

  function addMentee() {
    if (!newMentee.name || !newMentee.email) return;
    const m = { ...newMentee, id: Date.now().toString(), createdAt: new Date().toISOString(), imcHistory: [] };
    saveMentees([...mentees, m]);
    setNewMentee({ name: "", email: "", password: "", segment: "", goal: "" });
    setShowNewMentee(false);
  }

  function addSession() {
    if (!newSession.summary || !selectedMentee) return;
    const s = { ...newSession, id: Date.now().toString(), menteeId: selectedMentee.id, createdAt: new Date().toISOString() };
    saveSessions([...sessions, s]);
    setNewSession({ date: "", summary: "", insights: "", nextSteps: "" });
    setShowNewSession(false);
  }

  function addPlan() {
    if (!newPlan.task || !selectedMentee) return;
    const p = { ...newPlan, id: Date.now().toString(), menteeId: selectedMentee.id, createdAt: new Date().toISOString() };
    saveActionPlans([...actionPlans, p]);
    setNewPlan({ task: "", deadline: "", status: "pending" });
    setShowNewPlan(false);
  }

  function togglePlanStatus(id) {
    const updated = actionPlans.map(p => p.id === id ? { ...p, status: p.status === "done" ? "pending" : "done" } : p);
    saveActionPlans(updated);
  }

  const menteeSessions = selectedMentee ? sessions.filter(s => s.menteeId === selectedMentee.id) : [];
  const menteePlans = selectedMentee ? actionPlans.filter(p => p.menteeId === selectedMentee.id) : [];
  const myMentee = !isMentor ? mentees.find(m => m.email === user.email) : null;

  const sideItems = isMentor
    ? [
        { id: "home", label: "Dashboard", icon: "▣" },
        { id: "mentees", label: "Mentorados", icon: "◎" },
        { id: "imc", label: "IMC Público", icon: "◈" },
      ]
    : [
        { id: "home", label: "Minha Área", icon: "▣" },
        { id: "sessions", label: "Sessões", icon: "◎" },
        { id: "plans", label: "Planos de Ação", icon: "◈" },
        { id: "metrics", label: "Métricas", icon: "◉" },
        { id: "imc", label: "Meu IMC", icon: "◐" },
      ];

  function renderHome() {
    if (!isMentor) {
      const me = myMentee;
      const mySessions = me ? sessions.filter(s => s.menteeId === me.id) : [];
      const myPlans = me ? actionPlans.filter(p => p.menteeId === me.id) : [];
      const pending = myPlans.filter(p => p.status === "pending").length;
      const done = myPlans.filter(p => p.status === "done").length;
      return (
        <div>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:8 }}>Bem-vindo de volta</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase" }}>{user.name}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginBottom:32 }}>
            <div style={s.metricCard}><div style={s.metricNum}>{mySessions.length}</div><div style={s.metricLabel}>Sessões realizadas</div></div>
            <div style={s.metricCard}><div style={s.metricNum}>{pending}</div><div style={s.metricLabel}>Planos pendentes</div></div>
            <div style={s.metricCard}><div style={s.metricNum}>{done}</div><div style={s.metricLabel}>Planos concluídos</div></div>
          </div>
          {mySessions.length > 0 && (
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:16 }}>Última sessão</div>
              <div style={s.sessionCard}>
                <div style={{ fontSize:11, color:C.g500, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>{mySessions[mySessions.length-1].date}</div>
                <div style={{ fontSize:14, color:C.g100, lineHeight:1.65 }}>{mySessions[mySessions.length-1].summary}</div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:8 }}>Visão geral</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase" }}>Dashboard</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, marginBottom:40 }}>
          <div style={s.metricCard}><div style={s.metricNum}>{mentees.length}</div><div style={s.metricLabel}>Mentorados ativos</div></div>
          <div style={s.metricCard}><div style={s.metricNum}>{sessions.length}</div><div style={s.metricLabel}>Sessões registradas</div></div>
          <div style={s.metricCard}><div style={s.metricNum}>{actionPlans.filter(p=>p.status==="pending").length}</div><div style={s.metricLabel}>Planos pendentes</div></div>
          <div style={s.metricCard}><div style={s.metricNum}>{actionPlans.filter(p=>p.status==="done").length}</div><div style={s.metricLabel}>Planos concluídos</div></div>
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:16 }}>Mentorados recentes</div>
        {mentees.slice(-3).map(m => (
          <div key={m.id} style={s.menteeCard} onClick={() => { setSelectedMentee(m); setView("menteeDetail"); }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, textTransform:"uppercase" }}>{m.name}</div>
              <div style={{ fontSize:12, color:C.g500, marginTop:2 }}>{m.segment}</div>
            </div>
            <div style={s.badge()}>{sessions.filter(s=>s.menteeId===m.id).length} sessões</div>
          </div>
        ))}
      </div>
    );
  }

  function renderMentees() {
    return (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:8 }}>Gestão</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase" }}>Mentorados</div>
          </div>
          <button style={s.btnPrimary} onClick={() => setShowNewMentee(true)}>+ Novo mentorado</button>
        </div>

        {showNewMentee && (
          <div style={{ background:C.g950, border:`1px solid ${C.g800}`, padding:"32px", marginBottom:16 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:20 }}>Cadastrar mentorado</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["name","Nome completo"],["email","E-mail"],["password","Senha de acesso"],["segment","Segmento"],["goal","Objetivo principal"]].map(([k,l]) => (
                <div key={k} style={s.formGroup}>
                  <label style={s.label}>{l}</label>
                  <input style={s.input} value={newMentee[k]} onChange={e => setNewMentee(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <button style={s.btnPrimary} onClick={addMentee}>Cadastrar</button>
              <button style={s.btnSecondary} onClick={() => setShowNewMentee(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {mentees.map(m => (
          <div key={m.id} style={s.menteeCard} onClick={() => { setSelectedMentee(m); setView("menteeDetail"); }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:20, textTransform:"uppercase" }}>{m.name}</div>
              <div style={{ fontSize:12, color:C.g500, marginTop:4 }}>{m.email} · {m.segment}</div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <div style={s.badge()}>{sessions.filter(s=>s.menteeId===m.id).length} sessões</div>
              <div style={{ fontSize:12, color:C.g400 }}>→</div>
            </div>
          </div>
        ))}
        {mentees.length === 0 && <div style={{ padding:"40px", textAlign:"center", color:C.g600, fontSize:13 }}>Nenhum mentorado cadastrado ainda.</div>}
      </div>
    );
  }

  function renderMenteeDetail() {
    if (!selectedMentee) return null;
    const mSessions = sessions.filter(s => s.menteeId === selectedMentee.id);
    const mPlans = actionPlans.filter(p => p.menteeId === selectedMentee.id);
    const lastIMC = selectedMentee.imcHistory?.[selectedMentee.imcHistory.length - 1];

    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
          <button style={{ background:"none", border:"none", color:C.g500, cursor:"pointer", fontSize:20 }} onClick={() => setView("mentees")}>←</button>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:4 }}>Mentorado</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, textTransform:"uppercase" }}>{selectedMentee.name}</div>
            <div style={{ fontSize:12, color:C.g500 }}>{selectedMentee.segment} · {selectedMentee.email}</div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginBottom:32 }}>
          <div style={s.metricCard}><div style={s.metricNum}>{mSessions.length}</div><div style={s.metricLabel}>Sessões</div></div>
          <div style={s.metricCard}><div style={s.metricNum}>{mPlans.filter(p=>p.status==="pending").length}</div><div style={s.metricLabel}>Planos pendentes</div></div>
          <div style={s.metricCard}><div style={{ ...s.metricNum, fontSize:32 }}>{lastIMC ? lastIMC.imc : "—"}</div><div style={s.metricLabel}>IMC atual</div></div>
        </div>

        {/* Sessions */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange }}>Sessões</div>
            <button style={s.btnPrimary} onClick={() => setShowNewSession(true)}>+ Nova sessão</button>
          </div>
          {showNewSession && (
            <div style={{ background:C.g950, padding:"28px", marginBottom:8, border:`1px solid ${C.g800}` }}>
              {[["date","Data","date"],["summary","Resumo da sessão","text"],["insights","Insights","text"],["nextSteps","Próximos passos","text"]].map(([k,l,t]) => (
                <div key={k} style={s.formGroup}>
                  <label style={s.label}>{l}</label>
                  {t === "text" ? <textarea style={{ ...s.input, height:70, resize:"vertical" }} value={newSession[k]} onChange={e => setNewSession(p => ({ ...p, [k]: e.target.value }))} /> : <input type={t} style={s.input} value={newSession[k]} onChange={e => setNewSession(p => ({ ...p, [k]: e.target.value }))} />}
                </div>
              ))}
              <div style={{ display:"flex", gap:8 }}>
                <button style={s.btnPrimary} onClick={addSession}>Salvar</button>
                <button style={s.btnSecondary} onClick={() => setShowNewSession(false)}>Cancelar</button>
              </div>
            </div>
          )}
          {mSessions.map(ss => (
            <div key={ss.id} style={s.sessionCard}>
              <div style={{ fontSize:11, color:C.orange, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>{ss.date}</div>
              <div style={{ fontSize:14, color:C.g100, marginBottom:8 }}>{ss.summary}</div>
              {ss.nextSteps && <div style={{ fontSize:12, color:C.g400 }}>→ {ss.nextSteps}</div>}
            </div>
          ))}
        </div>

        {/* Action Plans */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange }}>Planos de ação</div>
            <button style={s.btnPrimary} onClick={() => setShowNewPlan(true)}>+ Novo plano</button>
          </div>
          {showNewPlan && (
            <div style={{ background:C.g950, padding:"28px", marginBottom:8, border:`1px solid ${C.g800}` }}>
              <div style={s.formGroup}><label style={s.label}>Tarefa</label><input style={s.input} value={newPlan.task} onChange={e => setNewPlan(p => ({ ...p, task: e.target.value }))} /></div>
              <div style={s.formGroup}><label style={s.label}>Prazo</label><input type="date" style={s.input} value={newPlan.deadline} onChange={e => setNewPlan(p => ({ ...p, deadline: e.target.value }))} /></div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={s.btnPrimary} onClick={addPlan}>Salvar</button>
                <button style={s.btnSecondary} onClick={() => setShowNewPlan(false)}>Cancelar</button>
              </div>
            </div>
          )}
          {mPlans.map(p => (
            <div key={p.id} style={{ ...s.sessionCard, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:16, height:16, border:`1px solid ${p.status==="done" ? "#22C55E" : C.g600}`, background: p.status==="done" ? "#22C55E" : "transparent", cursor:"pointer", flexShrink:0 }} onClick={() => togglePlanStatus(p.id)}></div>
                <div style={{ fontSize:14, color: p.status==="done" ? C.g500 : C.g100, textDecoration: p.status==="done" ? "line-through" : "none" }}>{p.task}</div>
              </div>
              {p.deadline && <div style={{ fontSize:11, color:C.g600, fontFamily:"'DM Mono',monospace" }}>{p.deadline}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderMetrics() {
    const me = myMentee;
    const mId = me?.id || "";
    const mMetrics = metrics[mId] || { contacts: "", meetings: "", attendance: "", conversions: "", cycleTime: "" };
    
    function updateMetric(key, val) {
      const updated = { ...metrics, [mId]: { ...mMetrics, [key]: val } };
      saveMetrics(updated);
    }

    const fields = [
      ["contacts", "Contatos realizados / semana"],
      ["meetings", "Reuniões agendadas / mês"],
      ["attendance", "Taxa de comparecimento (%)"],
      ["conversions", "Taxa de conversão (%)"],
      ["cycleTime", "Tempo médio do ciclo (dias)"],
    ];

    return (
      <div>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:8 }}>Acompanhamento</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase" }}>Minhas Métricas</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginBottom:24 }}>
          {fields.map(([k, l]) => (
            <div key={k} style={s.metricCard}>
              <div style={s.metricLabel}>{l}</div>
              <input
                style={{ background:"transparent", border:"none", color:C.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:42, width:"100%", textAlign:"center", outline:"none", marginTop:8 }}
                value={mMetrics[k] || ""}
                onChange={e => updateMetric(k, e.target.value)}
                placeholder="—"
              />
            </div>
          ))}
        </div>
        <div style={{ background:C.g900, padding:"24px", border:`1px solid ${C.g800}` }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:C.orange, marginBottom:16 }}>Como interpretar seus números</div>
          <div style={{ fontSize:13, color:C.g300, lineHeight:1.75 }}>
            <p style={{ marginBottom:8 }}>→ <strong style={{ color:C.white }}>Contatos baixos</strong> — problema de disciplina na prospecção</p>
            <p style={{ marginBottom:8 }}>→ <strong style={{ color:C.white }}>Agendamentos baixos</strong> — problema na comunicação de valor</p>
            <p style={{ marginBottom:8 }}>→ <strong style={{ color:C.white }}>Comparecimento baixo</strong> — problema na confirmação e qualificação</p>
            <p style={{ marginBottom:8 }}>→ <strong style={{ color:C.white }}>Conversão baixa</strong> — problema na apresentação ou fechamento</p>
            <p>→ <strong style={{ color:C.white }}>Ciclo longo</strong> — problema no follow-up ou na qualificação inicial</p>
          </div>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (view === "home") return renderHome();
    if (view === "mentees") return renderMentees();
    if (view === "menteeDetail") return renderMenteeDetail();
    if (view === "imc") return <IMCTest isLoggedIn={true} menteeId={user.id} />;
    if (view === "sessions") {
      const me = myMentee;
      const mySessions = me ? sessions.filter(s => s.menteeId === me.id) : [];
      return (
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase", marginBottom:32 }}>Minhas Sessões</div>
          {mySessions.length === 0 && <div style={{ color:C.g600, fontSize:13 }}>Nenhuma sessão registrada ainda.</div>}
          {mySessions.map(ss => (
            <div key={ss.id} style={s.sessionCard}>
              <div style={{ fontSize:11, color:C.orange, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>{ss.date}</div>
              <div style={{ fontSize:14, color:C.g100, marginBottom:8 }}>{ss.summary}</div>
              {ss.insights && <div style={{ fontSize:12, color:C.g400, marginBottom:4 }}>💡 {ss.insights}</div>}
              {ss.nextSteps && <div style={{ fontSize:12, color:C.g400 }}>→ {ss.nextSteps}</div>}
            </div>
          ))}
        </div>
      );
    }
    if (view === "plans") {
      const me = myMentee;
      const myPlans = me ? actionPlans.filter(p => p.menteeId === me.id) : [];
      return (
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:"uppercase", marginBottom:32 }}>Planos de Ação</div>
          {myPlans.length === 0 && <div style={{ color:C.g600, fontSize:13 }}>Nenhum plano de ação ainda.</div>}
          {myPlans.map(p => (
            <div key={p.id} style={{ ...s.sessionCard, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:16, height:16, border:`1px solid ${p.status==="done" ? "#22C55E" : C.g600}`, background: p.status==="done" ? "#22C55E" : "transparent", cursor:"pointer" }} onClick={() => togglePlanStatus(p.id)}></div>
                <div style={{ fontSize:14, color: p.status==="done" ? C.g500 : C.g100, textDecoration: p.status==="done" ? "line-through" : "none" }}>{p.task}</div>
              </div>
              {p.deadline && <div style={{ fontSize:11, color:C.g600, fontFamily:"'DM Mono',monospace" }}>{p.deadline}</div>}
            </div>
          ))}
        </div>
      );
    }
    if (view === "metrics") return renderMetrics();
    return null;
  }

  return (
    <div style={s.dashGrid}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={{ padding:"0 24px 24px", borderBottom:`1px solid ${C.g800}`, marginBottom:16 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, textTransform:"uppercase" }}>Mentoria <span style={{ color:C.orange }}>2C</span></div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.g600, marginTop:4 }}>{user.name}</div>
        </div>
        {sideItems.map(item => (
          <div key={item.id} style={s.sideItem(view === item.id || (view === "menteeDetail" && item.id === "mentees"))} onClick={() => { setView(item.id); if (item.id !== "menteeDetail") setSelectedMentee(null); }}>
            <span style={{ fontSize:14 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ position:"absolute", bottom:20, left:0, right:0, padding:"0 24px" }}>
          <button style={{ ...s.btnSecondary, width:"100%", fontSize:11, padding:"8px", justifyContent:"center" }} onClick={onLogout}>Sair</button>
        </div>
      </div>
      {/* Main */}
      <div style={s.mainContent}>{renderContent()}</div>
    </div>
  );
}

// ── LOGIN ──
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    if (email === "mentor@mentoria2c.com" && password === "mentor2c") {
      onLogin({ id: "mentor", name: "Hendryw Nunes", email, role: "mentor" });
      return;
    }
    try {
      const m = await window.storage.get("mentees");
      if (m) {
        const mentees = JSON.parse(m.value);
        const found = mentees.find(me => me.email === email && me.password === password);
        if (found) {
          onLogin({ id: found.id, name: found.name, email, role: "mentee" });
          return;
        }
      }
    } catch (e) {}
    setError("E-mail ou senha incorretos.");
  }

  return (
    <div style={s.loginWrap}>
      <div style={s.noise}></div>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:200, letterSpacing:"-.04em", textTransform:"uppercase", color:C.white, opacity:.015, pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap" }}>2C</div>
      <div style={s.loginBox}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:C.orange, marginBottom:16 }}>Acesso à plataforma</div>
        <div style={s.loginTitle}>Mentoria <span style={{ color:C.orange }}>2C</span></div>
        <div style={s.loginSub}>Faça login para acessar sua área.</div>
        <div style={s.formGroup}><label style={s.label}>E-mail</label><input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></div>
        <div style={s.formGroup}><label style={s.label}>Senha</label><input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" /></div>
        {error && <div style={{ fontSize:12, color:C.orange, marginBottom:16 }}>{error}</div>}
        <button style={{ ...s.btnPrimary, width:"100%", justifyContent:"center" }} onClick={handleLogin}>Entrar →</button>
        <div style={{ fontSize:11, color:C.g600, marginTop:20, fontFamily:"'DM Mono',monospace" }}>Mentor: mentor@mentoria2c.com / mentor2c</div>
      </div>
    </div>
  );
}

// ── LANDING PAGE ──
function Landing({ onNavigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroGlow}></div>
        <div style={s.heroBg}>IMC</div>
        <div style={s.heroTopLine}></div>
        <div style={s.heroTag}>
          <span style={{ width:20, height:1, background:C.orange, display:"inline-block" }}></span>
          Hendryw Nunes · Mentor Comercial
        </div>
        <div style={s.heroTitle}>
          Performance<br/>comercial não é<br/><span style={{ color:C.orange }}>talento.</span><br/>É consciência.
        </div>
        <div style={s.heroSub}>
          Descubra seu Índice de Maturidade Comercial e entenda exatamente onde você está — e o que precisa mudar para prosperar no mercado financeiro.
        </div>
        <div style={s.heroActions}>
          <button style={s.btnPrimary} onClick={() => onNavigate("imc")}>Fazer o IMC gratuito →</button>
          <button style={s.btnSecondary} onClick={() => onNavigate("login")}>Acessar plataforma</button>
        </div>
      </div>

      {/* About IMC */}
      <div style={s.section}>
        <div style={s.sectionTag}><span style={{ width:16, height:1, background:C.orange, display:"inline-block" }}></span>O que é o IMC</div>
        <div style={s.sectionTitle}>Índice de<br/><span style={{ color:C.orange }}>Maturidade</span><br/>Comercial</div>
        <p style={{ fontSize:15, color:C.g300, maxWidth:560, lineHeight:1.8, marginBottom:40 }}>
          O IMC avalia sua maturidade comercial em 8 pilares do ciclo de vendas no mercado financeiro. Não mede carisma nem motivação — mede comportamento, processo e execução.
        </p>
        <div style={s.grid3}>
          {[
            ["◎", "Diagnóstico real", "24 perguntas que avaliam cada etapa do seu processo comercial com precisão."],
            ["◈", "8 pilares", "De posicionamento a métricas — o ciclo comercial completo do mercado financeiro."],
            ["◉", "4 estágios", "Seu resultado é mapeado nos 4 Estágios da Performance Comercial — o 4-EPC."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={s.card}>
              <div style={{ fontSize:24, color:C.orange, marginBottom:12 }}>{icon}</div>
              <div style={s.cardTitle}>{title}</div>
              <div style={s.cardText}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-EPC */}
      <div style={s.section}>
        <div style={s.sectionTag}><span style={{ width:16, height:1, background:C.orange, display:"inline-block" }}></span>4-EPC</div>
        <div style={s.sectionTitle}>Os 4 Estágios<br/>da Performance<br/><span style={{ color:C.orange }}>Comercial</span></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, marginTop:40 }}>
          {STAGES.map((st, i) => (
            <div key={i} style={{ background:C.g900, padding:"28px 24px", borderTop:`2px solid ${st.color}` }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:48, color:st.color, lineHeight:1, marginBottom:12 }}>E{i+1}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, textTransform:"uppercase", color:C.white, marginBottom:8 }}>{st.label.split("—")[1]?.trim()}</div>
              <div style={{ fontSize:12, color:C.g400, lineHeight:1.65 }}>{st.desc.split(".")[0]}.</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...s.section, textAlign:"center", borderBottom:"none" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:".25em", textTransform:"uppercase", color:C.orange, marginBottom:20, display:"inline-flex", alignItems:"center", gap:10 }}>
          <span style={{ width:20, height:1, background:C.orange, display:"inline-block" }}></span>
          Próximo passo
          <span style={{ width:20, height:1, background:C.orange, display:"inline-block" }}></span>
        </div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(40px,6vw,72px)", lineHeight:.9, letterSpacing:"-.025em", textTransform:"uppercase", marginBottom:20 }}>
          Descubra onde<br/>você está <span style={{ color:C.orange }}>agora.</span>
        </div>
        <p style={{ fontSize:15, color:C.g300, maxWidth:480, margin:"0 auto 40px", lineHeight:1.75 }}>
          O IMC é gratuito, leva 8 minutos e vai te mostrar com precisão em qual estágio da performance comercial você está — e o que fazer para evoluir.
        </p>
        <button style={s.btnPrimary} onClick={() => onNavigate("imc")}>Fazer o IMC agora →</button>
      </div>
    </div>
  );
}

// ── APP ROOT ──
export default function App() {
  const [page, setPage] = useState("landing"); // landing | imc | login | dashboard
  const [user, setUser] = useState(null);

  function handleLogin(u) { setUser(u); setPage("dashboard"); }
  function handleLogout() { setUser(null); setPage("landing"); }

  return (
    <div style={s.app}>
      <style>{globalStyles}</style>
      <div style={s.noise}></div>

      {/* Nav */}
      {page !== "dashboard" && (
        <nav style={s.nav}>
          <div style={s.navLogo} onClick={() => setPage("landing")} className="cursor-pointer">
            <span>Mentoria</span><span style={s.navLogoAccent}>2C</span>
            <div style={s.navOrangeDot}></div>
          </div>
          <div style={s.navLinks}>
            <button style={s.navLink(page==="landing")} onClick={() => setPage("landing")}>Início</button>
            <button style={s.navLink(page==="imc")} onClick={() => setPage("imc")}>IMC</button>
          </div>
          <button style={s.navBtn} onClick={() => setPage("login")}>Acessar →</button>
        </nav>
      )}

      {/* Pages */}
      <div style={page !== "dashboard" ? s.page : {}}>
        {page === "landing" && <Landing onNavigate={setPage} />}
        {page === "imc" && <IMCTest isLoggedIn={false} />}
        {page === "login" && <Login onLogin={handleLogin} />}
        {page === "dashboard" && user && <Dashboard user={user} onLogout={handleLogout} />}
      </div>
    </div>
  );
}
