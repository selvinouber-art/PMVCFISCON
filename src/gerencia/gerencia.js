// Helpers de gerência do FISCON

export const GERENCIAS = {
  obras: {
    id: 'obras',
    nome: 'Gerência de Fiscalização de Obras',
    sigla: 'OB',
    lei: 'Lei nº 1.481/2007',
    emoji: '🏗️',
    cor: '#1A56DB',
    fundo: '#EBF5FF',
    prefixoNotif: 'NP-OB',
    prefixoAuto: 'AI-OB',
  },
  posturas: {
    id: 'posturas',
    nome: 'Gerência de Fiscalização de Posturas',
    sigla: 'PO',
    lei: 'Lei nº 695/1993',
    emoji: '🏪',
    cor: '#166534',
    fundo: '#F0FDF4',
    prefixoNotif: 'NP-PO',
    prefixoAuto: 'AI-PO',
  },
  admin_geral: {
    id: 'admin_geral',
    nome: 'Administração Geral',
    sigla: 'GERAL',
    lei: '',
    emoji: '🏛️',
    cor: '#B45309',
    fundo: '#FEF3C7',
    prefixoNotif: 'NP-GR',
    prefixoAuto: 'AI-GR',
  },
}

// Retorna a config de uma gerência pelo id
export function getGerencia(id) {
  return GERENCIAS[id] || GERENCIAS['obras']
}

// Gera número de documento sequencial
// Ex: NP-OB-0001/2026
export function gerarNumDocumento(tipo, gerencia, sequencial) {
  const config = getGerencia(gerencia)
  const prefixo = tipo === 'auto' ? config.prefixoAuto : config.prefixoNotif
  const ano = new Date().getFullYear()
  const num = String(sequencial).padStart(4, '0')
  return `${prefixo}-${num}/${ano}`
}

// Gera código de acesso para o Portal do Cidadão
// 8 chars sem ambiguidade (sem 0/O, 1/l/I)
export function gerarCodigoAcesso() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let codigo = ''
  for (let i = 0; i < 8; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)]
  }
  return codigo
}

// Filtra array de registros pela gerência do usuário logado
export function filtrarPorGerencia(registros, gerencia) {
  if (gerencia === 'admin_geral') return registros
  return registros.filter(r => r.gerencia === gerencia)
}

// Verifica se o usuário tem permissão de admin
export function isAdmin(usuario) {
  if (!usuario) return false
  return usuario.role === 'admin' || usuario.gerencia === 'admin_geral'
}

// Verifica se é fiscal
export function isFiscal(usuario) {
  if (!usuario) return false
  return usuario.role === 'fiscal'
}
