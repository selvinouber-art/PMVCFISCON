import React from 'react'
import { getGerencia, GERENCIAS } from './gerencia.js'

// Barra colorida indicando a gerência do usuário
export function GerenciaHeader({ gerencia }) {
  const g = getGerencia(gerencia)
  return (
    <div style={{
      background: g.fundo,
      borderBottom: `2px solid ${g.cor}22`,
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.8rem',
      fontWeight: '600',
      color: g.cor,
    }}>
      <span>{g.emoji}</span>
      <span>{g.nome}</span>
      <span style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '0.7rem' }}>{g.lei}</span>
    </div>
  )
}

// Badge com sigla da gerência
export function GerenciaBadge({ gerencia, style = {} }) {
  const g = getGerencia(gerencia)
  return (
    <span style={{
      background: g.fundo,
      color: g.cor,
      border: `1px solid ${g.cor}44`,
      borderRadius: '999px',
      padding: '2px 10px',
      fontSize: '0.7rem',
      fontWeight: '700',
      letterSpacing: '0.05em',
      ...style,
    }}>
      {g.sigla}
    </span>
  )
}

// Seletor de gerência (para formulários de admin)
export function GerenciaSelector({ value, onChange, label = 'Gerência' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Selecione a gerência</option>
        {Object.values(GERENCIAS).map(g => (
          <option key={g.id} value={g.id}>
            {g.emoji} {g.nome}
          </option>
        ))}
      </select>
    </div>
  )
}

// Filtro de gerência (para listas do admin geral)
export function GerenciaFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ minWidth: '160px' }}
    >
      <option value="">Todas as gerências</option>
      {Object.values(GERENCIAS).filter(g => g.id !== 'admin_geral').map(g => (
        <option key={g.id} value={g.id}>
          {g.emoji} {g.sigla}
        </option>
      ))}
    </select>
  )
}

// Seletor de função (carrega do banco baseado na gerência)
export function FuncaoSelector({ value, onChange, funcoes = [], label = 'Função' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} disabled={funcoes.length === 0}>
        <option value="">Selecione a função</option>
        {funcoes.map(f => (
          <option key={f.id} value={f.codigo}>
            {f.nome}
          </option>
        ))}
      </select>
      {funcoes.length === 0 && (
        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Selecione a gerência primeiro</span>
      )}
    </div>
  )
}
