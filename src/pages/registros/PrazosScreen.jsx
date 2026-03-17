import React, { useState, useEffect } from 'react'
import { query } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'

export default function PrazosScreen({ usuario, mostrarToast }) {
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const dados = await query('records', q => {
        let qr = q.eq('status', 'Pendente').not('prazo', 'is', null)
        if (usuario.gerencia !== 'admin_geral') qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })
      setRegistros(dados)
    } catch {
      mostrarToast('Erro ao carregar prazos', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  function diasRestantes(prazoStr) {
    if (!prazoStr) return null
    const [d, m, a] = prazoStr.split('/')
    const prazo = new Date(`${a}-${m}-${d}`)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const diff = Math.ceil((prazo - hoje) / (1000 * 60 * 60 * 24))
    return diff
  }

  function corPrazo(dias) {
    if (dias < 0) return { cor: '#B91C1C', fundo: '#FEE2E2', label: `${Math.abs(dias)}d vencido` }
    if (dias === 0) return { cor: '#B91C1C', fundo: '#FEE2E2', label: 'Vence hoje' }
    if (dias <= 3) return { cor: '#B45309', fundo: '#FEF3C7', label: `${dias}d restante${dias > 1 ? 's' : ''}` }
    return { cor: '#166534', fundo: '#F0FDF4', label: `${dias}d restante${dias > 1 ? 's' : ''}` }
  }

  const ordenados = [...registros].sort((a, b) => {
    const dA = diasRestantes(a.prazo) ?? 999
    const dB = diasRestantes(b.prazo) ?? 999
    return dA - dB
  })

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '4px' }}>Controle de Prazos</h2>
      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '20px' }}>
        Registros pendentes ordenados por prazo
      </p>

      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : ordenados.length === 0 ? (
        <div style={{
          background: '#F0FDF4',
          border: '2px solid #BBF7D0',
          borderRadius: '14px',
          padding: '32px',
          textAlign: 'center',
          color: '#166534',
        }}>
          <Icon name="check" size={32} color="#166534" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontWeight: '600' }}>Nenhum prazo pendente!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ordenados.map(reg => {
            const dias = diasRestantes(reg.prazo)
            const { cor, fundo, label } = corPrazo(dias)
            return (
              <div key={reg.id} style={{
                background: '#fff',
                border: `2px solid ${cor}33`,
                borderLeft: `4px solid ${cor}`,
                borderRadius: '12px',
                padding: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>{reg.num}</span>
                  <span style={{ background: fundo, color: cor, fontSize: '0.7rem', fontWeight: '700', borderRadius: '999px', padding: '3px 10px' }}>
                    {label}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151' }}>{reg.owner}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{reg.addr}</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '6px' }}>
                  Prazo: {reg.prazo} • Fiscal: {reg.fiscal}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
