import React, { useState, useEffect } from 'react'
import { query } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import { isAdminGeral } from '../../gerencia/gerencia.js'

export default function RelatoriosScreen({ usuario, mostrarToast, setPagina }) {
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState({ de: '', ate: '', tipo: '', status: '' })

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try {
      const dados = await query('records', q => {
        let qr = q.order('created_at', { ascending: false })
        if (!isAdminGeral(usuario)) qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })
      setRegistros(dados || [])
    } catch {
      mostrarToast('Erro ao carregar dados', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  const filtrados = registros.filter(r => {
    if (filtro.tipo   && r.type   !== filtro.tipo)   return false
    if (filtro.status && r.status !== filtro.status) return false
    if (filtro.de) {
      const [d,m,a] = (r.date || '').split('/')
      const dt = new Date(`${a}-${m}-${d}`)
      if (dt < new Date(filtro.de)) return false
    }
    if (filtro.ate) {
      const [d,m,a] = (r.date || '').split('/')
      const dt = new Date(`${a}-${m}-${d}`)
      if (dt > new Date(filtro.ate)) return false
    }
    return true
  })

  // Métricas
  const total    = filtrados.length
  const notifs   = filtrados.filter(r => r.type === 'notif').length
  const autos    = filtrados.filter(r => r.type === 'auto').length
  const regulars = filtrados.filter(r => r.status === 'Regularizado').length
  const multas   = filtrados.filter(r => r.multado).length
  const cancelados = filtrados.filter(r => r.status === 'Cancelado').length
  const totalMulta = filtrados.filter(r => r.type === 'auto').reduce((acc, r) => acc + (Number(r.multa) || 0), 0)

  function exportarCSV() {
    const header = ['Número', 'Tipo', 'Status', 'Data', 'Fiscal', 'Proprietário', 'Endereço', 'Bairro', 'Infrações', 'Multa', 'Prazo']
    const rows = filtrados.map(r => [
      r.num, r.type === 'auto' ? 'Auto de Infração' : 'Notificação',
      r.status, r.date, r.fiscal, r.owner, r.addr, r.bairro,
      (r.infracoes || []).length, r.multa || '', r.prazo || ''
    ])
    const csv = [header, ...rows].map(row => row.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `relatorio_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setPagina('mais')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Relatórios</h2>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>Análise de notificações e autos por período</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtros</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '3px', display: 'block' }}>De</label>
            <input type="date" value={filtro.de} onChange={e => setFiltro(f => ({ ...f, de: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '3px', display: 'block' }}>Até</label>
            <input type="date" value={filtro.ate} onChange={e => setFiltro(f => ({ ...f, ate: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '3px', display: 'block' }}>Tipo</label>
            <select value={filtro.tipo} onChange={e => setFiltro(f => ({ ...f, tipo: e.target.value }))}>
              <option value="">Todos</option>
              <option value="notif">Notificação</option>
              <option value="auto">Auto de Infração</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '3px', display: 'block' }}>Status</label>
            <select value={filtro.status} onChange={e => setFiltro(f => ({ ...f, status: e.target.value }))}>
              <option value="">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Regularizado">Regularizado</option>
              <option value="Autuado">Autuado</option>
              <option value="Em recurso">Em recurso</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        <button onClick={() => setFiltro({ de: '', ate: '', tipo: '', status: '' })} style={{
          marginTop: '10px', background: '#F1F5F9', color: '#64748B', border: 'none',
          borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
        }}>
          Limpar filtros
        </button>
      </div>

      {/* Métricas */}
      {carregando ? (
        <p style={{ textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Carregando...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Total de registros', valor: total,     cor: '#1A56DB', fundo: '#EBF5FF' },
              { label: 'Notificações',        valor: notifs,    cor: '#B45309', fundo: '#FEF3C7' },
              { label: 'Autos de Infração',   valor: autos,     cor: '#B91C1C', fundo: '#FEE2E2' },
              { label: 'Regularizados',       valor: regulars,  cor: '#166534', fundo: '#F0FDF4' },
              { label: 'Multas Encaminhadas', valor: multas,    cor: '#B91C1C', fundo: '#FEE2E2' },
              { label: 'Cancelados',          valor: cancelados,cor: '#6B7280', fundo: '#F1F5F9' },
            ].map(m => (
              <div key={m.label} style={{ background: m.fundo, border: `2px solid ${m.cor}33`, borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: m.cor, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: m.cor, lineHeight: 1.2 }}>{m.valor}</div>
              </div>
            ))}
          </div>

          {totalMulta > 0 && (
            <div style={{ background: '#FEE2E2', border: '2px solid #FECACA', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#B91C1C' }}>Total de Multas Lavradas</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#B91C1C' }}>
                R$ {totalMulta.toFixed(2).replace('.', ',')}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{filtrados.length} registros</div>
            <button onClick={exportarCSV} style={{
              background: '#166534', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              📊 Exportar CSV
            </button>
          </div>

          {/* Lista resumida */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtrados.slice(0, 50).map(r => (
              <div key={r.id} style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#1E293B' }}>{r.num}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{r.owner} — {r.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B' }}>{r.status}</div>
                  {r.type === 'auto' && r.multa && <div style={{ fontSize: '0.72rem', color: '#B91C1C' }}>R$ {Number(r.multa).toFixed(2).replace('.', ',')}</div>}
                </div>
              </div>
            ))}
            {filtrados.length > 50 && (
              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', padding: '8px' }}>
                Mostrando 50 de {filtrados.length}. Exporte o CSV para ver todos.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
