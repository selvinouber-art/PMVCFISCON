// Tema visual do FISCON
export const cores = {
  primario: '#1A56DB',
  perigo: '#B91C1C',
  sucesso: '#166534',
  alerta: '#B45309',
  cinza: '#6B7280',
  fundo: '#F1F5F9',
  branco: '#FFFFFF',
  borda: '#CBD5E0',
  texto: '#1E293B',
  textoSuave: '#64748B',
}

export const gerenciaTemas = {
  obras: {
    fundo: '#EBF5FF',
    cor: '#1A56DB',
    emoji: '🏗️',
    sigla: 'OB',
    nome: 'Fiscalização de Obras',
  },
  posturas: {
    fundo: '#F0FDF4',
    cor: '#166534',
    emoji: '🏪',
    sigla: 'PO',
    nome: 'Fiscalização de Posturas',
  },
  admin_geral: {
    fundo: '#FEF3C7',
    cor: '#B45309',
    emoji: '🏛️',
    sigla: 'GERAL',
    nome: 'Administração Geral',
  },
}

export const statusCores = {
  Pendente: { fundo: '#FEF3C7', cor: '#B45309' },
  Regularizado: { fundo: '#F0FDF4', cor: '#166534' },
  Embargado: { fundo: '#FEE2E2', cor: '#B91C1C' },
  Autuado: { fundo: '#EBF5FF', cor: '#1A56DB' },
  Cancelado: { fundo: '#F1F5F9', cor: '#6B7280' },
  'Em recurso': { fundo: '#FDF4FF', cor: '#7E22CE' },
  'Multa Encaminhada': { fundo: '#FFF7ED', cor: '#C2410C' },
}
