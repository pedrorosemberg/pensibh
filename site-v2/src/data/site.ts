// Única fonte de verdade do conteúdo da v2. Tudo aqui foi informado pela PENSI+ ou está no site atual.

export const SITE = {
  name: 'PENSI+',
  legalName: 'PENSI+ Educação',
  url: 'https://www.pensibh.com.br/v2/',
  title: 'Professor Bruno | Pré-vestibular CEFET, ENEM e CESEC em BH — PENSI+',
  description:
    'Pré-vestibular com o professor Bruno no Sion-Anchieta, em Belo Horizonte: ENEM e vestibulares, CESEC e ENCCEJA, CEFET e provas de admissão em turmas reduzidas de até 8 alunos, com aula individual. Mais de 30 anos de experiência.',
  phoneDisplay: '(31) 98800-8430',
  phoneE164: '+5531988008430',
  whatsappNumber: '5531988008430',
  instagram: 'https://www.instagram.com/pensibh',
  facebook: 'https://www.facebook.com/pensibh',
  address: {
    street: 'Rua Francisco Deslandes, 971',
    neighborhood: 'Sion-Anchieta',
    city: 'Belo Horizonte',
    region: 'MG',
    postalCode: '30310-530',
    country: 'BR',
  },
  mapsQuery: 'Rua Francisco Deslandes, 971, Anchieta, Belo Horizonte - MG',
} as const;

