import React, { useState, useEffect } from 'react'
import { insert, rpc, get, upload } from '../../config/supabase.js'
import { gerarCodigoAcesso, gerarNumDocumento } from '../../gerencia/gerencia.js'
import PhotoSlot from '../../components/PhotoSlot.jsx'
import SigCanvas from '../../components/SigCanvas.jsx'
import InfracoesObras from './InfracoesObras.jsx'
import InfracoesPosturas from './InfracoesPosturas.jsx'
import Icon from '../../components/Icon.jsx'

export default function FormNotificacao({ usuario, mostrarToast, setPagina }) {
  const [form, setForm] = useState({
    owner: '', cpf: '', addr: '', bairro: '', loteamento: '',
    descricao: '', prazo: '', infracoes: [],
  })
  const [bairros, setBairros] = useState([])
  const [fotos, setFotos] = useState([null, null, null, null])
  const [assinatura, setAssinatura] = useState(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (usuario.gerencia === 'obras') {
      get('bairros', { ativo: true }).then(setBairros).catch(() => setBairros([]))
    }
  }, [])

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleFoto(index, arquivo) {
    try {
      const caminho = `fotos/${Date.now()}_${index}.jpg`
      const url = await upload('fiscon-fotos', caminho, arquivo)
      const novas = [...fotos]
      novas[index] = url
      setFotos(novas)
    } catch {
      mostrarToast('Erro ao enviar foto', 'erro')
    }
  }

  function removerFoto(index) {
    const novas = [...fotos]
    novas[index] = null
    setFotos(novas)
  }

  async function salvar() {
    if (!form.owner || !form.addr || form.infracoes.length === 0) {
      mostrarToast('Preencha proprietário, endereço e ao menos uma infração', 'erro')
      return
    }
    setSalvando(true)
    try {
      // Buscar próximo sequencial
      const seq = await rpc('proximo_sequencial', { p_gerencia: usuario.gerencia, p_tipo: 'notif' })
      const num = gerarNumDocumento('notif', usuario.gerencia, seq || 1)
      const codigo_acesso = gerarCodigoAcesso()
      const id = `notif-${Date.now()}`

      await insert('records', {
        id,
        num,
        type: 'notif',
        gerencia: usuario.gerencia,
        owner: form.owner,
        cpf: form.cpf,
        addr: form.addr,
        bairro: form.bairro,
        loteamento: form.loteamento,
        descricao: form.descricao,
        prazo: form.prazo,
        infracoes: form.infracoes,
        fiscal: usuario.name,
        matricula: usuario.matricula,
        status: 'Pendente',
        codigo_acesso,
        foto_urls: fotos.filter(Boolean),
        date: new Date().toLocaleDateString('pt-BR'),
      })

      // Log
      await insert('logs', {
        gerencia: usuario.gerencia,
        acao: 'NOVA_NOTIFICACAO',
        detalhe: `Notificação ${num} criada`,
        usuario: usuario.name,
      })

      mostrarToast(`Notificação ${num} criada com sucesso!`, 'sucesso')
      setPagina('registros')
    } catch (err) {
      console.error(err)
      mostrarToast('Erro ao salvar notificação', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  const ehObras = usuario.gerencia === 'obras'

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setPagina('registros')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Nova Notificação</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Dados do proprietário */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Proprietário / Infrator</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Campo label="Nome completo *">
              <input value={form.owner} onChange={e => set('owner', e.target.value)} placeholder="Nome do proprietário" />
            </Campo>
            <Campo label="CPF / CNPJ">
              <input value={form.cpf} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" />
            </Campo>
          </div>
        </div>

        {/* Endereço */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Endereço</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Campo label="Endereço completo *">
              <input value={form.addr} onChange={e => set('addr', e.target.value)} placeholder="Rua, número" />
            </Campo>
            {ehObras ? (
              <Campo label="Bairro">
                <select value={form.bairro} onChange={e => set('bairro', e.target.value)}>
                  <option value="">Selecione o bairro</option>
                  {bairros.map(b => <option key={b.id} value={b.nome}>{b.nome}</option>)}
                </select>
              </Campo>
            ) : (
              <Campo label="Bairro">
                <input value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Bairro" />
              </Campo>
            )}
            {ehObras && (
              <Campo label="Loteamento">
                <input value={form.loteamento} onChange={e => set('loteamento', e.target.value)} placeholder="Nome do loteamento" />
              </Campo>
            )}
          </div>
        </div>

        {/* Infrações */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Infrações *</h3>
          {ehObras ? (
            <InfracoesObras selecionadas={form.infracoes} onChange={v => set('infracoes', v)} />
          ) : (
            <InfracoesPosturas selecionadas={form.infracoes} onChange={v => set('infracoes', v)} />
          )}
        </div>

        {/* Descrição e prazo */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Detalhes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Campo label="Descrição da irregularidade">
              <textarea
                value={form.descricao}
                onChange={e => set('descricao', e.target.value)}
                placeholder="Descreva a irregularidade encontrada..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </Campo>
            <Campo label="Prazo para regularização (data)">
              <input
                type="text"
                value={form.prazo}
                onChange={e => set('prazo', e.target.value)}
                placeholder="DD/MM/AAAA"
              />
            </Campo>
          </div>
        </div>

        {/* Fotos */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase' }}>Fotos (até 4)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {fotos.map((url, i) => (
              <PhotoSlot
                key={i}
                url={url}
                label={`Foto ${i + 1}`}
                onUpload={(arquivo) => handleFoto(i, arquivo)}
                onRemove={() => removerFoto(i)}
              />
            ))}
          </div>
        </div>

        {/* Assinatura */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <SigCanvas onChange={setAssinatura} />
        </div>

        {/* Botão salvar */}
        <button
          onClick={salvar}
          disabled={salvando}
          style={{
            background: '#1A56DB',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check" size={18} color="#fff" />
          {salvando ? 'Salvando...' : 'Salvar Notificação'}
        </button>
      </div>
    </div>
  )
}

function Campo({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      {children}
    </div>
  )
}
