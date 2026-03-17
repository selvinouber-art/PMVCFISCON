import React, { useState, useEffect } from 'react'
import { query } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'

const STATUS_CORES = {
  nova: { fundo: '#FEE2E2', cor: '#B91C1C' },
  em_atendimento: { fundo: '#FEF3C7', cor: '#B45309' },
  resolvida: { fundo: '#F0FDF4', cor: '#166534' },
  arquivada: { fundo: '#F1F5F9', cor: '#6B7280' },
}

export default function ReclamacoesScreen({ usuario, setPagina, mostrarToast }) {
  const [reclamacoes, setReclamacoes] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const dados = await query('reclamacoes', q => {
        let qr = q.order('created_at', { ascending: false })
        if (usuario.gerencia !== 'admin_geral') qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })
      setReclamacoes(dados)
    } catch {
      mostrarToast('Erro ao carregar reclamações', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  const filtradas = reclamacoes.filter(r => {
    const buscaOk = !busca ||
      r.reclamante?.toLowerCase().includes(busca.toLowerCase()) ||
      r.reclamado?.toLowerCase().includes(busca.toLowerCase()) ||
      r.endereco?.toLowerCase().includes(busca.toLowerCase()) ||
      r.protocolo?.includes(busca)
    const statusOk = !filtroStatus || r.status === filtroStatus
    return buscaOk && statusOk
  })

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Reclamações</h2>
        <button
          onClick={() => setPagina('nova-reclamacao')}
          style={{
            background: '#B91C1C',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          Nova
        </button>
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Icon name="search" size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Buscar reclamação..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ paddingLeft: '36px' }}
        />
      </div>

      {/* Filtro status */}
      <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ marginBottom: '16px', fontSize: '0.8rem' }}>
        <option value="">Todos os status</option>
        <option value="nova">Nova</option>
        <option value="em_atendimento">Em Atendimento</option>
        <option value="resolvida">Resolvida</option>
        <option value="arquivada">Arquivada</option>
      </select>

      {/* Lista */}
      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : filtradas.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '2px dashed #E2E8F0',
          borderRadius: '14px',
          padding: '32px',
          textAlign: 'center',
          color: '#94A3B8',
        }}>
          Nenhuma reclamação encontrada
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtradas.map(rec => {
            const sc = STATUS_CORES[rec.status] || STATUS_CORES.nova
            return (
              <div
                key={rec.id}
                style={{
                  background: '#fff',
                  border: '2px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  cursor: 'pointer',
                }}
                onClick={() => setPagina(`reclamacao-${rec.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1A56DB' }}>
                    {rec.protocolo || rec.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span style={{
                    background: sc.fundo,
                    color: sc.cor,
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    borderRadius: '999px',
                    padding: '3px 10px',
                  }}>
                    {rec.status === 'nova' ? 'Nova' :
                     rec.status === 'em_atendimento' ? 'Em Atendimento' :
                     rec.status === 'resolvida' ? 'Resolvida' : 'Arquivada'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151', marginBottom: '2px' }}>
                  {rec.reclamado || 'Reclamado não informado'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {rec.endereco}{rec.bairro ? ` — ${rec.bairro}` : ''}
                </div>
                {rec.prioridade === 'urgente' && (
                  <span style={{ fontSize: '0.68rem', color: '#B91C1C', fontWeight: '700', marginTop: '4px', display: 'block' }}>
                    🔴 URGENTE
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
