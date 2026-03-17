import React, { useState, useEffect } from 'react'
import { rpc, get } from '../../config/supabase.js'
import Modal from '../../components/Modal.jsx'
import { GerenciaSelector, FuncaoSelector } from '../../gerencia/GerenciaUI.jsx'

export default function UserFormModal({ aberto, onClose, usuario, onSalvo, mostrarToast }) {
  const [form, setForm] = useState({
    name: '', matricula: '', senha: '', role: '', gerencia: '',
    email: '', telefone: '',
  })
  const [funcoes, setFuncoes] = useState([])
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (usuario) {
      setForm({ ...usuario, senha: '' })
      carregarFuncoes(usuario.gerencia)
    } else {
      setForm({ name: '', matricula: '', senha: '', role: '', gerencia: '', email: '', telefone: '' })
      setFuncoes([])
    }
  }, [usuario, aberto])

  async function carregarFuncoes(gerencia) {
    if (!gerencia) { setFuncoes([]); return }
    try {
      const dados = await get('funcoes_gerencia', { gerencia, ativo: true })
      setFuncoes(dados.sort((a, b) => a.ordem - b.ordem))
    } catch {
      setFuncoes([])
    }
  }

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleGerenciaChange(gerencia) {
    set('gerencia', gerencia)
    set('role', '')
    await carregarFuncoes(gerencia)
  }

  async function salvar() {
    if (!form.name || !form.matricula || !form.gerencia || !form.role) {
      mostrarToast('Preencha todos os campos obrigatórios', 'erro')
      return
    }
    if (!usuario && !form.senha) {
      mostrarToast('Informe a senha para o novo usuário', 'erro')
      return
    }
    setSalvando(true)
    try {
      await rpc('criar_usuario_seguro', {
        p_id: usuario?.id || `user-${Date.now()}`,
        p_name: form.name,
        p_matricula: form.matricula,
        p_senha: form.senha || '__manter__',
        p_role: form.role,
        p_email: form.email || '',
        p_telefone: form.telefone || '',
        p_endereco: '',
        p_bairros: [],
        p_ativo: true,
        p_gerencia: form.gerencia,
      })
      mostrarToast(usuario ? 'Usuário atualizado!' : 'Usuário criado!', 'sucesso')
      onSalvo()
    } catch (err) {
      console.error(err)
      mostrarToast('Erro ao salvar usuário', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal aberto={aberto} onClose={onClose} titulo={usuario ? 'Editar Usuário' : 'Novo Usuário'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Campo label="Nome completo *">
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome do servidor" />
        </Campo>
        <Campo label="Matrícula *">
          <input value={form.matricula} onChange={e => set('matricula', e.target.value)} placeholder="Ex: 12345" />
        </Campo>

        <GerenciaSelector value={form.gerencia} onChange={handleGerenciaChange} />
        <FuncaoSelector value={form.role} onChange={v => set('role', v)} funcoes={funcoes} />

        <Campo label={usuario ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}>
          <input type="password" value={form.senha} onChange={e => set('senha', e.target.value)} placeholder="••••••••" />
        </Campo>
        <Campo label="E-mail">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
        </Campo>
        <Campo label="Telefone">
          <input value={form.telefone} onChange={e => set('telefone', e.target.value)} />
        </Campo>

        <button onClick={salvar} disabled={salvando} style={{
          background: '#1A56DB', color: '#fff', border: 'none', borderRadius: '10px',
          padding: '14px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px',
        }}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </Modal>
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
