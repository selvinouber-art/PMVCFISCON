import React, { useState, useEffect } from 'react'
import { query } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import { statusCores } from '../../config/theme.js'
import { STATUS_REGISTROS } from '../../config/constants.js'

export default function RegistrosScreen({ usuario, setPagina, mostrarToast }) {
  const [registros, setRegistros] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregar() }, [usuario])

  async function carregar() {
    try {
      const dados = await query('records', q => {
        let qr = q.order('created_at', { ascending: false })
        if (usuario.gerencia !== 'admin_geral') qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })
      setRegistros(dados)
    } catch (err) {
      mostrarToast('Erro ao carregar registros', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  const filtrados = registros.filter(r => {
    const buscaOk = !busca ||
      r.num?.toLowerCase().includes(busca.toLowerCase()) ||
      r.owner?.toLowerCase().includes(busca.toLowerCase()) ||
      r.addr?.toLowerCase().includes(busca.toLowerCase()) ||
      r.cpf?.includes(busca)
    const statusOk = !filtroStatus || r.status === filtroStatus
    const tipoOk = !filtroTipo || r.type === filtroTipo
    return buscaOk && statusOk && tipoOk
  })

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Registros</h2>
        <button
          onClick={() => setPagina('nova-notificacao')}
          style={{
            background: '#1A56DB',
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
          Novo
        </button>
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Icon name="search" size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Buscar por número, nome, endereço..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ paddingLeft: '36px' }}
        />
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ flex: 1, fontSize: '0.8rem' }}>
          <option value="">Todos os tipos</option>
          <option value="notif">Notificação</option>
          <option value="auto">Auto de Infração</option>
        </select>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ flex: 1, fontSize: '0.8rem' }}>
          <option value="">Todos os status</option>
          {STATUS_REGISTROS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Contador */}
      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '10px' }}>
        {filtrados.length} registro{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
      </div>

      {/* Lista */}
      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : filtrados.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '2px dashed #E2E8F0',
          borderRadius: '14px',
          padding: '32px',
          textAlign: 'center',
          color: '#94A3B8',
        }}>
          <Icon name="file" size={32} color="#CBD5E0" style={{ margin: '0 auto 12px' }} />
          <div>Nenhum registro encontrado</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtrados.map(reg => {
            const sc = statusCores[reg.status] || { fundo: '#F1F5F9', cor: '#6B7280' }
            return (
              <div
                key={reg.id}
                style={{
                  background: '#fff',
                  border: '2px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  cursor: 'pointer',
                }}
                onClick={() => setPagina(`registro-${reg.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>{reg.num}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                      {reg.type === 'auto' ? '⚠️ Auto de Infração' : '📋 Notificação'}
                    </div>
                  </div>
                  <span style={{
                    background: sc.fundo,
                    color: sc.cor,
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    borderRadius: '999px',
                    padding: '3px 10px',
                  }}>
                    {reg.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151', marginBottom: '4px' }}>
                  {reg.owner || 'Proprietário não informado'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {reg.addr}{reg.bairro ? ` — ${reg.bairro}` : ''}
                </div>
                {reg.prazo && (
                  <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="clock" size={12} color="#B45309" />
                    Prazo: {reg.prazo}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
