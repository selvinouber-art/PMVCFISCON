import React, { useState } from 'react'
import { query } from '../../config/supabase.js'
import Icon from '../../components/Icon.jsx'

export default function BackupPage({ usuario, mostrarToast, setPagina }) {
  const [exportando, setExportando] = useState('')
  const [ultimaExportacao, setUltimaExportacao] = useState(null)

  async function exportarRegistros() {
    setExportando('registros')
    try {
      const dados = await query('records', q => q.order('created_at', { ascending: false }))
      baixarJSON(dados, `fiscon_registros_${dataArquivo()}`)
      setUltimaExportacao(new Date().toLocaleString('pt-BR'))
      mostrarToast(`${dados.length} registros exportados!`, 'sucesso')
    } catch { mostrarToast('Erro ao exportar registros', 'erro') }
    finally { setExportando('') }
  }

  async function exportarLogs() {
    setExportando('logs')
    try {
      const dados = await query('logs', q => q.order('created_at', { ascending: false }))
      baixarJSON(dados, `fiscon_logs_${dataArquivo()}`)
      setUltimaExportacao(new Date().toLocaleString('pt-BR'))
      mostrarToast(`${dados.length} registros de log exportados!`, 'sucesso')
    } catch { mostrarToast('Erro ao exportar logs', 'erro') }
    finally { setExportando('') }
  }

  async function exportarCompleto() {
    setExportando('completo')
    try {
      const [records, logs, reclamacoes, defesas, usuarios] = await Promise.all([
        query('records',     q => q.order('created_at', { ascending: false })),
        query('logs',        q => q.order('created_at', { ascending: false })),
        query('reclamacoes', q => q.order('created_at', { ascending: false })),
        query('defesas',     q => q.order('created_at', { ascending: false })),
        query('usuarios',    q => q.order('name')),
      ])
      const dump = {
        exportado_em: new Date().toISOString(),
        exportado_por: usuario.name,
        sistema: 'FISCON v1.0 — PMVC',
        tabelas: { records, logs, reclamacoes, defesas, usuarios }
      }
      baixarJSON(dump, `fiscon_backup_completo_${dataArquivo()}`)
      setUltimaExportacao(new Date().toLocaleString('pt-BR'))
      mostrarToast('Backup completo exportado!', 'sucesso')
    } catch { mostrarToast('Erro ao exportar backup', 'erro') }
    finally { setExportando('') }
  }

  function baixarJSON(dados, nome) {
    const json = JSON.stringify(dados, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${nome}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  function dataArquivo() {
    return new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <button onClick={() => setPagina('mais')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Backup e Exportação</h2>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>Segurança dos dados do sistema</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' }}>

        {/* Info do Supabase */}
        <div style={{ background: '#EBF5FF', border: '2px solid #BFDBFE', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1A56DB', marginBottom: '8px' }}>🔒 Backups Automáticos — Supabase</div>
          <div style={{ fontSize: '0.82rem', color: '#1A56DB', lineHeight: 1.7 }}>
            Este sistema utiliza o Supabase como banco de dados, que realiza <strong>backups automáticos diários</strong> com retenção de 7 dias (plano Pro) ou point-in-time recovery conforme o plano contratado. Além disso, é recomendado realizar exportações manuais periódicas como medida adicional de segurança.
          </div>
        </div>

        {ultimaExportacao && (
          <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', padding: '12px 16px', fontSize: '0.82rem', color: '#166534' }}>
            ✅ Última exportação manual: <strong>{ultimaExportacao}</strong> por {usuario.name}
          </div>
        )}

        {/* Exportações */}
        <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Exportações Manuais
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <BotaoExport
              icone="📋"
              titulo="Exportar Registros (JSON)"
              desc="Todos os autos de infração e notificações com campos completos"
              onClick={exportarRegistros}
              loading={exportando === 'registros'}
              cor="#1A56DB"
            />
            <BotaoExport
              icone="📝"
              titulo="Exportar Log de Auditoria (JSON)"
              desc="Todas as ações registradas no sistema"
              onClick={exportarLogs}
              loading={exportando === 'logs'}
              cor="#166534"
            />
            <BotaoExport
              icone="🗄️"
              titulo="Backup Completo (JSON)"
              desc="Exporta TODAS as tabelas: registros, logs, reclamações, defesas e usuários"
              onClick={exportarCompleto}
              loading={exportando === 'completo'}
              cor="#B91C1C"
            />
          </div>
        </div>

        {/* Recomendações */}
        <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#B45309', marginBottom: '8px' }}>⚠️ Recomendações de Segurança</div>
          <ul style={{ fontSize: '0.82rem', color: '#B45309', lineHeight: 1.8, marginLeft: '20px' }}>
            <li>Realize exportações manuais semanalmente</li>
            <li>Armazene os arquivos em local seguro (Google Drive, servidor da prefeitura)</li>
            <li>Mantenha ao menos 3 cópias em locais diferentes</li>
            <li>Verifique periodicamente se os arquivos exportados estão íntegros</li>
            <li>Antes de qualquer manutenção ou atualização, faça um backup completo</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

function BotaoExport({ icone, titulo, desc, onClick, loading, cor }) {
  return (
    <button onClick={onClick} disabled={!!loading} style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      background: '#F8FAFC', border: `2px solid ${cor}33`,
      borderRadius: '12px', padding: '14px', cursor: 'pointer',
      textAlign: 'left', width: '100%',
    }}>
      <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icone}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: cor }}>{loading ? 'Exportando...' : titulo}</div>
        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>{desc}</div>
      </div>
      {loading && <div style={{ fontSize: '1.2rem' }}>⏳</div>}
    </button>
  )
}
