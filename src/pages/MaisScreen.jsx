import React from 'react'
import Icon from '../components/Icon.jsx'
import {
  isAdminGeral, isGerencia, isAdministracao, isFiscal,
  podeVerLogs, podeVerRelatorios, podeCriarUsuarios, podeJulgarDefesas,
} from '../gerencia/gerencia.js'

export default function MaisScreen({ usuario, setPagina }) {
  const itens = [
    {
      label: 'Defesas Recebidas',
      icone: 'shield',
      pagina: 'defesas',
      visivel: true, // todos veem defesas (fiscal vê só as suas)
      desc: 'Ver e julgar defesas dos contribuintes',
    },
    {
      label: 'Relatórios',
      icone: 'chart',
      pagina: 'relatorios',
      visivel: podeVerRelatorios(usuario) || isAdministracao(usuario),
      desc: 'Relatórios por período, fiscal e infração',
      destaque: false,
    },
    {
      label: 'Auditoria / Log',
      icone: 'eye',
      pagina: 'auditoria',
      visivel: podeVerLogs(usuario),
      desc: 'Histórico completo de ações do sistema',
    },
    {
      label: 'Cancelamentos',
      icone: 'x',
      pagina: 'cancelamentos',
      visivel: true,
      desc: 'Solicitações de cancelamento pendentes',
    },
    {
      label: 'Usuários',
      icone: 'users',
      pagina: 'admin',
      visivel: podeCriarUsuarios(usuario),
      desc: 'Criar e gerenciar usuários do sistema',
    },
    {
      label: 'Prazos',
      icone: 'clock',
      pagina: 'prazos',
      visivel: isFiscal(usuario) || isGerencia(usuario) || isAdministracao(usuario) || isAdminGeral(usuario),
      desc: 'Controle de vencimentos de notificações',
    },
    {
      label: 'Backup e Exportação',
      icone: 'settings',
      pagina: 'backup',
      visivel: isAdminGeral(usuario),
      desc: 'Exportar dados e informações de backup',
      cor: '#166534',
      fundo: '#F0FDF4',
    },
    {
      label: 'Política de Privacidade (LGPD)',
      icone: 'shield',
      pagina: 'privacidade',
      visivel: isAdminGeral(usuario) || isGerencia(usuario),
      desc: 'Tratamento de dados pessoais — Lei nº 13.709/2018',
      cor: '#1A56DB',
      fundo: '#EBF5FF',
    },
    {
      label: 'Meu Perfil',
      icone: 'user',
      pagina: 'perfil',
      visivel: true,
      desc: 'Alterar senha, dados pessoais e credencial',
    },
  ].filter(i => i.visivel)

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '20px' }}>Mais opções</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {itens.map(item => (
          <button key={item.pagina} onClick={() => setPagina(item.pagina)} style={{
            background: item.fundo || '#fff',
            border: `2px solid ${item.cor ? item.cor + '33' : '#E2E8F0'}`,
            borderRadius: '14px',
            padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              background: item.fundo ? item.cor + '22' : '#F1F5F9',
              borderRadius: '10px', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name={item.icone} size={20} color={item.cor || '#475569'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.95rem', color: item.cor || '#1E293B' }}>{item.label}</div>
              {item.desc && <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{item.desc}</div>}
            </div>
            <Icon name="chevronRight" size={18} color="#CBD5E0" />
          </button>
        ))}
      </div>
      <div style={{ marginTop: '24px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>FISCON v1.0 — 2026</div>
        <div style={{ fontSize: '0.7rem', color: '#CBD5E0', marginTop: '2px' }}>Prefeitura Municipal de Vitória da Conquista</div>
        <button
          onClick={() => setPagina('privacidade')}
          style={{ background: 'none', border: 'none', color: '#CBD5E0', fontSize: '0.68rem', cursor: 'pointer', marginTop: '4px', textDecoration: 'underline' }}
        >
          Política de Privacidade (LGPD)
        </button>
      </div>
    </div>
  )
}
