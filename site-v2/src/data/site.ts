// Única fonte de verdade do conteúdo da v2. Tudo aqui foi informado pela PENSI+ ou está no site atual.

export const SITE = {
  name: 'PENSI+',
  legalName: 'PENSI+ Educação',
  url: 'https://www.pensibh.com.br/v2/',
  title: 'Professor Bruno | Pré-vestibular CEFET, ENEM e CESEC em BH — PENSI+',
  description:
    'Aulas presenciais com o professor Bruno no Anchieta, em Belo Horizonte: CEFET, ENEM, CESEC, ENCCEJA e reforço escolar em turmas de até 8 alunos, com atendimento individual. Mais de 30 anos de experiência.',
  phoneDisplay: '(31) 98800-8430',
  phoneE164: '+5531988008430',
  whatsappNumber: '5531988008430',
  instagram: 'https://www.instagram.com/pensibh',
  facebook: 'https://www.facebook.com/pensibh',
  address: {
    street: 'R. Luiz Signorelli, 106 – 2º andar',
    neighborhood: 'Anchieta',
    city: 'Belo Horizonte',
    region: 'MG',
    postalCode: '30310-210',
    country: 'BR',
  },
  mapsQuery: 'Bruno Professor BH, R. Luiz Signorelli, 106, Anchieta, Belo Horizonte - MG',
} as const;

/** Monta um link wa.me com mensagem pronta. O texto é sempre codificado. */
export function whatsapp(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
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
    id: 'cefet',
    title: 'CEFET e provas de admissão',
    audience: 'Jovens do 9º ano',
    summary: 'Preparação para o processo seletivo do CEFET-MG e outras provas de admissão do ensino técnico.',
    tags: ['Matemática', 'Português', 'Ciências'],
  },
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
    id: 'reforco',
    title: 'Reforço escolar',
    audience: 'Fundamental e médio',
    summary: 'Aulas focadas nas dificuldades de cada aluno, para recuperar conteúdo e ganhar confiança.',
    tags: ['Recuperação', 'Provas da escola'],
  },
] as const;

export const DIFERENCIAIS = [
  { icon: 'users', title: 'Turmas de até 8 alunos', text: 'Grupos pequenos para o professor acompanhar cada um de perto.' },
  { icon: 'user-check', title: 'Atendimento individual', text: 'Não há aula coletiva no quadro: cada aluno avança no próprio plano.' },
  { icon: 'book-open', title: 'Você escolhe as matérias', text: 'Todas as disciplinas são ofertadas; você estuda o que precisa.' },
  { icon: 'clock', title: 'Horários flexíveis', text: 'Turmas de manhã e à tarde, de segunda a sexta.' },
  { icon: 'award', title: 'Mais de 30 anos de experiência', text: 'Metodologia própria construída em décadas de aulas particulares.' },
  { icon: 'map-pin', title: 'Presencial no Anchieta', text: 'Sala própria em Belo Horizonte, ao lado do Sion.' },
] as const;

export const STEPS = [
  { title: 'Fale com o Bruno', text: 'Chame no WhatsApp e conte seu objetivo: CEFET, ENEM, CESEC ou reforço.' },
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

/**
 * Depoimentos reais do Google, publicados com permissão.
 * Enquanto a lista estiver vazia, a seção mostra o convite para ler as avaliações no Google.
 */
export const TESTIMONIALS: { name: string; text: string; context?: string }[] = [];

export const FAQ = [
  {
    q: 'Onde ficam as aulas do professor Bruno?',
    a: 'As aulas são presenciais na PENSI+, na R. Luiz Signorelli, 106, 2º andar, no bairro Anchieta, em Belo Horizonte (MG).',
  },
  {
    q: 'Quantos alunos tem cada turma?',
    a: 'No máximo 8 alunos. O atendimento é individual: não há aula coletiva no quadro, e o professor acompanha cada aluno no próprio plano de estudo.',
  },
  {
    q: 'Quais cursos a PENSI+ oferece?',
    a: 'Preparação para o CEFET e provas de admissão, ENEM e vestibulares, CESEC e ENCCEJA (educação de jovens e adultos) e reforço escolar.',
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
