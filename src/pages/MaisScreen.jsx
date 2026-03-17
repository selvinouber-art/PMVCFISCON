import React from 'react'
import Icon from '../components/Icon.jsx'
import { isAdmin } from '../gerencia/gerencia.js'

export default function MaisScreen({ usuario, setPagina }) {
  const admin = isAdmin(usuario)

  const itens = [
    { label: 'Defesas Recebidas', icone: 'shield', pagina: 'defesas', sempre: true },
    { label: 'Relatórios', icone: 'chart', pagina: 'relatorios', sempre: true },
    { label: 'Meu Perfil', icone: 'user', pagina: 'perfil', sempre: true },
    { label: 'Usuários', icone: 'users', pagina: 'admin', soAdmin: true },
    { label: 'Configurações', icone: 'settings', pagina: 'config', soAdmin: true },
    { label: 'Auditoria', icone: 'eye', pagina: 'auditoria', soAdmin: true },
  ]

  const itensFiltrados = itens.filter(i => i.sempre || (i.soAdmin && admin))

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '20px' }}>Mais opções</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {itensFiltrados.map(item => (
          <button
            key={item.pagina}
            onClick={() => setPagina(item.pagina)}
            style={{
              background: '#fff',
              border: '2px solid #E2E8F0',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{
              background: '#F1F5F9',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name={item.icone} size={20} color="#475569" />
            </div>
            <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1E293B', flex: 1 }}>
              {item.label}
            </span>
            <Icon name="chevronRight" size={18} color="#CBD5E0" />
          </button>
        ))}
      </div>

      {/* Info do sistema */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>FISCON v1.0 — 2026</div>
        <div style={{ fontSize: '0.7rem', color: '#CBD5E0', marginTop: '4px' }}>
          Prefeitura Municipal de Vitória da Conquista
        </div>
      </div>
    </div>
  )
}
