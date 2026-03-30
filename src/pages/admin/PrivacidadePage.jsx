import React from 'react'
import Icon from '../../components/Icon.jsx'

export default function PrivacidadePage({ setPagina }) {
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <button onClick={() => setPagina('mais')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="chevronRight" size={20} color="#64748B" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>Política de Privacidade</h2>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>LGPD — Lei nº 13.709/2018</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' }}>

        <Secao titulo="1. Dados Pessoais Coletados">
          <p>O sistema FISCON coleta os seguintes dados pessoais:</p>
          <ul style={{ marginLeft: '20px', marginTop: '8px', lineHeight: 2 }}>
            <li><strong>Contribuintes (notificados/autuados):</strong> nome completo, CPF/CNPJ, endereço, telefone</li>
            <li><strong>Servidores municipais:</strong> nome completo, matrícula funcional, CPF, cargo, e-mail, telefone, foto</li>
            <li><strong>Acesso ao portal:</strong> data e hora de acesso, código do processo consultado</li>
          </ul>
        </Secao>

        <Secao titulo="2. Finalidade da Coleta">
          <p>Os dados são coletados exclusivamente para fins de fiscalização municipal, incluindo:</p>
          <ul style={{ marginLeft: '20px', marginTop: '8px', lineHeight: 2 }}>
            <li>Emissão e controle de Notificações Preliminares e Autos de Infração</li>
            <li>Tramitação de processos administrativos de defesa</li>
            <li>Geração de relatórios e auditoria interna</li>
            <li>Cumprimento de obrigações legais municipais</li>
          </ul>
        </Secao>

        <Secao titulo="3. Base Legal — LGPD">
          <p>
            O tratamento dos dados pessoais é realizado com fundamento no <strong>Art. 7º, inciso III da Lei nº 13.709/2018 (LGPD)</strong>:
            execução de políticas públicas previstas em leis, regulamentos e contratos pela Administração Pública.
          </p>
          <p style={{ marginTop: '8px' }}>
            Adicionalmente, aplica-se o <strong>Art. 7º, inciso II</strong> (cumprimento de obrigação legal ou regulatória pelo controlador).
          </p>
        </Secao>

        <Secao titulo="4. Quem Tem Acesso aos Dados">
          <ul style={{ marginLeft: '20px', lineHeight: 2 }}>
            <li><strong>Fiscais:</strong> acesso aos registros da sua gerência que eles próprios emitiram</li>
            <li><strong>Balcão / Administração:</strong> acesso aos registros da gerência para atendimento</li>
            <li><strong>Gerência:</strong> acesso completo aos registros e defesas da sua gerência</li>
            <li><strong>Administrador Geral:</strong> acesso completo a todos os módulos</li>
            <li><strong>Cidadão:</strong> acesso apenas ao próprio processo, via código de acesso pessoal</li>
          </ul>
        </Secao>

        <Secao titulo="5. Prazo de Retenção dos Dados">
          <p>
            Os dados são retidos conforme a Tabela de Temporalidade de Documentos do Município de Vitória da Conquista
            e demais normativas municipais aplicáveis. Processos administrativos são mantidos pelo prazo legal
            mínimo de 5 (cinco) anos após o encerramento, conforme legislação arquivística.
          </p>
        </Secao>

        <Secao titulo="6. Direitos do Titular dos Dados">
          <p>Nos termos da LGPD, o titular dos dados tem direito a:</p>
          <ul style={{ marginLeft: '20px', marginTop: '8px', lineHeight: 2 }}>
            <li>Confirmação da existência de tratamento</li>
            <li>Acesso aos dados</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados</li>
            <li>Informação sobre compartilhamento de dados</li>
          </ul>
          <p style={{ marginTop: '8px' }}>
            Para exercer seus direitos, entre em contato pelo canal da Ouvidoria Municipal ou diretamente
            com a Gerência de Fiscalização responsável.
          </p>
        </Secao>

        <Secao titulo="7. Segurança dos Dados">
          <p>
            O sistema utiliza autenticação com senha criptografada (bcrypt), controle de acesso por perfil (RBAC),
            política de segurança em nível de linha (RLS) no banco de dados, e registro de auditoria de todas as
            ações relevantes. O banco de dados é hospedado na plataforma Supabase, com backup automático diário.
          </p>
        </Secao>

        <Secao titulo="8. Encarregado de Dados (DPO)">
          <p>
            O encarregado pelo tratamento de dados pessoais é definido pelo Município de Vitória da Conquista.
            Para contato, acesse a Ouvidoria Municipal em:
            <a href="https://www.pmvc.ba.gov.br/ouvidoria" target="_blank" rel="noreferrer" style={{ color: '#1A56DB', marginLeft: '4px' }}>
              www.pmvc.ba.gov.br/ouvidoria
            </a>
          </p>
        </Secao>

        <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', padding: '14px', fontSize: '0.82rem', color: '#166534' }}>
          <strong>FISCON v1.0</strong> — Sistema de Fiscalização de Obras e Posturas<br/>
          Prefeitura Municipal de Vitória da Conquista — BA<br/>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  )
}

function Secao({ titulo, children }) {
  return (
    <div style={{ background: '#fff', border: '2px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', margin: '0 0 10px' }}>{titulo}</h3>
      <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
