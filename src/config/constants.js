// ============================================================
// FISCON — Constantes do sistema
// ============================================================

// ============================================================
// BAIRROS DE VITÓRIA DA CONQUISTA
// ============================================================
export const BAIRROS_VDC = [
  'ALTO MARON', 'AYRTON SENNA', 'BATEIAS', 'BRASIL', 'BOA VISTA',
  'CAMPINHOS', 'CANDEIAS', 'CENTRO', 'CRUZEIRO', 'DISTRITO INDUSTRIAL',
  'ESPIRITO SANTO', 'FELICIA', 'GUARANI', 'IBIRAPUERA', 'JATOBA',
  'JUREMA', 'LAGOA DAS FLORES', 'NOSSA SENHORA APARECIDA', 'PATAGONIA',
  'PRIMAVERA', 'RECREIO', 'SAO PEDRO', 'UNIVERSIDADE', 'ZABELÊ', 'ZONA RURAL',
]

// ============================================================
// PRAZOS
// ============================================================
export const PRAZOS_NOTIFICACAO = [
  { valor: 1, label: '1 dia' },
  { valor: 2, label: '2 dias' },
  { valor: 3, label: '3 dias' },
]
export const PRAZO_AUTO_DIAS = 10

export function calcularDataVencimento(dias) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toLocaleDateString('pt-BR')
}

