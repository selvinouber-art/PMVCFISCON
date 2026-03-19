import React, { useState, useEffect } from 'react'
import { get } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'

const CATEGORIAS = [
  { codigo: 'HP', nome: 'Higiene Pública' },
  { codigo: 'HE', nome: 'Higiene de Estabelecimentos' },
  { codigo: 'CI', nome: 'Conservação de Imóveis' },
  { codigo: 'PS', nome: 'Poluição Sonora e Visual' },
  { codigo: 'FE', nome: 'Funcionamento de Estabelecimentos' },
  { codigo: 'FC', nome: 'Feiras e Comércio Eventual' },
  { codigo: 'OV', nome: 'Obstrução de Vias' },
  { codigo: 'AV', nome: 'Animais e Vegetação' },
  { codigo: 'DP', nome: 'Diversões e Ordem Pública' },
]

// mostrarValores: false nas notificações, true nos autos
export default function InfracoesPosturas({ selecionadas = [], onChange, mostrarValores = false }) {
  const [infracoes, setInfracoes] = useState([])
  const [categoria, setCategoria] = useState('')
  const [busca, setBusca]         = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    get('infracoes_posturas', { ativo: true })
      .then(setInfracoes)
      .catch(() => setInfracoes([]))
      .finally(() => setCarregando(false))
  }, [])

  function toggle(infracao) {
    const jatem = selecionadas.find(s => s.id === infracao.id)
    if (jatem) onChange(selecionadas.filter(s => s.id !== infracao.id))
    else onChange([...selecionadas, infracao])
  }

  const filtradas = infracoes.filter(i => {
    const catOk   = !categoria || i.codigo.startsWith(categoria)
    const buscaOk = !busca || i.descricao.toLowerCase().includes(busca.toLowerCase()) || i.codigo.toLowerCase().includes(busca.toLowerCase())
    return catOk && buscaOk
  })

  const totalUFM = selecionadas.reduce((acc, i) => acc + (Number(i.valor) || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
          Infrações ({selecionadas.length} selecionada{selecionadas.length !== 1 ? 's' : ''})
        </label>
        {mostrarValores && selecionadas.length > 0 && (
          <span style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: '700' }}>
            ~{totalUFM.toFixed(0)} UFMs
          </span>
        )}
      </div>

      <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ marginBottom: '8px', fontSize: '0.82rem' }}>
        <option value="">Todas as categorias</option>
        {CATEGORIAS.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} — {c.nome}</option>)}
      </select>

      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <Icon name="search" size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        <input type="text" placeholder="Buscar infração..." value={busca} onChange={e => setBusca(e.target.value)}
          style={{ paddingLeft: '30px', fontSize: '0.82rem' }} />
      </div>

      {carregando ? (
        <p style={{ color: '#94A3B8', fontSize: '0.82rem', padding: '16px', textAlign: 'center' }}>Carregando...</p>
      ) : filtradas.length === 0 ? (
        <p style={{ color: '#94A3B8', fontSize: '0.82rem', padding: '12px', textAlign: 'center' }}>Nenhuma infração encontrada.</p>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtradas.map(inf => {
            const sel = !!selecionadas.find(s => s.id === inf.id)
            return (
              <button key={inf.id} onClick={() => toggle(inf)} style={{
                background: sel ? '#F0FDF4' : '#fff',
                border: `2px solid ${sel ? '#166534' : '#E2E8F0'}`,
                borderRadius: '10px', padding: '10px 12px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, marginTop: '1px',
                  border: `2px solid ${sel ? '#166534' : '#CBD5E0'}`,
                  background: sel ? '#166534' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sel && <Icon name="check" size={12} color="#fff" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>{inf.codigo}</div>
                  <div style={{ fontSize: '0.82rem', color: '#1E293B', lineHeight: 1.4 }}>{inf.descricao}</div>
                  {mostrarValores && inf.valor > 0 && (
                    <div style={{ fontSize: '0.72rem', color: '#B91C1C', marginTop: '4px', fontWeight: '600' }}>
                      ~{inf.valor} UFMs
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
