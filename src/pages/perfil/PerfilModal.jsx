import React, { useState } from 'react'
import { rpc } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import { getGerencia } from '../../gerencia/gerencia.js'

export default function PerfilModal({ usuario, mostrarToast, setPagina }) {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [salvando, setSalvando] = useState(false)

  const g = getGerencia(usuario.gerencia)
  const ROLES = { fiscal: 'Fiscal', atendente: 'Balcão', admin: 'Gerência' }

  async function alterarSenha() {
    if (!senhaAtual || !novaSenha) {
      mostrarToast('Preencha todos os campos', 'erro')
      return
    }
    if (novaSenha !== confirmaSenha) {
      mostrarToast('As senhas não conferem', 'erro')
      return
    }
    if (novaSenha.length < 6) {
      mostrarToast('A nova senha deve ter pelo menos 6 caracteres', 'erro')
      return
    }
    setSalvando(true)
    try {
      const resultado = await rpc('alterar_senha', {
        p_user_id: usuario.id,
        p_senha_atual: senhaAtual,
        p_nova_senha: novaSenha,
      })
      if (!resultado?.success) {
        mostrarToast('Senha atual incorreta', 'erro')
        return
      }
      mostrarToast('Senha alterada com sucesso!', 'sucesso')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmaSenha('')
    } catch {
      mostrarToast('Erro ao alterar senha', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setPagina('mais')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Meu Perfil</h2>
      </div>

      {/* Info do usuário */}
      <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: g.fundo, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}>
            {g.emoji}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1E293B' }}>{usuario.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{ROLES[usuario.role] || usuario.role}</div>
            <div style={{ fontSize: '0.75rem', color: g.cor, fontWeight: '600', marginTop: '2px' }}>{g.nome}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <InfoRow icone="user" label="Matrícula" valor={usuario.matricula} />
          {usuario.email && <InfoRow icone="eye" label="E-mail" valor={usuario.email} />}
          {usuario.telefone && <InfoRow icone="phone" label="Telefone" valor={usuario.telefone} />}
        </div>
      </div>

      {/* Alterar senha */}
      <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', color: '#1E293B', margin: '0 0 16px' }}>Alterar senha</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Campo label="Senha atual">
            <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" />
          </Campo>
          <Campo label="Nova senha">
            <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
          </Campo>
          <Campo label="Confirmar nova senha">
            <input type="password" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} placeholder="Repita a nova senha" />
          </Campo>
          <button onClick={alterarSenha} disabled={salvando} style={{
            background: '#1A56DB', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '4px',
          }}>
            {salvando ? 'Salvando...' : 'Alterar Senha'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icone, label, valor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
      <Icon name={icone} size={16} color="#94A3B8" />
      <span style={{ color: '#94A3B8', minWidth: '70px' }}>{label}</span>
      <span style={{ color: '#374151', fontWeight: '600' }}>{valor}</span>
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
