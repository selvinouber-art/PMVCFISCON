import React from 'react'
import { GerenciaBadge } from '../gerencia/GerenciaUI.jsx'
import Icon from './Icon.jsx'

// TopBar — barra superior do sistema
// Exibe brasão, título FISCON, breadcrumb, info do usuário e badge de gerência

export default function TopBar({ usuario, titulo = 'FISCON', onPerfil, onLogout }) {
  return (
    <div style={estilos.bar}>
      {/* Lado esquerdo: brasão + título */}
      <div style={estilos.esquerda}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg"
          alt="Brasão"
          style={estilos.brasao}
        />
        <div>
          <span style={estilos.titulo}>{titulo}</span>
          <span style={estilos.subtitulo}>PMVC</span>
        </div>
      </div>

      {/* Lado direito: usuário + badge */}
      <div style={estilos.direita}>
        {usuario && (
          <>
            <div style={estilos.usuarioInfo} onClick={onPerfil}>
              <span style={estilos.nomeUsuario}>{usuario.name?.split(' ')[0]}</span>
              <GerenciaBadge gerencia={usuario.gerencia} />
            </div>
            <button onClick={onLogout} style={estilos.botaoLogout} title="Sair">
              <Icon name="logout" size={18} color="#64748B" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const estilos = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: '#fff',
    borderBottom: '2px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  esquerda: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brasao: {
    width: '32px',
    height: '32px',
  },
  titulo: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: '700',
    fontSize: '1.3rem',
    color: '#1A56DB',
    display: 'block',
    lineHeight: 1,
  },
  subtitulo: {
    fontSize: '0.65rem',
    color: '#94A3B8',
    display: 'block',
    lineHeight: 1,
  },
  direita: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  usuarioInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '3px',
    cursor: 'pointer',
  },
  nomeUsuario: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#374151',
  },
  botaoLogout: {
    background: '#F1F5F9',
    border: 'none',
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
