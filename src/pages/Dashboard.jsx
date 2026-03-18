import React, { useEffect, useState } from 'react'
import { query } from '../config/supabase.js'
import Icon from '../components/Icon.jsx'
import { statusCores } from '../config/theme.js'
import {
  isFiscal, isBalcao, isAdministracao, isGerencia, isAdminGeral,
  podeEmitirDocumentos, podeRegistrarReclamacoes
} from '../gerencia/gerencia.js'

export default function Dashboard({ usuario, setPagina }) {
  const [contadores, setContadores] = useState({ registros: 0, pendentes: 0, reclamacoes: 0, prazosHoje: 0 })
  const [ultimos, setUltimos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregarDados() }, [usuario])

  async function carregarDados() {
    try {
      const isGeral = isAdminGeral(usuario)

      const registros = await query('records', q => {
        let qr = q.order('created_at', { ascending: false }).limit(100)
        if (!isGeral) qr = qr.eq('gerencia', usuario.gerencia)
        // Fiscal só vê os próprios registros
        if (isFiscal(usuario)) qr = qr.eq('matricula', usuario.matricula)
        return qr
      })

      const reclamacoes = await query('reclamacoes', q => {
        let qr = q.eq('status', 'nova')
        if (!isGeral) qr = qr.eq('gerencia', usuario.gerencia)
        // Fiscal só vê reclamações atribuídas a ele
        if (isFiscal(usuario)) qr = qr.eq('fiscal_matricula', usuario.matricula)
        return qr
      })

      const hoje = new Date().toLocaleDateString('pt-BR')
      const vencendoHoje = registros.filter(r => r.prazo === hoje && r.status === 'Pendente')

      setContadores({
        registros: registros.length,
        pendentes: registros.filter(r => r.status === 'Pendente').length,
        reclamacoes: reclamacoes.length,
        prazosHoje: vencendoHoje.length,
      })
      setUltimos(registros.slice(0, 5))
    } catch (err) {
      console.error('Erro dashboard:', err)
    } finally {
      setCarregando(false)
    }
  }

  // Cards variam por perfil
  const cards = buildCards(usuario, contadores, setPagina)
  const acoes = buildAcoes(usuario, setPagina)

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

      {/* Badge de perfil */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: '#F1F5F9', borderRadius: '10px', padding: '8px 14px', marginBottom: '20px',
      }}>
        <Icon name="user" size={16} color="#64748B" />
        <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '600' }}>
          {labelPerfil(usuario)}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {cards.map((card, i) => (
          <button key={i} onClick={card.acao} style={{
            background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px',
            padding: '16px', textAlign: 'left', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ background: card.fundo, borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={card.icone} size={20} color={card.cor} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1E293B', lineHeight: 1 }}>
                {carregando ? '...' : card.valor}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>{card.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Ações rápidas */}
      {acoes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Ações Rápidas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {acoes.map((a, i) => (
              <button key={i} onClick={a.acao} style={{
                background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px',
                padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
              }}>
                <div style={{ background: a.fundo, borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={a.icone} size={18} color={a.cor} />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1E293B' }}>{a.titulo}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{a.subtitulo}</div>
                </div>
                <Icon name="chevronRight" size={18} color="#CBD5E0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Últimos registros — só para quem vê registros */}
      {!isBalcao(usuario) && (
        <div>
          <h3 style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Últimos Registros
          </h3>
          {carregando ? (
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Carregando...</p>
          ) : ultimos.length === 0 ? (
            <div style={{ background: '#fff', border: '2px dashed #E2E8F0', borderRadius: '14px', padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
              Nenhum registro ainda
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ultimos.map(reg => {
                const sc = statusCores[reg.status] || { fundo: '#F1F5F9', cor: '#6B7280' }
                return (
                  <div key={reg.id} style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1E293B' }}>{reg.num}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {reg.owner || 'Sem proprietário'}
                      </div>
                    </div>
                    <span style={{ background: sc.fundo, color: sc.cor, fontSize: '0.65rem', fontWeight: '700', borderRadius: '999px', padding: '3px 10px', whiteSpace: 'nowrap' }}>
                      {reg.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function labelPerfil(u) {
  const nomes = { fiscal: 'Fiscal', balcao: 'Balcão', administracao: 'Administração', gerencia: 'Gerência', admin: 'Administrador Geral' }
  const mod = u.gerencia === 'obras' ? '— Obras' : u.gerencia === 'posturas' ? '— Posturas' : ''
  return `${nomes[u.role] || u.role} ${mod}`
}

function buildCards(u, c, nav) {
  if (isBalcao(u)) return [
    { label: 'Reclamações Novas', valor: c.reclamacoes, icone: 'phone', cor: '#B91C1C', fundo: '#FEE2E2', acao: () => nav('reclamacoes') },
    { label: 'Registradas Hoje', valor: 0, icone: 'check', cor: '#166534', fundo: '#F0FDF4', acao: () => nav('reclamacoes') },
  ]
  if (isFiscal(u)) return [
    { label: 'Meus Registros', valor: c.registros, icone: 'file', cor: '#1A56DB', fundo: '#EBF5FF', acao: () => nav('registros') },
    { label: 'Pendentes', valor: c.pendentes, icone: 'clock', cor: '#B45309', fundo: '#FEF3C7', acao: () => nav('prazos') },
    { label: 'Reclamações p/ mim', valor: c.reclamacoes, icone: 'phone', cor: '#B91C1C', fundo: '#FEE2E2', acao: () => nav('reclamacoes') },
    { label: 'Prazos Hoje', valor: c.prazosHoje, icone: 'alert', cor: '#7E22CE', fundo: '#FDF4FF', acao: () => nav('prazos') },
  ]
  return [
    { label: 'Total Registros', valor: c.registros, icone: 'file', cor: '#1A56DB', fundo: '#EBF5FF', acao: () => nav('registros') },
    { label: 'Pendentes', valor: c.pendentes, icone: 'clock', cor: '#B45309', fundo: '#FEF3C7', acao: () => nav('registros') },
    { label: 'Reclamações', valor: c.reclamacoes, icone: 'phone', cor: '#B91C1C', fundo: '#FEE2E2', acao: () => nav('reclamacoes') },
    { label: 'Prazos Hoje', valor: c.prazosHoje, icone: 'alert', cor: '#7E22CE', fundo: '#FDF4FF', acao: () => nav('prazos') },
  ]
}

function buildAcoes(u, nav) {
  const acoes = []
  if (podeEmitirDocumentos(u)) {
    acoes.push({ titulo: 'Nova Notificação', subtitulo: 'Registrar irregularidade', icone: 'plus', cor: '#1A56DB', fundo: '#EBF5FF', acao: () => nav('nova-notificacao') })
    acoes.push({ titulo: 'Novo Auto de Infração', subtitulo: 'Lavrar auto', icone: 'alert', cor: '#B91C1C', fundo: '#FEE2E2', acao: () => nav('novo-auto') })
  }
  if (podeRegistrarReclamacoes(u)) {
    acoes.push({ titulo: 'Nova Reclamação', subtitulo: 'Registrar denúncia', icone: 'phone', cor: '#166534', fundo: '#F0FDF4', acao: () => nav('nova-reclamacao') })
  }
  return acoes
}