// ============================================================
// QUADRO 6.1 — INFRAÇÕES DE OBRAS E MULTAS
// Lei nº 1.481/2007 — Anexo VI
// ============================================================
export const INFRACOES_Q61 = [
  {
    id: 'q61-01', codigo: '6.1.1',
    descricao: 'Execução de obra sem a licença de localização',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q61-02', codigo: '6.1.2',
    descricao: 'Execução de obra sem a licença de implantação',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q61-03', codigo: '6.1.3',
    descricao: 'Execução de obra sem a licença de localização e de implantação',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 2000.00,
  },
  {
    id: 'q61-04a', codigo: '6.1.4.1',
    descricao: 'Ocupação de edificação sem Licença de Operação ou Habite-se — construção residencial',
    penalidade: 'Incisos I e IV do art. 137',
    valor: 150.00,
  },
  {
    id: 'q61-04b', codigo: '6.1.4.2',
    descricao: 'Ocupação de edificação sem Licença de Operação ou Habite-se — construção mista',
    penalidade: 'Incisos I e IV do art. 137',
    valor: 250.00,
  },
  {
    id: 'q61-04c', codigo: '6.1.4.3',
    descricao: 'Ocupação de edificação sem Licença de Operação ou Habite-se — construção comercial',
    penalidade: 'Incisos I e IV do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-05', codigo: '6.1.5',
    descricao: 'Omissão, no projeto, da existência de cursos de água, topografia acidentada ou elementos de altimetria relevantes',
    penalidade: 'Incisos I, II, IV e V do art. 137',
    valor: 400.00,
  },
  {
    id: 'q61-06', codigo: '6.1.6',
    descricao: 'Início de obra sem responsável técnico',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 800.00,
  },
  {
    id: 'q61-07', codigo: '6.1.7',
    descricao: 'Ausência do projeto aprovado e demais documentos exigidos por este Código no local da obra',
    penalidade: 'Inciso I do art. 137',
    valor: 120.00,
  },
  {
    id: 'q61-08', codigo: '6.1.8',
    descricao: 'Execução de obra em desacordo com o projeto aprovado e/ou alteração dos elementos geométricos essenciais',
    penalidade: 'Incisos I, II, IV e V do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-09', codigo: '6.1.9',
    descricao: 'Construção ou instalação executada de maneira a pôr em risco a estabilidade da obra ou a segurança desta, do pessoal empregado ou da coletividade',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q61-10', codigo: '6.1.10',
    descricao: 'Inobservância das prescrições deste Código sobre equipamentos de segurança e proteção',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-11', codigo: '6.1.11',
    descricao: 'Inobservância do alinhamento e nivelamento',
    penalidade: 'Incisos I, II, IV e V do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-12', codigo: '6.1.12',
    descricao: 'Colocação de materiais de construção e entulho no passeio ou via pública por prazo superior a 24 horas',
    penalidade: 'Incisos I e IV do art. 137',
    valor: 200.00,
  },
  {
    id: 'q61-13', codigo: '6.1.13',
    descricao: 'Preparar argamassa nas vias e logradouros públicos',
    penalidade: 'Incisos I e IV do art. 137',
    valor: 300.00,
  },
  {
    id: 'q61-14', codigo: '6.1.14',
    descricao: 'Imperícia, com prejuízos ao interesse público, devidamente apurada na execução da obra ou instalações',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q61-15', codigo: '6.1.15',
    descricao: 'Danos causados à coletividade ou ao interesse público provocados pela má conservação de fachada, marquises ou corpos em balanço',
    penalidade: 'Incisos I, IV e V do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-16', codigo: '6.1.16',
    descricao: 'Inobservância das prescrições deste Código quanto à mudança de responsável técnico',
    penalidade: 'Incisos I, II, IV e V do art. 137',
    valor: 300.00,
  },
  {
    id: 'q61-17', codigo: '6.1.17',
    descricao: 'Utilização da edificação para fim diverso do declarado no projeto',
    penalidade: 'Incisos I e IV do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-18', codigo: '6.1.18',
    descricao: 'Não atendimento injustificado à intimação para construção, reparação ou reconstrução de vedações e passeios',
    penalidade: 'Inciso I do art. 137',
    valor: 300.00,
  },
  {
    id: 'q61-19', codigo: '6.1.19',
    descricao: 'Construção de fossas no passeio ou na via pública sem autorização',
    penalidade: 'Incisos I, II, III e V do art. 137',
    valor: 100.00,
  },
  {
    id: 'q61-20', codigo: '6.1.20',
    descricao: 'Construção de cobertura no passeio',
    penalidade: 'Incisos I, II, III e V do art. 137',
    valor: 200.00,
  },
  {
    id: 'q61-21', codigo: '6.1.21',
    descricao: 'Construção de obras não licenciadas em área de domínio público',
    penalidade: 'Incisos I, III e V do art. 137',
    valor: 350.00,
  },
  {
    id: 'q61-22', codigo: '6.1.22',
    descricao: 'Ligação clandestina de esgoto sanitário à rede pluvial',
    penalidade: 'Incisos I e V do art. 137',
    valor: 300.00,
  },
  {
    id: 'q61-23', codigo: '6.1.23',
    descricao: 'Construção de rampas ou degraus no passeio',
    penalidade: 'Incisos I e V do art. 137',
    valor: 200.00,
  },
  {
    id: 'q61-24', codigo: '6.1.24',
    descricao: 'Por não obedecer o afastamento ou recuo mínimo',
    penalidade: 'Incisos I, II, IV e V do art. 137',
    valor: 300.00,
  },
  {
    id: 'q61-25', codigo: '6.1.25',
    descricao: 'Abertura de vãos para iluminação e ventilação voltado para o imóvel de terceiros sem o recuo mínimo obrigatório previsto na legislação pertinente',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 120.00,
  },
  {
    id: 'q61-26', codigo: '6.1.26',
    descricao: 'Jogar água servida nas vias públicas',
    penalidade: 'Inciso I do art. 137',
    valor: 100.00,
  },
  {
    id: 'q61-27a', codigo: '6.1.27.1',
    descricao: 'Corte de via sem pavimento para implantação de serviços de água, energia elétrica, telefonia ou similares sem prévia licença',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q61-27b', codigo: '6.1.27.2',
    descricao: 'Corte de via pavimentada para implantação de serviços de água, energia elétrica, telefonia ou similares sem prévia licença',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 2000.00,
  },
  {
    id: 'q61-27c', codigo: '6.1.27.3',
    descricao: 'Corte de passeio para implantação de serviços de água, energia elétrica, telefonia ou similares sem prévia licença',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 2000.00,
  },
  {
    id: 'q61-27d', codigo: '6.1.27.4',
    descricao: 'Corte de praças para implantação de serviços de água, energia elétrica, telefonia ou similares sem prévia licença',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 2000.00,
  },
  {
    id: 'q61-28', codigo: '6.1.28',
    descricao: 'Não renovação do Alvará de Implantação',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 200.00,
  },
  {
    id: 'q61-29', codigo: '6.1.29',
    descricao: 'Construção de cobertura em desacordo com as distâncias mínimas previstas nesta Lei, prejudicando o imóvel vizinho',
    penalidade: 'Incisos I, II e V do art. 137',
    valor: 150.00,
  },
  {
    id: 'q61-30', codigo: '6.1.30',
    descricao: 'Falta de impermeabilização das paredes no limite dos terrenos vizinhos (multa por limite divisório)',
    penalidade: 'Inciso I do art. 137',
    valor: 500.00,
  },
  {
    id: 'q61-31', codigo: '6.1.31',
    descricao: 'Obstrução do exercício profissional do Agente de Fiscalização de Obras',
    penalidade: 'Inciso I do art. 137',
    valor: 500.00,
  },
]

