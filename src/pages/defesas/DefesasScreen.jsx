import React, { useState, useEffect } from 'react'
import { query, update, insert } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import Modal from '../../components/Modal.jsx'

export default function DefesasScreen({ usuario, mostrarToast }) {
  const [defesas, setDefesas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [selecionada, setSelecionada] = useState(null)
  const [parecer, setParecer] = useState('')
  const [julgando, setJulgando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const dados = await query('defesas', q => {
        let qr = q.order('created_at', { ascending: false })
        if (usuario.gerencia !== 'admin_geral') qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })
      setDefesas(dados)
    } catch {
      mostrarToast('Erro ao carregar defesas', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function julgar(decisao) {
    if (!parecer.trim()) {
      mostrarToast('Informe o parecer antes de julgar', 'erro')
      return
    }
    setJulgando(true)
    try {
      await update('defesas', selecionada.id, {
        status: decisao,
        parecer,
        julgado_por: usuario.name,
        julgado_em: new Date().toLocaleDateString('pt-BR'),
      })
      await insert('logs', {
        gerencia: usuario.gerencia,
        acao: `DEFESA_${decisao.toUpperCase()}`,
        detalhe: `Defesa do processo ${selecionada.record_num} foi ${decisao}`,
        usuario: usuario.name,
      })
      mostrarToast(`Defesa ${decisao} com sucesso!`, 'sucesso')
      setSelecionada(null)
      carregar()
    } catch {
      mostrarToast('Erro ao julgar defesa', 'erro')
    } finally {
      setJulgando(false)
    }
  }

  const STATUS = {
    pendente: { fundo: '#FEF3C7', cor: '#B45309', label: 'Pendente' },
    deferida: { fundo: '#F0FDF4', cor: '#166534', label: 'Deferida' },
    indeferida: { fundo: '#FEE2E2', cor: '#B91C1C', label: 'Indeferida' },
  }

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '16px' }}>Defesas Recebidas</h2>

      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : defesas.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8F0', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
          <Icon name="shield" size={32} color="#CBD5E0" style={{ margin: '0 auto 12px' }} />
          <div>Nenhuma defesa recebida</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {defesas.map(def => {
            const sc = STATUS[def.status] || STATUS.pendente
            return (
              <div key={def.id} onClick={() => { setSelecionada(def); setParecer(def.parecer || '') }}
                style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1A56DB' }}>{def.record_num}</span>
                  <span style={{ background: sc.fundo, color: sc.cor, fontSize: '0.65rem', fontWeight: '700', borderRadius: '999px', padding: '3px 10px' }}>{sc.label}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151' }}>{def.nome}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  {new Date(def.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de detalhe */}
      <Modal aberto={!!selecionada} onClose={() => setSelecionada(null)} titulo={`Defesa — ${selecionada?.record_num}`}>
        {selecionada && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>Defensor</div>
              <div style={{ fontWeight: '600' }}>{selecionada.nome}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>CPF: {selecionada.cpf}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>Texto da defesa</div>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>
                {selecionada.texto}
              </div>
            </div>
            {selecionada.anexos?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '8px' }}>Anexos</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selecionada.anexos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#1A56DB', textDecoration: 'underline' }}>
                      Anexo {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {selecionada.status === 'pendente' ? (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Parecer do julgamento *</div>
                <textarea value={parecer} onChange={e => setParecer(e.target.value)} rows={4} placeholder="Fundamente a decisão..." style={{ resize: 'vertical', width: '100%' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button onClick={() => julgar('deferida')} disabled={julgando} style={{
                    flex: 1, background: '#166534', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer',
                  }}>
                    ✅ Deferir
                  </button>
                  <button onClick={() => julgar('indeferida')} disabled={julgando} style={{
                    flex: 1, background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer',
                  }}>
                    ❌ Indeferir
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Parecer — {selecionada.julgado_por} em {selecionada.julgado_em}</div>
                <div style={{ fontSize: '0.85rem', color: '#374151', marginTop: '4px' }}>{selecionada.parecer}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