/** Monta um link wa.me com mensagem pronta. O texto é sempre codificado. */
export function whatsapp(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
/** Perfil do Google com as avaliações (o perfil manteve o nome "Bruno Professor BH"). */
export const REVIEWS_LINK =
  'https://www.google.com/maps/place/Bruno+Professor+BH/@-19.94524,-43.9296612,17z/data=!4m8!3m7!1s0xa699ec4be52c4b:0x6aeac09e08a2bdfe!8m2!3d-19.94524!4d-43.9270809!9m1!1b1';
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;

export const NAV = [
  { href: '#cursos', label: 'Cursos' },
  { href: '#bruno', label: 'O professor' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#agenda', label: 'Horários e valores' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato', label: 'Contato' },
] as const;

export const BRUNO = {
  name: 'Bruno',
  role: 'Professor e fundador da PENSI+',
  years: 30,
  facts: [
    'Mais de 30 anos dando aulas particulares',
    'Estudou Engenharia Civil na UFMG, onde começou a lecionar',
    'Fundador da PENSI+ e responsável pelo atendimento em sala',
  ],
} as const;

export const COURSES = [
  {
    id: 'enem',
    title: 'ENEM e vestibulares',
    audience: 'Ensino médio e pré-vestibular',
    summary: 'Preparação anual para o ENEM e vestibulares, com plano montado a partir das matérias que você escolher.',
    tags: ['Todas as áreas', 'Redação', 'Exatas'],
  },
  {
    id: 'cesec',
    title: 'CESEC e ENCCEJA',
    audience: 'Jovens e adultos',
    summary: 'Para quem quer concluir o ensino fundamental ou médio e voltar a estudar no seu ritmo.',
    tags: ['Educação de jovens e adultos', 'Certificação'],
  },
  {
    id: 'cefet',
    title: 'CEFET e provas de admissão',
    audience: 'Jovens do 9º ano',
    summary: 'Preparação para o processo seletivo do CEFET-MG e outras provas de admissão do ensino técnico.',
    tags: ['Matemática', 'Português', 'Ciências'],
  },
] as const;

export const DIFERENCIAIS = [
  { icon: 'users', title: 'Turmas de até 8 alunos', text: 'Grupos pequenos para o professor acompanhar cada um de perto.' },
  { icon: 'user-check', title: 'Atendimento individual', text: 'Não há aula coletiva no quadro: cada aluno avança no próprio plano.' },
  { icon: 'book-open', title: 'Você escolhe as matérias', text: 'Todas as disciplinas são ofertadas; você estuda o que precisa.' },
  { icon: 'clock', title: 'Horários flexíveis', text: 'Turmas de manhã e à tarde, de segunda a sexta.' },
  { icon: 'award', title: 'Mais de 30 anos de experiência', text: 'Metodologia própria construída em décadas de aulas particulares.' },
  { icon: 'map-pin', title: 'Presencial no Sion-Anchieta', text: 'Sala própria na Rua Francisco Deslandes, em Belo Horizonte.' },
] as const;

export const STEPS = [
  { title: 'Fale com o Bruno', text: 'Chame no WhatsApp e conte seu objetivo: ENEM, CESEC ou CEFET.' },
  { title: 'Monte seu plano', text: 'Escolha as matérias e o horário da turma que cabem na sua rotina.' },
  { title: 'Comece as aulas', text: 'Garanta uma das 8 vagas da turma e estude com acompanhamento individual.' },
] as const;

/** Turmas presenciais de 2027, conforme a grade comercial da PENSI+. */
export const SLOTS = [
  { id: 'manha-1', label: '8:10 às 10:30', duration: '2h20 por aula', period: 'Manhã' },
  { id: 'manha-2', label: '10:30 às 12:20', duration: '1h50 por aula', period: 'Manhã' },
  { id: 'tarde', label: '14:30 às 16:20', duration: '1h50 por aula', period: 'Tarde' },
] as const;

export type SlotId = (typeof SLOTS)[number]['id'];

export const PLANS = [
  {
    id: 'cefet-1',
    name: 'CEFET · 1º semestre',
    short: 'CEFET 1º sem.',
    period: '15 de fevereiro a 30 de junho de 2027',
    note: 'Três meses e meio de curso',
    prices: {
      'manha-1': { from: 9480, to: 7990 },
      'manha-2': { from: 11610, to: 9990 },
      tarde: { from: 11610, to: 9990 },
    },
  },
  {
    id: 'cefet-2',
    name: 'CEFET · 2º semestre',
    short: 'CEFET 2º sem.',
    period: '1º de agosto a 15 de novembro de 2027',
    note: 'Três meses e meio de curso',
    prices: {
      'manha-1': { from: 9480, to: 7990 },
      'manha-2': { from: 11610, to: 9990 },
      tarde: { from: 11610, to: 9990 },
    },
  },
  {
    id: 'enem',
    name: 'ENEM · anual',
    short: 'ENEM anual',
    period: '15 de fevereiro a 15 de novembro de 2027',
    note: 'Férias em julho',
    prices: {
      'manha-1': { from: 18510, to: 14990 },
      'manha-2': { from: 22740, to: 17990 },
      tarde: { from: 22740, to: 17990 },
    },
  },
] as const;

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** Resumo do perfil "Bruno Professor BH" no Google (consultado em 05/11/2026). */
export const GOOGLE_REVIEWS = { rating: 5.0, count: 40 } as const;

/**
 * Avaliações reais do perfil "Bruno Professor BH" no Google Maps, com o nome como
 * aparece no Google. Fonte consultada em 10/11/2026 (40 avaliações, todas 5 estrelas).
 */
export const TESTIMONIALS: { name: string; text: string; context?: string }[] = [
  {
    name: 'Marco Antônio Souza de Faria',
    context: 'Aluno',
    text: 'Excelente professor! Eu precisava de ajuda com certa urgência e ele foi extremamente solícito, conseguiu me encaixar rapidamente e foi muito eficiente desde a primeira aula. As explicações são claras, objetivas e ele realmente entende as dificuldades do aluno. A preparação fez toda a diferença para o meu resultado: consegui as notas que precisava na escola e a aprovação que eu buscava, com nota máxima!',
  },
  {
    name: 'Rodrigo Melo',
    context: 'Pai de aluno · CEFET',
    text: 'Professor experiente e atencioso. Soube canalizar no meu filho de 15 anos assuntos e matérias específicas para prepará-lo para o Técnico do CEFET. Sem contar a atenção comigo, pai. Sempre me retornando com um follow-up do dia e da semana. Recomendo.',
  },
  {
    name: 'Marina Souza',
    context: 'Mãe de aluno',
    text: 'Procurei o professor Bruno em um momento de muita urgência e, confesso, até de desespero de mãe. Ele prontamente me respondeu, foi extremamente solícito e conseguiu encaixar meu filho em todos os dias que precisávamos, a poucos dias da prova. O resultado não poderia ter sido melhor: aprovação e excelentes notas!',
  },
  {
    name: 'Ana Paula Vitarelli',
    context: 'Mãe de aluno',
    text: 'Resgatou a segurança e a confiança do meu filho em Matemática. Com linguagem direta e própria para adolescente, levantando a autoestima e recuperando as notas de forma brilhante. O meu muito obrigada.',
  },
  {
    name: 'Ana Paula Carvalho',
    context: 'Mãe de aluna',
    text: 'Sua disponibilidade, paciência e atenção fizeram toda a diferença no aprendizado da minha filha. Além de dominar o conteúdo com excelência, ele tem uma forma única de explicar, sempre preocupado em garantir que o aluno realmente compreenda. Um profissional maravilhoso, dedicado e inspirador, que transformou a relação da minha filha com a matemática.',
  },
  {
    name: 'Max Fahy',
    context: 'Aluno',
    text: 'Bruno foi o melhor professor que eu já tive. Ele ensina a matéria de forma tão detalhada que o que você aprenderia em um ano ele te ensina em cinco meses. Sem dúvidas, nunca terei um professor igual a ele.',
  },
  {
    name: 'Alexsandra Rosa',
    context: 'Mãe de aluno',
    text: 'Muito profissionalismo, preocupado com o aprendizado do aluno. Conseguiu reverter uma dificuldade grande do meu filho em matemática e ele recuperou o ano que estava quase perdido.',
  },
  {
    name: 'Carlos Lage',
    context: 'Pai de aluna · vestibular',
    text: 'O Bruno é um ótimo professor, ajudou muito minha filha nas provas finais do ensino médio e a ingressar na faculdade. Tem um atendimento personalizado para a necessidade de cada aluno! Recomendo, é um excelente professor!',
  },
  {
    name: 'Tiago Nocce',
    context: 'Aluno',
    text: 'O Bruno é um professor incrível! Uma ótima metodologia de ensino, me ajudou em tão pouco tempo de uma forma que consegui entender uma grande quantidade de matérias, com ótimas atividades de fixação! Me salvou.',
  },
];

/** Depoimentos em vídeo, servidos em /videos (mesma origem). Formato vertical 9:16. */
export const VIDEO_TESTIMONIALS = [
  { src: '/videos/depoimento-3.mp4', poster: '/videos/depoimento-3.jpg', width: 448, height: 800, caption: 'Aluno particular, do Colégio Santo Antônio' },
  { src: '/videos/depoimento-2.mp4', poster: '/videos/depoimento-2.jpg', width: 480, height: 848, caption: 'Aluno aprovado em Medicina na Ciências Médicas' },
  { src: '/videos/depoimento-1.mp4', poster: '/videos/depoimento-1.jpg', width: 480, height: 848, caption: 'Aluno aprovado no CESEC' },
] as const;

export const FAQ = [
  {
    q: 'Onde ficam as aulas do professor Bruno?',
    a: 'As aulas são presenciais na PENSI+, na Rua Francisco Deslandes, 971, no bairro Sion-Anchieta, em Belo Horizonte (MG).',
  },
  {
    q: 'Quantos alunos tem cada turma?',
    a: 'No máximo 8 alunos. O atendimento é individual: não há aula coletiva no quadro, e o professor acompanha cada aluno no próprio plano de estudo.',
  },
  {
    q: 'Quais cursos a PENSI+ oferece?',
    a: 'Pré-vestibular para o ENEM e vestibulares, CESEC e ENCCEJA (educação de jovens e adultos) e preparação para o CEFET e provas de admissão.',
  },
  {
    q: 'Posso escolher as matérias que vou estudar?',
    a: 'Sim. Todas as disciplinas são ofertadas, e o aluno escolhe quais quer estudar dentro do horário da turma.',
  },
  {
    q: 'Quais são os horários das turmas?',
    a: 'As turmas são de segunda a sexta, em três horários: 8:10 às 10:30, 10:30 às 12:20 e 14:30 às 16:20.',
  },
  {
    q: 'Quanto custa o curso para o CEFET ou para o ENEM?',
    a: 'O semestre para o CEFET sai a partir de R$ 7.990, e o curso anual para o ENEM a partir de R$ 14.990, conforme o horário escolhido. Cada turma tem só 8 vagas.',
  },
  {
    q: 'Adultos podem estudar na PENSI+?',
    a: 'Sim. A PENSI+ prepara jovens e adultos para o CESEC e o ENCCEJA, para quem quer concluir os estudos e retomar a vida acadêmica.',
  },
  {
    q: 'Como faço para me inscrever?',
    a: 'Fale com o professor Bruno pelo WhatsApp (31) 98800-8430. Ele explica as turmas, tira dúvidas e reserva sua vaga.',
  },
] as const;
