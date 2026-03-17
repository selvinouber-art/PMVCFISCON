import React, { useEffect } from 'react'

// Toast — notificação temporária
// Uso: <Toast mensagem="Salvo!" tipo="sucesso" onClose={() => setToast(null)} />
// tipo: 'sucesso' | 'erro' | 'alerta'

export default function Toast({ mensagem, tipo = 'sucesso', onClose, duracao = 3000 }) {
  useEffect(() => {
    if (!mensagem) return
    const timer = setTimeout(onClose, duracao)
    return () => clearTimeout(timer)
  }, [mensagem, duracao, onClose])

  if (!mensagem) return null

  const cores = {
    sucesso: '#166534',
    erro: '#B91C1C',
    alerta: '#B45309',
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '88px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: cores[tipo] || '#1E293B',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '999px',
        fontSize: '0.9rem',
        fontWeight: '600',
        zIndex: 9999,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        maxWidth: '90vw',
        textAlign: 'center',
      }}
      onClick={onClose}
    >
      {mensagem}
    </div>
  )
}
