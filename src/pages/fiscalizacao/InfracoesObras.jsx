import React, { useState } from 'react'
import { INFRACOES_Q61, INFRACOES_Q62 } from '../../config/constants.js'
import Icon from '../../components/Icon.jsx'

// Seletor de infrações de obras (Q61 + Q62)
// Uso: <InfracoesObras selecionadas={[]} onChange={fn} />

export default function InfracoesObras({ selecionadas = [], onChange }) {
  const [quadro, setQuadro] = useState('q61')
  const [busca, setBusca] = useState('')

  const lista = quadro === 'q61' ? INFRACOES_Q61 : INFRACOES_Q62

  const filtradas = lista.filter(i =>
    !busca ||
    i.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    i.codigo.includes(busca)
  )

  function toggleInfracao(infracao) {
    const jatem = selecionadas.find(s => s.id === infracao.id)
    if (jatem) {
      onChange(selecionadas.filter(s => s.id !== infracao.id))
    } else {
      onChange([...selecionadas, infracao])
    }
  }

  const totalMulta = selecionadas.reduce((acc, i) => acc + (i.valor || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
          Infrações ({selecionadas.length} selecionada{selecionadas.length !== 1 ? 's' : ''})
        </label>
        {selecionadas.length > 0 && (
          <span style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: '700' }}>
            Total: R$ {totalMulta.toFixed(2).replace('.', ',')}
          </span>
        )}
      </div>

      {/* Tabs Q61 / Q62 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        {['q61', 'q62'].map(q => (
          <button
            key={q}
            onClick={() => setQuadro(q)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: '2px solid',
              borderColor: quadro === q ? '#1A56DB' : '#E2E8F0',
              background: quadro === q ? '#EBF5FF' : '#fff',
              color: quadro === q ? '#1A56DB' : '#64748B',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {q === 'q61' ? 'Quadro 6.1 — Obras' : 'Quadro 6.2 — Urbanização'}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <Icon name="search" size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Buscar infração..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ paddingLeft: '30px', fontSize: '0.82rem', padding: '8px 8px 8px 30px' }}
        />
      </div>

      {/* Lista */}
      <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filtradas.map(inf => {
          const selecionada = !!selecionadas.find(s => s.id === inf.id)
          return (
            <button
              key={inf.id}
              onClick={() => toggleInfracao(inf)}
              style={{
                background: selecionada ? '#EBF5FF' : '#fff',
                border: `2px solid ${selecionada ? '#1A56DB' : '#E2E8F0'}`,
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '5px',
                border: `2px solid ${selecionada ? '#1A56DB' : '#CBD5E0'}`,
                background: selecionada ? '#1A56DB' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}>
                {selecionada && <Icon name="check" size={12} color="#fff" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>Art. {inf.codigo}</div>
                <div style={{ fontSize: '0.82rem', color: '#1E293B', lineHeight: 1.4 }}>{inf.descricao}</div>
                <div style={{ fontSize: '0.72rem', color: '#B91C1C', marginTop: '4px', fontWeight: '600' }}>
                  {inf.penalidade} — R$ {inf.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