// ============================================================
// QUADRO 6.2 — INFRAÇÕES E MULTAS DE PARCELAMENTO DO SOLO URBANO
// Lei nº 1.481/2007 — Anexo VI
// ============================================================
export const INFRACOES_Q62 = [
  {
    id: 'q62-01', codigo: '6.2.1',
    descricao: 'Execução de obra de urbanização sem a licença de localização',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 5000.00,
  },
  {
    id: 'q62-02', codigo: '6.2.2',
    descricao: 'Execução de obra de urbanização sem a licença de implantação',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 5000.00,
  },
  {
    id: 'q62-03', codigo: '6.2.3',
    descricao: 'Execução de obra de urbanização sem a licença de localização e de implantação',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 10000.00,
  },
  {
    id: 'q62-04', codigo: '6.2.4',
    descricao: 'Início de obra de urbanização sem responsável técnico',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q62-05', codigo: '6.2.5',
    descricao: 'Venda de lotes sem a licença de localização e de implantação (multa por lote)',
    penalidade: 'Incisos I, II, III, IV e V do art. 137',
    valor: 1000.00,
  },
  {
    id: 'q62-06', codigo: '6.2.6',
    descricao: 'Omissão no projeto da existência de cursos de água, topografia acidentada ou elementos de altimetria relevantes',
    penalidade: 'Incisos I, II, III e IV do art. 137',
    valor: 5000.00,
  },
  {
    id: 'q62-07', codigo: '6.2.7',
    descricao: 'Ausência do projeto aprovado e demais documentos exigidos por este Código no local das obras de urbanismo',
    penalidade: 'Inciso I do art. 137',
    valor: 120.00,
  },
  {
    id: 'q62-08', codigo: '6.2.8',
    descricao: 'Execução de obras de urbanismo em desacordo com o projeto aprovado e/ou alteração dos elementos geométricos essenciais',
    penalidade: 'Incisos I, II, III e IV do art. 137',
    valor: 1500.00,
  },
  {
    id: 'q62-09', codigo: '6.2.9',
    descricao: 'Implantação executada de maneira a pôr em risco a estabilidade da obra ou a segurança desta, do pessoal empregado ou da coletividade',
    penalidade: 'Incisos I, II, III e IV do art. 137',
    valor: 10000.00,
  },
  {
    id: 'q62-10', codigo: '6.2.10',
    descricao: 'Inobservância das prescrições desta Lei quanto à mudança de responsável técnico',
    penalidade: 'Incisos I, II e IV do art. 137',
    valor: 300.00,
  },
  {
    id: 'q62-11', codigo: '6.2.11',
    descricao: 'Obstrução do exercício profissional do Agente de Fiscalização de Obras',
    penalidade: 'Inciso I do art. 137',
    valor: 500.00,
  },
  {
    id: 'q62-12', codigo: '6.2.12',
    descricao: 'Utilização de área pública para parcelamento (multa por metro quadrado)',
    penalidade: 'Incisos I e III do art. 137',
    valor: 10.00,
  },
  {
    id: 'q62-13', codigo: '6.2.13',
    descricao: 'Não cumprimento do Termo de Acordo e Compromisso (TAC)',
    penalidade: 'Inciso I do art. 137',
    valor: 10000.00,
  },
  {
    id: 'q62-14', codigo: '6.2.14',
    descricao: 'Venda de lote caucionado (multa por lote)',
    penalidade: 'Inciso I do art. 137',
    valor: 5000.00,
  },
]

// ============================================================
// STATUS / ORIGEM / PRIORIDADE
// ============================================================
export const STATUS_REGISTROS = [
  'Pendente', 'Regularizado', 'Embargado', 'Autuado',
  'Cancelado', 'Em recurso', 'Multa Encaminhada',
]

export const ORIGENS_RECLAMACAO = [
  { value: 'telefone',   label: 'Telefone' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'email',      label: 'E-mail' },
  { value: 'portal',     label: 'Portal do Cidadão' },
]

export const PRIORIDADES = [
  { value: 'baixa',   label: 'Baixa' },
  { value: 'normal',  label: 'Normal' },
  { value: 'alta',    label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
]
