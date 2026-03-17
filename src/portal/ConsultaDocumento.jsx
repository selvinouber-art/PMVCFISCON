import React, { useState } from 'react'
import EnviarDefesa from './EnviarDefesa.jsx'
import { statusCores } from '../config/theme.js'

export default function ConsultaDocumento({ registro, onVoltar }) {
  const [verDefesa, setVerDefesa] = useState(false)

  if (verDefesa) {
    return <EnviarDefesa registro={registro} onVoltar={() => setVerDefesa(false)} />
  }

  const sc = statusCores[registro.status] || { fundo: '#F1F5F9', cor: '#6B7280' }
  const ehAuto = registro.type === 'auto'

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={onVoltar} style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: '#64748B' }}>
            ← Voltar
          </button>
          <div>
            <h1 style={{ fontSize: '1.1rem', color: '#1E293B', margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>
              {ehAuto ? 'Auto de Infração' : 'Notificação de Fiscalização'}
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>PMVC — Fiscalização</p>
          </div>
        </div>

        {/* Status */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1A56DB' }}>{registro.num}</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Data: {registro.date}</div>
          </div>
          <span style={{ background: sc.fundo, color: sc.cor, fontSize: '0.78rem', fontWeight: '700', borderRadius: '999px', padding: '5px 14px' }}>
            {registro.status}
          </span>
        </div>

        {/* Dados */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0 0 12px', textTransform: 'uppercase' }}>Dados do Notificado</h3>
          <InfoRow label="Nome" valor={registro.owner} />
          {registro.cpf && <InfoRow label="CPF/CNPJ" valor={registro.cpf} />}
          <InfoRow label="Endereço" valor={registro.addr} />
          {registro.bairro && <InfoRow label="Bairro" valor={registro.bairro} />}
        </div>

        {/* Infrações */}
        {registro.infracoes?.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0 0 12px', textTransform: 'uppercase' }}>Infrações</h3>
            {registro.infracoes.map((inf, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: i < registro.infracoes.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ fontSize: '0.85rem', color: '#1E293B' }}>{inf.descricao}</div>
                {inf.valor > 0 && <div style={{ fontSize: '0.75rem', color: '#B91C1C', fontWeight: '600', marginTop: '2px' }}>R$ {Number(inf.valor).toFixed(2).replace('.', ',')}</div>}
              </div>
            ))}
            {ehAuto && registro.multa && (
              <div style={{ background: '#FEE2E2', borderRadius: '10px', padding: '12px', marginTop: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#B91C1C' }}>Multa Total</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#B91C1C' }}>R$ {Number(registro.multa).toFixed(2).replace('.', ',')}</div>
              </div>
            )}
          </div>
        )}

        {/* Prazo */}
        {registro.prazo && (
          <div style={{ background: '#FEF3C7', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: '600' }}>⏰ Prazo para regularização</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#B45309', marginTop: '4px' }}>{registro.prazo}</div>
          </div>
        )}

        {/* Fiscal */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <InfoRow label="Fiscal responsável" valor={registro.fiscal} />
          {registro.descricao && <InfoRow label="Observações" valor={registro.descricao} />}
        </div>

        {/* Botão de defesa */}
        {(registro.status === 'Pendente' || registro.status === 'Autuado') && (
          <button onClick={() => setVerDefesa(true)} style={{
            width: '100%', background: '#1A56DB', color: '#fff',
            border: 'none', borderRadius: '12px', padding: '16px',
            fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
            marginBottom: '12px',
          }}>
            📝 Enviar Defesa
          </button>
        )}

        <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center' }}>
          Prefeitura Municipal de Vitória da Conquista — BA
        </p>
      </div>
    </div>
  )
}

function InfoRow({ label, valor }) {
  if (!valor) return null
  return (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ fontSize: '0.88rem', color: '#374151', marginTop: '2px' }}>{valor}</div>
    </div>
  )
}
