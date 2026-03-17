import React, { useRef } from 'react'
import Icon from './Icon.jsx'

// Slot de foto com upload, preview e remoção
// Uso: <PhotoSlot url={url} onUpload={fn} onRemove={fn} label="Foto 1" />

export default function PhotoSlot({ url, onUpload, onRemove, label = 'Foto', disabled = false }) {
  const inputRef = useRef()

  async function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    // Adiciona carimbo via canvas
    const carimbada = await adicionarCarimbo(file)
    onUpload(carimbada, file.name)
    e.target.value = ''
  }

  async function adicionarCarimbo(file) {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        // Marca d'água central
        ctx.save()
        ctx.globalAlpha = 0.12
        ctx.font = `bold ${img.width * 0.08}px Barlow Condensed, sans-serif`
        ctx.fillStyle = '#1A56DB'
        ctx.translate(img.width / 2, img.height / 2)
        ctx.rotate(-30 * Math.PI / 180)
        ctx.textAlign = 'center'
        ctx.fillText('FISCALIZAÇÃO', 0, 0)
        ctx.restore()

        // Faixa inferior
        const faixaH = img.height * 0.12
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(0, img.height - faixaH, img.width, faixaH)

        // Texto da faixa
        const agora = new Date()
        const dataHora = agora.toLocaleString('pt-BR')
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${faixaH * 0.35}px Barlow, sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(`FISCALIZAÇÃO PMVC  •  ${dataHora}`, img.width * 0.02, img.height - faixaH * 0.3)

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          URL.revokeObjectURL(url)
        }, 'image/jpeg', 0.92)
      }
      img.src = url
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      {url ? (
        <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid #CBD5E0' }}>
          <img src={url} alt={label} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
          {!disabled && (
            <button
              onClick={onRemove}
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: 'rgba(185,28,28,0.9)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Icon name="x" size={14} color="#fff" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => !disabled && inputRef.current?.click()}
          disabled={disabled}
          style={{
            border: '2px dashed #CBD5E0',
            borderRadius: '10px',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: '#F8FAFC',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: '#94A3B8',
            fontSize: '0.78rem',
          }}
        >
          <Icon name="camera" size={24} color="#94A3B8" />
          Toque para adicionar foto
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
