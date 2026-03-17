import React, { useRef, useEffect, useState } from 'react'

// Canvas para assinatura digital (touch + mouse)
// Uso: <SigCanvas onChange={base64 => setSig(base64)} />

export default function SigCanvas({ onChange, height = 150 }) {
  const canvasRef = useRef()
  const [desenhando, setDesenhando] = useState(false)
  const [vazio, setVazio] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#1E293B'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches?.[0] || e
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function iniciar(e) {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setDesenhando(true)
    setVazio(false)
  }

  function desenhar(e) {
    if (!desenhando) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  function parar(e) {
    if (!desenhando) return
    e.preventDefault()
    setDesenhando(false)
    const canvas = canvasRef.current
    onChange(canvas.toDataURL('image/png'))
  }

  function limpar() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setVazio(true)
    onChange(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Assinatura do Notificado</label>
        {!vazio && (
          <button onClick={limpar} style={{
            background: 'none',
            border: 'none',
            color: '#B91C1C',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '2px 8px',
          }}>
            Limpar
          </button>
        )}
      </div>
      <div style={{
        border: '2px solid #CBD5E0',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#fff',
        position: 'relative',
      }}>
        {vazio && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E0',
            fontSize: '0.82rem',
            pointerEvents: 'none',
          }}>
            Assine aqui
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={800}
          height={height * 2}
          style={{ width: '100%', height: `${height}px`, display: 'block', touchAction: 'none' }}
          onMouseDown={iniciar}
          onMouseMove={desenhar}
          onMouseUp={parar}
          onMouseLeave={parar}
          onTouchStart={iniciar}
          onTouchMove={desenhar}
          onTouchEnd={parar}
        />
      </div>
      <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0 }}>
        Peça para o notificado assinar com o dedo ou mouse
      </p>
    </div>
  )
}
