import React, { useState, useEffect } from 'react'
import { query, update, insert } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import Modal from '../../components/Modal.jsx'
import { isFiscal, isAdminGeral, podeJulgarDefesas } from '../../gerencia/gerencia.js'
import { imprimirDefesaOficial } from '../../impressao/DocumentoPDF.jsx'

const STATUS = {
  pendente:   { fundo: '#FEF3C7', cor: '#B45309', label: 'Pendente' },
  deferida:   { fundo: '#F0FDF4', cor: '#166534', label: 'Deferida' },
  indeferida: { fundo: '#FEE2E2', cor: '#B91C1C', label: 'Indeferida' },
}

const ABAS = [
  { id: 'pendente',   label: 'Pendentes',   cor: '#B45309', fundo: '#FEF3C7' },
  { id: 'deferida',   label: 'Deferidas',   cor: '#166534', fundo: '#F0FDF4' },
  { id: 'indeferida', label: 'Indeferidas', cor: '#B91C1C', fundo: '#FEE2E2' },
]

export default function DefesasScreen({ usuario, mostrarToast, setPagina }) {
  const [defesas, setDefesas]         = useState([])
  const [meusIds, setMeusIds]         = useState(null)
  const [carregando, setCarregando]   = useState(true)
  const [selecionada, setSelecionada] = useState(null)
  const [parecer, setParecer]         = useState('')
  const [julgando, setJulgando]       = useState(false)
  const [abaAtiva, setAbaAtiva]       = useState('pendente')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try {
      if (isFiscal(usuario)) {
        const meuRecs = await query('records', q => q.eq('matricula', usuario.matricula).select('id'))
        const ids = (meuRecs || []).map(r => r.id)
        setMeusIds(ids)
        if (ids.length === 0) { setDefesas([]); setCarregando(false); return }
        const todas = await query('defesas', q => {
          let qr = q.order('created_at', { ascending: false })
          if (!isAdminGeral(usuario)) qr = qr.eq('gerencia', usuario.gerencia)
          return qr
        })
        setDefesas((todas || []).filter(d => ids.includes(d.record_id)))
      } else {
        const dados = await query('defesas', q => {
          let qr = q.order('created_at', { ascending: false })
          if (!isAdminGeral(usuario)) qr = qr.eq('gerencia', usuario.gerencia)
          return qr
        })
        setDefesas(dados || [])
      }
    } catch (err) {
      console.error(err)
      mostrarToast('Erro ao carregar defesas', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function julgar(decisao) {
    if (!parecer.trim()) { mostrarToast('Informe o parecer', 'erro'); return }
    setJulgando(true)
    try {
      await update('defesas', selecionada.id, {
        status:      decisao,
        parecer,
        julgado_por: usuario.name,
        julgado_em:  new Date().toLocaleDateString('pt-BR'),
      })
      await insert('logs', {
        gerencia:  usuario.gerencia,
        acao:      `DEFESA_${decisao.toUpperCase()}`,
        detalhe:   `Defesa de ${selecionada.record_num} ${decisao} por ${usuario.name}. Parecer: ${parecer}`,
        usuario:   usuario.name,
      })
      mostrarToast(`Defesa ${decisao}!`, 'sucesso')
      setSelecionada(null)
      setParecer('')
      carregar()
    } catch (err) {
      console.error(err)
      mostrarToast('Erro ao julgar', 'erro')
    } finally {
      setJulgando(false)
    }
  }

  const podeJulgar = podeJulgarDefesas(usuario)

  // Contagem por aba
  const contagem = {
    pendente:   defesas.filter(d => d.status === 'pendente').length,
    deferida:   defesas.filter(d => d.status === 'deferida').length,
    indeferida: defesas.filter(d => d.status === 'indeferida').length,
  }

  const filtradas = defesas.filter(d => d.status === abaAtiva)

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button onClick={() => setPagina('mais')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Defesas</h2>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
            {isFiscal(usuario) ? 'Defesas das suas notificações e autos' : 'Todas as defesas recebidas'}
          </div>
        </div>
      </div>

      {/* Abas de status */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
        {ABAS.map(aba => {
          const ativo = abaAtiva === aba.id
          const qtd   = contagem[aba.id]
          return (
            <button key={aba.id} onClick={() => setAbaAtiva(aba.id)} style={{
              padding: '8px 16px', borderRadius: '10px', whiteSpace: 'nowrap',
              background: ativo ? aba.fundo : '#fff',
              border: `2px solid ${ativo ? aba.cor : '#E2E8F0'}`,
              color: ativo ? aba.cor : '#64748B',
              fontWeight: ativo ? '700' : '500',
              fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              {aba.label}
              {qtd > 0 && (
                <span style={{
                  background: ativo ? aba.cor : '#E2E8F0',
                  color: ativo ? '#fff' : '#64748B',
                  fontSize: '0.7rem', fontWeight: '700',
                  borderRadius: '999px', padding: '1px 8px',
                  minWidth: '20px', textAlign: 'center',
                }}>
                  {qtd}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : filtradas.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8F0', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
          <Icon name="shield" size={32} color="#CBD5E0" style={{ margin: '0 auto 12px' }} />
          <div>Nenhuma defesa {abaAtiva === 'pendente' ? 'pendente' : abaAtiva === 'deferida' ? 'deferida' : 'indeferida'}.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtradas.map(def => {
            const sc = STATUS[def.status] || STATUS.pendente
            return (
              <div key={def.id}
                onClick={() => { setSelecionada(def); setParecer(def.parecer || '') }}
                style={{ background: '#fff', border: '2px solid #E2E8F0', borderLeft: `4px solid ${sc.cor}`, borderRadius: '14px', padding: '14px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1A56DB' }}>{def.record_num}</span>
                  <span style={{ background: sc.fundo, color: sc.cor, fontSize: '0.65rem', fontWeight: '700', borderRadius: '999px', padding: '3px 10px' }}>
                    {sc.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151' }}>{def.nome}</div>
                {def.num && <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>Protocolo: {def.num}</div>}
                {def.cpf && <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>CPF: {def.cpf}</div>}
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{def.created_at ? new Date(def.created_at).toLocaleDateString('pt-BR') : ''}</span>
                  {def.julgado_por && <span>Julgado por: {def.julgado_por}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal aberto={!!selecionada} onClose={() => { setSelecionada(null); setParecer('') }} titulo={`Defesa — ${selecionada?.record_num}`}>
        {selecionada && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InfoBloco label="Defensor" valor={`${selecionada.nome}${selecionada.cpf ? ` — CPF: ${selecionada.cpf}` : ''}`} />
            {selecionada.num && <InfoBloco label="Protocolo" valor={selecionada.num} />}
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '6px' }}>Texto da defesa</div>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', fontSize: '0.85rem', color: '#374151', lineHeight: 1.6, maxHeight: '200px', overflowY: 'auto' }}>
                {selecionada.texto}
              </div>
            </div>
            {selecionada.anexos?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '6px' }}>Anexos</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selecionada.anexos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#1A56DB' }}>📎 Anexo {i+1}</a>
                  ))}
                </div>
              </div>
            )}

            {selecionada.status === 'pendente' && podeJulgar ? (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Parecer *</div>
                <textarea
                  value={parecer} onChange={e => setParecer(e.target.value)}
                  rows={4} placeholder="Fundamente a decisão..." style={{ resize: 'vertical', marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => julgar('deferida')} disabled={julgando} style={{
                    flex: 1, background: '#166534', color: '#fff', border: 'none',
                    borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer',
                  }}>
                    ✅ Deferir
                  </button>
                  <button onClick={() => julgar('indeferida')} disabled={julgando} style={{
                    flex: 1, background: '#B91C1C', color: '#fff', border: 'none',
                    borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer',
                  }}>
                    ❌ Indeferir
                  </button>
                </div>
              </div>
            ) : selecionada.status !== 'pendente' ? (
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
                  Parecer — {selecionada.julgado_por} em {selecionada.julgado_em}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#374151' }}>{selecionada.parecer}</div>
              </div>
            ) : (
              <div style={{ background: '#FEF3C7', borderRadius: '10px', padding: '12px', fontSize: '0.82rem', color: '#B45309' }}>
                ⏳ Aguardando julgamento pela Gerência
              </div>
            )}

            {/* Imprimir defesa A4 */}
            <button onClick={() => imprimirDefesaOficial(selecionada, null)} style={{
              background: '#F8FAFC', color: '#374151', border: '2px solid #E2E8F0',
              borderRadius: '10px', padding: '10px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
            }}>
              📄 Imprimir Defesa (A4)
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

function InfoBloco({ label, valor }) {
  if (!valor) return null
  return (
    <div>
      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</div>
      <div style={{ fontSize: '0.88rem', color: '#374151' }}>{valor}</div>
    </div>
  )
}
