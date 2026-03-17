import React, { useState } from 'react'
import { insert, upload } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import { ORIGENS_RECLAMACAO, PRIORIDADES } from '../../config/constants.js'

export default function NovaReclamacao({ usuario, mostrarToast, setPagina }) {
  const [form, setForm] = useState({
    reclamante: '', telefone: '', email: '',
    reclamado: '', cpf_cnpj: '',
    endereco: '', numero: '', bairro: '', cep: '',
    descricao: '', prioridade: 'normal', origem: 'presencial',
  })
  const [foto, setFoto] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const caminho = `reclamacoes/${Date.now()}.jpg`
      const url = await upload('fiscon-fotos', caminho, file)
      setFoto(url)
    } catch {
      mostrarToast('Erro ao enviar foto', 'erro')
    }
  }

  async function salvar() {
    if (!form.descricao || !form.endereco) {
      mostrarToast('Preencha endereço e descrição', 'erro')
      return
    }
    setSalvando(true)
    try {
      const protocolo = `RC-${Date.now().toString(36).toUpperCase().slice(-6)}`
      await insert('reclamacoes', {
        id: `rec-${Date.now()}`,
        gerencia: usuario.gerencia,
        protocolo,
        origem: form.origem,
        reclamante: form.reclamante,
        telefone: form.telefone,
        email: form.email,
        reclamado: form.reclamado,
        cpf_cnpj: form.cpf_cnpj,
        endereco: form.endereco,
        numero: form.numero,
        bairro: form.bairro,
        cep: form.cep,
        descricao: form.descricao,
        prioridade: form.prioridade,
        status: 'nova',
        foto_url: foto,
      })
      mostrarToast(`Reclamação ${protocolo} registrada!`, 'sucesso')
      setPagina('reclamacoes')
    } catch (err) {
      console.error(err)
      mostrarToast('Erro ao salvar reclamação', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setPagina('reclamacoes')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Nova Reclamação</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Origem e prioridade */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Campo label="Origem" style={{ flex: 1 }}>
              <select value={form.origem} onChange={e => set('origem', e.target.value)}>
                {ORIGENS_RECLAMACAO.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Campo>
            <Campo label="Prioridade" style={{ flex: 1 }}>
              <select value={form.prioridade} onChange={e => set('prioridade', e.target.value)}>
                {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Campo>
          </div>
        </div>

        {/* Reclamante */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Reclamante (opcional)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Campo label="Nome"><input value={form.reclamante} onChange={e => set('reclamante', e.target.value)} placeholder="Nome do reclamante" /></Campo>
            <Campo label="Telefone"><input value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(77) 99999-9999" /></Campo>
          </div>
        </div>

        {/* Reclamado */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Reclamado / Local</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Campo label="Nome / Estabelecimento"><input value={form.reclamado} onChange={e => set('reclamado', e.target.value)} /></Campo>
            <Campo label="Endereço *"><input value={form.endereco} onChange={e => set('endereco', e.target.value)} /></Campo>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Campo label="Número" style={{ flex: 1 }}><input value={form.numero} onChange={e => set('numero', e.target.value)} /></Campo>
              <Campo label="Bairro" style={{ flex: 2 }}><input value={form.bairro} onChange={e => set('bairro', e.target.value)} /></Campo>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <Campo label="Descrição da reclamação *">
            <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)} rows={4} placeholder="Descreva o problema relatado..." style={{ resize: 'vertical' }} />
          </Campo>
        </div>

        {/* Foto */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Foto (opcional)</h3>
          {foto ? (
            <div style={{ position: 'relative' }}>
              <img src={foto} style={{ width: '100%', borderRadius: '10px', maxHeight: '200px', objectFit: 'cover' }} />
              <button onClick={() => setFoto(null)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(185,28,28,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={14} color="#fff" />
              </button>
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px dashed #CBD5E0', borderRadius: '10px', cursor: 'pointer', color: '#94A3B8', fontSize: '0.82rem' }}>
              <Icon name="camera" size={24} color="#94A3B8" />
              Adicionar foto
              <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        <button onClick={salvar} disabled={salvando} style={{
          background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '12px',
          padding: '16px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
        }}>
          {salvando ? 'Salvando...' : 'Registrar Reclamação'}
        </button>
      </div>
    </div>
  )
}

function Campo({ label, children, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      {children}
    </div>
  )
}
