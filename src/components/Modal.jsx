import React, { useEffect } from 'react'

// Modal bottom-sheet (mobile) / centralizado (desktop)
// Uso: <Modal aberto={true} onClose={() => {}} titulo="Título"> conteúdo </Modal>

export default function Modal({ aberto, onClose, titulo, children, largura = '560px' }) {
  // Fechar com ESC
  useEffect(() => {
    if (!aberto) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [aberto, onClose])

  // Bloquear scroll do body quando aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  if (!aberto) return null

  return (
    <div
      style={estilos.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ ...estilos.box, maxWidth: largura }}>
        {/* Header */}
        {titulo && (
          <div style={estilos.header}>
            <h2 style={estilos.titulo}>{titulo}</h2>
            <button onClick={onClose} style={estilos.botaoFechar}>✕</button>
          </div>
        )}
        {/* Conteúdo */}
        <div style={estilos.conteudo}>
          {children}
        </div>
      </div>
    </div>
  )
}

const estilos = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  box: {
    background: '#fff',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    paddingBottom: '24px',
    '@media (min-width: 900px)': {
      borderRadius: '20px',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: '1px solid #F1F5F9',
    position: 'sticky',
    top: 0,
    background: '#fff',
    zIndex: 1,
  },
  titulo: {
    fontSize: '1.1rem',
    color: '#1E293B',
    margin: 0,
  },
  botaoFechar: {
    background: '#F1F5F9',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#475569',
    padding: 0,
  },
  conteudo: {
    padding: '20px 24px',
  },
}
