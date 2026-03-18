import React, { useState, useEffect } from 'react'
import { query, update } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'
import UserFormModal from './UserFormModal.jsx'
import { GerenciaBadge } from '../../gerencia/GerenciaUI.jsx'
import { isAdminGeral, nomePerfil } from '../../gerencia/gerencia.js'

export default function AdminScreen({ usuario, mostrarToast }) {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modalNovo, setModalNovo] = useState(false)
  const [editando, setEditando] = useState(null)
  const [filtroGerencia, setFiltroGerencia] = useState(isAdminGeral(usuario) ? '' : usuario.gerencia)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const dados = await query('usuarios', q => {
        let qr = q.order('name')
        // Gerência só vê usuários do próprio módulo
        if (!isAdminGeral(usuario)) qr = qr.eq('gerencia', usuario.gerencia)
        return qr
      })
      setUsuarios(dados)
    } catch {
      mostrarToast('Erro ao carregar usuários', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function toggleAtivo(u) {
    try {
      await update('usuarios', u.id, { ativo: !u.ativo })
      mostrarToast(`Usuário ${u.ativo ? 'desativado' : 'ativado'}`, 'sucesso')
      carregar()
    } catch {
      mostrarToast('Erro ao atualizar', 'erro')
    }
  }

  const filtrados = filtroGerencia
    ? usuarios.filter(u => u.gerencia === filtroGerencia)
    : usuarios

  const CORES_PERFIL = {
    gerencia: '#7E22CE', fiscal: '#1A56DB', balcao: '#166534',
    administracao: '#B45309', admin: '#B45309',
  }

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
          Novo usuário
        </button>
      </div>

      {/* Filtro de gerência — só admin geral vê */}
      {isAdminGeral(usuario) && (
        <select value={filtroGerencia} onChange={e => setFiltroGerencia(e.target.value)} style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
          <option value="">Todas as gerências</option>
          <option value="obras">🏗️ Obras</option>
          <option value="posturas">🏪 Posturas</option>
          <option value="admin_geral">🏛️ Admin Geral</option>
        </select>
      )}

      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '10px' }}>
        {filtrados.length} usuário{filtrados.length !== 1 ? 's' : ''}
      </div>

      {carregando ? (
        <p style={{ color: '#94A3B8', textAlign: 'center', padding: '32px' }}>Carregando...</p>
      ) : filtrados.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E2E8F0', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
          Nenhum usuário encontrado
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtrados.map(u => (
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
                    Mat. {u.matricula}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <GerenciaBadge gerencia={u.gerencia} />
                    <span style={{
                      background: `${CORES_PERFIL[u.role] || '#6B7280'}18`,
                      color: CORES_PERFIL[u.role] || '#6B7280',
                      fontSize: '0.68rem', fontWeight: '700',
                      borderRadius: '999px', padding: '2px 10px',
                      border: `1px solid ${CORES_PERFIL[u.role] || '#6B7280'}33`,
                    }}>
                      {nomePerfil(u)}
                    </span>
                    {!u.ativo && (
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontStyle: 'italic' }}>inativo</span>
                    )}
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
        usuarioEditando={editando}
        usuarioLogado={usuario}
        onSalvo={() => { setModalNovo(false); setEditando(null); carregar() }}
        mostrarToast={mostrarToast}
      />
    </div>
  )
}
