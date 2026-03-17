import React, { useState, useEffect } from 'react'
import { loadSession, clearSession, startActivityTracking } from './auth/auth.js'
import Login from './auth/Login.jsx'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Toast from './components/Toast.jsx'
import { GerenciaHeader } from './gerencia/GerenciaUI.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RegistrosScreen from './pages/registros/RegistrosScreen.jsx'
import ReclamacoesScreen from './pages/reclamacoes/ReclamacoesScreen.jsx'
import PrazosScreen from './pages/registros/PrazosScreen.jsx'
import MaisScreen from './pages/MaisScreen.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [pagina, setPagina] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Verificar sessão salva ao carregar
  useEffect(() => {
    const sessao = loadSession()
    if (sessao) setUsuario(sessao)
    setCarregando(false)
  }, [])

  // Iniciar rastreamento de atividade para renovar sessão
  useEffect(() => {
    if (!usuario) return
    const parar = startActivityTracking()
    return parar
  }, [usuario])

  function mostrarToast(mensagem, tipo = 'sucesso') {
    setToast({ mensagem, tipo })
  }

  function handleLogin(user) {
    setUsuario(user)
    setPagina('dashboard')
  }

  function handleLogout() {
    clearSession()
    setUsuario(null)
    setPagina('dashboard')
  }

  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1A56DB',
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '0.1em' }}>FISCON</div>
          <div style={{ marginTop: '8px', opacity: 0.7 }}>Carregando...</div>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return <Login onLogin={handleLogin} />
  }

  // Props comuns para todas as páginas
  const props = { usuario, mostrarToast, setPagina }

  function renderPagina() {
    switch (pagina) {
      case 'dashboard': return <Dashboard {...props} />
      case 'registros': return <RegistrosScreen {...props} />
      case 'reclamacoes': return <ReclamacoesScreen {...props} />
      case 'prazos': return <PrazosScreen {...props} />
      case 'mais': return <MaisScreen {...props} />
      default: return <Dashboard {...props} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        usuario={usuario}
        onPerfil={() => setPagina('perfil')}
        onLogout={handleLogout}
      />
      <GerenciaHeader gerencia={usuario.gerencia} />

      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {renderPagina()}
      </main>

      <BottomNav
        ativo={pagina}
        onNavegar={setPagina}
      />

      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
