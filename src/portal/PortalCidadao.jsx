import React, { useState } from 'react'
import { query } from '../config/supabase.js'
import ConsultaDocumento from './ConsultaDocumento.jsx'

export default function PortalCidadao() {
  const [codigo, setCodigo] = useState('')
  const [registro, setRegistro] = useState(null)
  const [erro, setErro] = useState('')
  const [buscando, setBuscando] = useState(false)

  async function buscar() {
    const cod = codigo.trim().toLowerCase()
    if (cod.length !== 8) {
      setErro('O código deve ter exatamente 8 caracteres.')
      return
    }
    setBuscando(true)
    setErro('')
    try {
      const dados = await query('records', q => q.eq('codigo_acesso', cod).limit(1))
      if (!dados || dados.length === 0) {
        setErro('Código não encontrado. Verifique e tente novamente.')
        return
      }
      setRegistro(dados[0])
    } catch {
      setErro('Erro ao consultar. Tente novamente.')
    } finally {
      setBuscando(false)
    }
  }

  if (registro) {
    return <ConsultaDocumento registro={registro} onVoltar={() => setRegistro(null)} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A56DB 0%, #0F3A9A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '36px 28px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg"
            alt="Brasão PMVC"
            style={{ width: '64px', height: '64px', marginBottom: '12px' }}
          />
          <h1 style={{ fontSize: '1.5rem', color: '#1A56DB', margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif" }}>
            Portal do Cidadão
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Prefeitura Municipal de Vitória da Conquista
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '4px 0 0' }}>
            Fiscalização de Obras e Posturas
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.88rem', color: '#374151', marginBottom: '16px', lineHeight: 1.6 }}>
            Digite o <strong>código de acesso</strong> que consta no documento que você recebeu do fiscal.
          </p>
          <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
            Código de acesso (8 caracteres)
          </label>
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8))}
            placeholder="Ex: abcd1234"
            style={{
              fontSize: '1.3rem',
              letterSpacing: '0.3em',
              textAlign: 'center',
              textTransform: 'lowercase',
              fontWeight: '700',
            }}
            onKeyDown={e => e.key === 'Enter' && buscar()}
          />
          {erro && (
            <p style={{ color: '#B91C1C', fontSize: '0.82rem', marginTop: '8px', background: '#FEE2E2', padding: '10px', borderRadius: '8px' }}>
              {erro}
            </p>
          )}
        </div>

        <button
          onClick={buscar}
          disabled={buscando || codigo.length !== 8}
          style={{
            width: '100%',
            background: '#1A56DB',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          {buscando ? 'Consultando...' : 'Consultar'}
        </button>

        <p style={{ fontSize: '0.72rem', color: '#CBD5E0', textAlign: 'center', marginTop: '20px' }}>
          FISCON v1.0 — 2026
        </p>
      </div>
    </div>
  )
}
