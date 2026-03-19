import React, { useRef, useEffect, useState } from 'react'
import { INFO_MODULO } from '../../gerencia/GerenciaUI.jsx'
import { getGerencia, nomePerfil } from '../../gerencia/gerencia.js'
import { mascaraMatricula, mascaraCPF } from '../../components/MascaraInput.jsx'
import { getOne } from '../../config/supabase.js'

// Dimensões: cartão vertical padrão celular = 54mm × 85.6mm
// Em px (96dpi × 2 para qualidade): 204 × 324px display

export default function Credencial({ usuario: usuarioInicial, onFechar }) {
  const cardRef = useRef()
  const [usuario, setUsuario] = useState(usuarioInicial)

  useEffect(() => {
    async function recarregar() {
      try {
        const dados = await getOne('usuarios', usuarioInicial.id)
        if (dados) setUsuario(dados)
      } catch { /* usa o que tem */ }
    }
    recarregar()
  }, [usuarioInicial.id])

  const g    = getGerencia(usuario.gerencia)
  const info = INFO_MODULO[usuario.gerencia] || INFO_MODULO.obras
  const mat  = mascaraMatricula(usuario.matricula || '')
  const cpf  = mascaraCPF(usuario.endereco || '') // CPF salvo em endereco

  function imprimir() {
    const html = cardRef.current.outerHTML
    const win  = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html><html><head><title>Crachá — ${usuario.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700&display=swap" rel="stylesheet"/>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Barlow', sans-serif; }
        @media print { body { background: #fff; } @page { size: 54mm 85.6mm; margin: 0; } }
      </style></head><body>${html}</body></html>
    `)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  // Cores do gradiente por gerência
  const gradiente = `linear-gradient(175deg, ${g.cor} 0%, ${g.cor}CC 50%, #0a1a4a 100%)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>

      {/* Card vertical — 204px × 324px (proporção 54×85.6mm) */}
      <div ref={cardRef} style={{
        width: '204px',
        height: '324px',
        background: gradiente,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Barlow', sans-serif",
      }}>

        {/* MARCA D'ÁGUA — brasão preenchendo o fundo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg"
            alt=""
            style={{
              width: '180px',
              height: '180px',
              opacity: 0.08,
              filter: 'brightness(10)',
            }}
          />
        </div>

        {/* Faixa superior decorativa */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.5)', position: 'relative', zIndex: 1 }} />

        {/* Cabeçalho institucional */}
        <div style={{
          padding: '10px 12px 8px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}>
          {/* Brasão pequeno visível */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg"
            alt="Brasão"
            style={{ width: '28px', height: '28px', marginBottom: '4px' }}
          />
          <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.3 }}>
            Prefeitura Municipal de Vitória da Conquista
          </div>
          <div style={{ fontSize: '0.55rem', color: '#fff', fontWeight: '700', lineHeight: 1.3, marginTop: '2px' }}>
            {info.secretaria}
          </div>
          <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>
            {info.gerencia}
          </div>
        </div>

        {/* Foto centralizada */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '12px 0 8px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            width: '72px', height: '72px',
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.85)',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {usuario.foto_perfil
              ? <img src={usuario.foto_perfil} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '2rem' }}>👤</span>
            }
          </div>
        </div>

        {/* Nome e cargo */}
        <div style={{
          textAlign: 'center',
          padding: '0 12px 10px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.95rem', fontWeight: '700',
            color: '#fff', lineHeight: 1.2,
            letterSpacing: '0.02em',
          }}>
            {usuario.name?.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginTop: '3px' }}>
            {usuario.cargo || nomePerfil(usuario)}
          </div>
        </div>

        {/* Linha divisória */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.25)', margin: '0 12px', position: 'relative', zIndex: 1 }} />

        {/* Rodapé — matrícula e CPF */}
        <div style={{
          padding: '8px 12px',
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '6px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Matrícula</div>
              <div style={{ fontSize: '0.72rem', color: '#fff', fontWeight: '700', letterSpacing: '0.08em' }}>{mat}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Perfil</div>
              <div style={{ fontSize: '0.62rem', color: '#fff', fontWeight: '600' }}>{nomePerfil(usuario)}</div>
            </div>
          </div>
          {cpf && (
            <div>
              <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CPF</div>
              <div style={{ fontSize: '0.65rem', color: '#fff', fontWeight: '600', letterSpacing: '0.04em' }}>{cpf}</div>
            </div>
          )}
        </div>

        {/* Faixa inferior */}
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', position: 'relative', zIndex: 1 }} />
      </div>

      {/* Aviso sem foto */}
      {!usuario.foto_perfil && (
        <div style={{ fontSize: '0.75rem', color: '#B45309', background: '#FEF3C7', borderRadius: '8px', padding: '8px 14px', textAlign: 'center', maxWidth: '260px' }}>
          ⚠️ Sem foto cadastrada. Edite o usuário para adicionar.
        </div>
      )}

      {/* Botões */}
      <div style={{ display: 'flex', gap: '10px', width: '204px' }}>
        <button onClick={imprimir} style={{
          flex: 1, background: '#1A56DB', color: '#fff', border: 'none',
          borderRadius: '10px', padding: '11px 8px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer',
        }}>
          🖨️ Imprimir
        </button>
        <button onClick={onFechar} style={{
          flex: 1, background: '#F1F5F9', color: '#475569', border: 'none',
          borderRadius: '10px', padding: '11px 8px', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer',
        }}>
          Fechar
        </button>
      </div>
    </div>
  )
}
