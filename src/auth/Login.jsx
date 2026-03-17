import React, { useState } from 'react'
import { rpc } from '../config/supabase.js'
import { saveSession } from './auth.js'

export default function Login({ onLogin }) {
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    if (!matricula || !senha) {
      setErro('Preencha matrícula e senha.')
      return
    }
    setCarregando(true)
    try {
      const resultado = await rpc('autenticar_usuario', {
        p_matricula: matricula.trim(),
        p_senha: senha,
      })
      if (!resultado || !resultado.success) {
        setErro('Matrícula ou senha incorretos.')
        return
      }
      saveSession(resultado)
      onLogin(resultado)
    } catch (err) {
      setErro('Erro ao conectar. Verifique sua conexão.')
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={estilos.fundo}>
      <div style={estilos.card}>
        {/* Brasão */}
        <div style={estilos.brasaoBox}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg"
            alt="Brasão PMVC"
            style={estilos.brasao}
          />
        </div>

        {/* Títulos */}
        <h1 style={estilos.titulo}>FISCON</h1>
        <p style={estilos.subtitulo}>Fiscalização de Obras e Posturas</p>
        <p style={estilos.municipio}>Prefeitura Municipal de Vitória da Conquista — BA</p>

        {/* Formulário */}
        <form onSubmit={handleLogin} style={estilos.form}>
          <div style={estilos.campo}>
            <label style={estilos.label}>Matrícula</label>
            <input
              type="text"
              value={matricula}
              onChange={e => setMatricula(e.target.value)}
              placeholder="Ex: 12345"
              autoComplete="username"
              style={estilos.input}
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Sua senha"
              autoComplete="current-password"
              style={estilos.input}
            />
          </div>

          {erro && <p style={estilos.erro}>{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            style={estilos.botao}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={estilos.versao}>FISCON v1.0 — 2026</p>
      </div>
    </div>
  )
}

const estilos = {
  fundo: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1A56DB 0%, #0F3A9A 100%)',
    padding: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '36px 28px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  brasaoBox: {
    marginBottom: '12px',
  },
  brasao: {
    width: '72px',
    height: '72px',
  },
  titulo: {
    fontSize: '2.2rem',
    color: '#1A56DB',
    letterSpacing: '0.1em',
    margin: '0',
  },
  subtitulo: {
    fontSize: '0.85rem',
    color: '#475569',
    margin: '4px 0 2px',
    textAlign: 'center',
  },
  municipio: {
    fontSize: '0.75rem',
    color: '#94A3B8',
    margin: '0 0 24px',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '2px solid #CBD5E0',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
  },
  erro: {
    color: '#B91C1C',
    fontSize: '0.85rem',
    textAlign: 'center',
    background: '#FEE2E2',
    padding: '10px',
    borderRadius: '8px',
  },
  botao: {
    background: '#1A56DB',
    color: '#fff',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '4px',
  },
  versao: {
    marginTop: '24px',
    fontSize: '0.7rem',
    color: '#CBD5E0',
  },
}
