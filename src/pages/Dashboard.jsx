import React, { useEffect, useState } from 'react'
import { query } from '../config/supabase.js'
import { filtrarPorGerencia } from '../gerencia/gerencia.js'
import Icon from '../components/Icon.jsx'
import { statusCores } from '../config/theme.js'

export default function Dashboard({ usuario, setPagina }) {
  const [contadores, setContadores] = useState({
    registros: 0,
    pendentes: 0,
    reclamacoes: 0,
    prazosHoje: 0,
  })
  const [ultimosRegistros, setUltimosRegistros] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [usuario])

  async function carregarDados() {
    try {
      // Buscar registros filtrados por gerência
      const registros = await query('records', q => {
        if (usuario.gerencia !== 'admin_geral') {
          return q.eq('gerencia', usuario.gerencia).order('created_at', { ascending: false }).limit(100)
        }
        return q.order('created_at', { ascending: false }).limit(100)
      })

      // Reclamações
      const reclamacoes = await query('reclamacoes', q => {
        let qr = q.eq('status', 'nova')
        if (usuario.gerencia !== 'admin_geral') qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })

      // Prazos vencendo hoje
      const hoje = new Date().toLocaleDateString('pt-BR')
      const vencendoHoje = registros.filter(r =>
        r.prazo === hoje && r.status === 'Pendente'
      )

      setContadores({
        registros: registros.length,
        pendentes: registros.filter(r => r.status === 'Pendente').length,
        reclamacoes: reclamacoes.length,
        prazosHoje: vencendoHoje.length,
      })

      setUltimosRegistros(registros.slice(0, 5))
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
    } finally {
      setCarregando(false)
    }
  }

  const cards = [
    {
      label: 'Total de Registros',
      valor: contadores.registros,
      icone: 'file',
      cor: '#1A56DB',
      fundo: '#EBF5FF',
      acao: () => setPagina('registros'),
    },
    {
      label: 'Pendentes',
      valor: contadores.pendentes,
      icone: 'clock',
      cor: '#B45309',
      fundo: '#FEF3C7',
      acao: () => setPagina('registros'),
    },
    {
      label: 'Reclamações Novas',
      valor: contadores.reclamacoes,
      icone: 'phone',
      cor: '#B91C1C',
      fundo: '#FEE2E2',
      acao: () => setPagina('reclamacoes'),
    },
    {
      label: 'Prazos Hoje',
      valor: contadores.prazosHoje,
      icone: 'alert',
      cor: '#7E22CE',
      fundo: '#FDF4FF',
      acao: () => setPagina('prazos'),
    },
  ]

  return (
    <div style={{ padding: '16px' }}>
      {/* Saudação */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#1E293B', margin: 0 }}>
          Olá, {usuario.name?.split(' ')[0]}! 👋
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Cards de contadores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.acao}
            style={{
              background: '#fff',
              border: '2px solid #E2E8F0',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{
              background: card.fundo,
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name={card.icone} size={20} color={card.cor} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1E293B', lineHeight: 1 }}>
                {carregando ? '...' : card.valor}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                {card.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Ações rápidas */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ações Rápidas
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setPagina('nova-notificacao')}
            style={estilos.botaoAcao}
          >
            <div style={{ ...estilos.iconeAcao, background: '#EBF5FF' }}>
              <Icon name="plus" size={18} color="#1A56DB" />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1E293B' }}>Nova Notificação</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Registrar irregularidade</div>
            </div>
            <Icon name="chevronRight" size={18} color="#CBD5E0" style={{ marginLeft: 'auto' }} />
          </button>

          <button
            onClick={() => setPagina('nova-reclamacao')}
            style={estilos.botaoAcao}
          >
            <div style={{ ...estilos.iconeAcao, background: '#FEE2E2' }}>
              <Icon name="phone" size={18} color="#B91C1C" />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1E293B' }}>Nova Reclamação</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Registrar denúncia</div>
            </div>
            <Icon name="chevronRight" size={18} color="#CBD5E0" style={{ marginLeft: 'auto' }} />
          </button>
        </div>
      </div>

      {/* Últimos registros */}
      <div>
        <h3 style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Últimos Registros
        </h3>
        {carregando ? (
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Carregando...</p>
        ) : ultimosRegistros.length === 0 ? (
          <div style={{
            background: '#fff',
            border: '2px dashed #E2E8F0',
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: '0.85rem',
          }}>
            Nenhum registro encontrado
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ultimosRegistros.map(reg => {
              const sc = statusCores[reg.status] || { fundo: '#F1F5F9', cor: '#6B7280' }
              return (
                <div
                  key={reg.id}
                  style={{
                    background: '#fff',
                    border: '2px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1E293B' }}>{reg.num}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {reg.owner || 'Sem proprietário'}
                    </div>
                  </div>
                  <span style={{
                    background: sc.fundo,
                    color: sc.cor,
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    whiteSpace: 'nowrap',
                  }}>
                    {reg.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const estilos = {
  botaoAcao: {
    background: '#fff',
    border: '2px solid #E2E8F0',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  iconeAcao: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}
