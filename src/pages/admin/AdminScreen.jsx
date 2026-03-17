import React, { useState, useEffect } from 'react'
import { get, rpc, update } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import Modal from '../../components/Modal.jsx'
import UserFormModal from './UserFormModal.jsx'
import { GerenciaBadge } from '../../gerencia/GerenciaUI.jsx'

export default function AdminScreen({ usuario, mostrarToast }) {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modalNovo, setModalNovo] = useState(false)
  const [editando, setEditando] = useState(null)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const dados = await get('usuarios')
      setUsuarios(dados.sort((a, b) => a.name.localeCompare(b.name)))
    } catch {
      mostrarToast('Erro ao carregar usuários', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function toggleAtivo(user) {
    try {
      await update('usuarios', user.id, { ativo: !user.ativo })
      mostrarToast(`Usuário ${user.ativo ? 'desativado' : 'ativado'}`, 'sucesso')
      carregar()
    } catch {
      mostrarToast('Erro ao atualizar usuário', 'erro')
    }
  }

  const ROLES = { fiscal: 'Fiscal', atendente: 'Balcão', admin: 'Gerência' }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Usuários</h2>
        <button onClick={() => setModalNovo(true)} style={{
          background: '#1A56DB', color: '#fff', border: 'none', borderRadius: '10px',
          padding: '8px 14px', fontSize: '0.85rem', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
        }}>
          <Icon name="plus" size={16} color="#fff" />
          Novo
        </button>
      </div>

      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {usuarios.map(u => (
            <div key={u.id} style={{
              background: u.ativo ? '#fff' : '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '14px',
              padding: '14px',
              opacity: u.ativo ? 1 : 0.6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                    Mat. {u.matricula} • {ROLES[u.role] || u.role}
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <GerenciaBadge gerencia={u.gerencia} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => setEditando(u)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                    <Icon name="edit" size={16} color="#475569" />
                  </button>
                  <button onClick={() => toggleAtivo(u)} style={{
                    background: u.ativo ? '#FEE2E2' : '#F0FDF4',
                    border: 'none', borderRadius: '8px', padding: '6px 10px',
                    fontSize: '0.72rem', fontWeight: '700',
                    color: u.ativo ? '#B91C1C' : '#166534', cursor: 'pointer',
                  }}>
                    {u.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UserFormModal
        aberto={modalNovo || !!editando}
        onClose={() => { setModalNovo(false); setEditando(null) }}
        usuario={editando}
        onSalvo={() => { setModalNovo(false); setEditando(null); carregar() }}
        mostrarToast={mostrarToast}
      />
    </div>
  )
}
