// DocumentoPDF.jsx
// Gera e abre o modelo oficial A4 governamental para impressão/PDF
// Usado para: notificações, autos de infração e defesas

import { INFO_MODULO } from '../gerencia/GerenciaUI.jsx'
import { mascaraMatricula, mascaraCPF } from '../components/MascaraInput.jsx'

const BRASAO_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

// ============================================================
// Função principal — abre janela de impressão com documento A4
// ============================================================

export function imprimirDocumentoOficial(registro) {
  const html = gerarHTML(registro)
  const win  = window.open('', '_blank', 'width=900,height=700')
  win.document.write(html)
  win.document.close()
  setTimeout(() => { win.focus(); win.print() }, 800)
}

export function imprimirDefesaOficial(defesa, registro) {
  const html = gerarHTMLDefesa(defesa, registro)
  const win  = window.open('', '_blank', 'width=900,height=700')
  win.document.write(html)
  win.document.close()
  setTimeout(() => { win.focus(); win.print() }, 800)
}

// ============================================================
// HTML do documento oficial (notificação / auto)
// ============================================================

function gerarHTML(r) {
  const info       = INFO_MODULO[r.gerencia] || INFO_MODULO.obras
  const ehAuto     = r.type === 'auto'
  const tipoNome   = ehAuto ? 'AUTO DE INFRAÇÃO' : 'NOTIFICAÇÃO PRELIMINAR'
  const matFmt     = mascaraMatricula(r.matricula || '')
  const cpfFmt     = r.cpf ? mascaraCPF(r.cpf) : ''
  const qrUrl      = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(`https://fiscon.pmvc.ba.gov.br/portal?codigo=${r.codigo_acesso}`)}`

  const infracoesHtml = (r.infracoes || []).map((inf, i) => `
    <tr style="background: ${i % 2 === 0 ? '#fff' : '#f8fafc'}">
      <td style="padding:6px 10px; font-size:11px; color:#374151; border-bottom:1px solid #e2e8f0;">
        ${inf.codigo ? `<strong>Art. ${inf.codigo}</strong> — ` : ''}${inf.descricao}
        ${inf.penalidade ? `<br/><span style="color:#64748b;font-size:10px;">${inf.penalidade}</span>` : ''}
      </td>
      ${ehAuto ? `<td style="padding:6px 10px; text-align:right; font-size:11px; font-weight:700; color:#B91C1C; border-bottom:1px solid #e2e8f0; white-space:nowrap;">
        ${inf.valor > 0 ? `R$ ${Number(inf.valor).toFixed(2).replace('.', ',')}` : '—'}
      </td>` : ''}
    </tr>
  `).join('')

  const fotosHtml = (r.foto_urls || []).length > 0 ? `
    <div style="margin-top:20px; page-break-inside:avoid;">
      <div style="font-size:11px; font-weight:700; color:#1E293B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
        Registro Fotográfico
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        ${(r.foto_urls || []).map(url => `
          <img src="${url}" style="width:150px; height:100px; object-fit:cover; border-radius:6px; border:1px solid #e2e8f0;" />
        `).join('')}
      </div>
    </div>
  ` : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>${tipoNome} — ${r.num}</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Barlow', sans-serif;
      font-size: 12px;
      color: #1E293B;
      background: #fff;
      padding: 0;
    }
    .pagina {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 15mm 18mm 20mm;
      position: relative;
      background: #fff;
    }
    /* Marca d'água brasão */
    .pagina::before {
      content: '';
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 180mm;
      height: 180mm;
      background-image: url('${BRASAO_URL}');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      opacity: 0.04;
      pointer-events: none;
      z-index: 0;
    }
    .conteudo { position: relative; z-index: 1; }

    /* Cabeçalho */
    .cabecalho {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 12px;
      border-bottom: 3px solid #1A56DB;
      margin-bottom: 16px;
    }
    .brasao { width: 64px; height: 64px; flex-shrink: 0; }
    .cab-texto { flex: 1; }
    .cab-prefeitura { font-size: 10px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
    .cab-secretaria { font-size: 13px; font-weight: 700; color: #1E293B; margin: 2px 0; }
    .cab-gerencia { font-size: 11px; color: #475569; }
    .cab-lei { font-size: 10px; color: #94A3B8; margin-top: 2px; }

    /* Título do documento */
    .titulo-doc {
      text-align: center;
      margin-bottom: 16px;
      padding: 12px;
      background: linear-gradient(135deg, #1A56DB 0%, #1244A8 100%);
      border-radius: 8px;
    }
    .titulo-doc h1 {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 20px;
      color: #fff;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .titulo-doc .num {
      font-size: 14px;
      color: rgba(255,255,255,0.9);
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .titulo-doc .data-doc {
      font-size: 11px;
      color: rgba(255,255,255,0.75);
      margin-top: 2px;
    }

    /* Seções */
    .secao {
      margin-bottom: 14px;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      overflow: hidden;
    }
    .secao-titulo {
      background: #F8FAFC;
      padding: 6px 12px;
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid #E2E8F0;
    }
    .secao-corpo { padding: 10px 12px; }
    .campo { margin-bottom: 6px; display: flex; gap: 8px; }
    .campo-label { font-size: 10px; color: #94A3B8; min-width: 100px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.04em; }
    .campo-valor { font-size: 12px; color: #1E293B; font-weight: 500; flex: 1; }

    /* Tabela de infrações */
    .tabela-infracoes {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .tabela-infracoes th {
      background: #F1F5F9;
      padding: 6px 10px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #E2E8F0;
    }

    /* Multa total */
    .multa-total {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      border-radius: 6px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
    .multa-label { font-size: 11px; font-weight: 700; color: #B91C1C; text-transform: uppercase; }
    .multa-valor { font-size: 18px; font-weight: 700; color: #B91C1C; }

    /* Prazo */
    .prazo-box {
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      border-radius: 6px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .prazo-label { font-size: 11px; color: #B45309; font-weight: 600; }
    .prazo-data { font-size: 15px; font-weight: 700; color: #B45309; }

    /* Assinatura */
    .assinaturas {
      display: flex;
      gap: 20px;
      margin-top: 24px;
      margin-bottom: 20px;
    }
    .assinatura-box {
      flex: 1;
      border-top: 1px solid #1E293B;
      padding-top: 6px;
      text-align: center;
    }
    .assinatura-nome { font-size: 11px; font-weight: 600; }
    .assinatura-cargo { font-size: 10px; color: #64748B; }

    /* QR Code rodapé */
    .rodape-portal {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      margin-top: 16px;
    }
    .rodape-portal img { width: 70px; height: 70px; flex-shrink: 0; }
    .rodape-texto { flex: 1; }
    .rodape-titulo { font-size: 11px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
    .rodape-sub { font-size: 10px; color: #64748B; line-height: 1.5; }
    .codigo-acesso {
      font-size: 16px;
      font-weight: 700;
      color: #1A56DB;
      letter-spacing: 0.15em;
      font-family: monospace;
    }

    /* Rodapé legal */
    .rodape-legal {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #E2E8F0;
      font-size: 9px;
      color: #94A3B8;
      text-align: center;
      line-height: 1.6;
    }

    @media print {
      body { background: #fff; }
      @page { size: A4; margin: 0; }
      .pagina { margin: 0; padding: 12mm 18mm 18mm; }
    }
  </style>
</head>
<body>
<div class="pagina">
<div class="conteudo">

  <!-- Cabeçalho -->
  <div class="cabecalho">
    <img class="brasao" src="${BRASAO_URL}" alt="Brasão PMVC"/>
    <div class="cab-texto">
      <div class="cab-prefeitura">Prefeitura Municipal de Vitória da Conquista — Estado da Bahia</div>
      <div class="cab-secretaria">${info.secretaria}</div>
      <div class="cab-gerencia">${info.gerencia}</div>
      <div class="cab-lei">${r.gerencia === 'obras' ? 'Lei Municipal nº 1.481/2007 — Código de Obras e Edificações' : 'Lei Municipal nº 695/1993 — Código de Polícia Administrativa'}</div>
    </div>
  </div>

  <!-- Título -->
  <div class="titulo-doc">
    <h1>${tipoNome}</h1>
    <div class="num">Nº ${r.num}</div>
    <div class="data-doc">Vitória da Conquista, ${r.date}</div>
  </div>

  <!-- Prazo -->
  ${r.prazo ? `
  <div class="prazo-box">
    <span class="prazo-label">⏰ Prazo para regularização${ehAuto ? ' (prazo legal de 10 dias corridos)' : ''}:</span>
    <span class="prazo-data">${r.prazo}</span>
  </div>
  ` : ''}

  <!-- Dados do notificado -->
  <div class="secao">
    <div class="secao-titulo">${ehAuto ? 'Dados do Autuado' : 'Dados do Notificado'}</div>
    <div class="secao-corpo">
      <div class="campo">
        <span class="campo-label">Nome</span>
        <span class="campo-valor"><strong>${r.owner || '—'}</strong></span>
      </div>
      ${cpfFmt ? `<div class="campo"><span class="campo-label">CPF / CNPJ</span><span class="campo-valor">${cpfFmt}</span></div>` : ''}
      <div class="campo">
        <span class="campo-label">Endereço</span>
        <span class="campo-valor">${r.addr || '—'}${r.bairro ? `, ${r.bairro}` : ''}${r.loteamento ? ` — ${r.loteamento}` : ''}</span>
      </div>
    </div>
  </div>

  <!-- Infrações -->
  <div class="secao">
    <div class="secao-titulo">Infrações Constatadas</div>
    <div class="secao-corpo" style="padding:0;">
      <table class="tabela-infracoes">
        <thead>
          <tr>
            <th>Descrição da Infração</th>
            ${ehAuto ? '<th style="text-align:right; white-space:nowrap;">Multa (R$)</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${infracoesHtml}
        </tbody>
      </table>
    </div>
  </div>

  ${ehAuto && r.multa && Number(r.multa) > 0 ? `
  <div class="multa-total">
    <span class="multa-label">Valor Total da Multa</span>
    <span class="multa-valor">R$ ${Number(r.multa).toFixed(2).replace('.', ',')}</span>
  </div>
  ` : ''}

  <!-- Descrição -->
  ${r.descricao ? `
  <div class="secao" style="margin-top:14px;">
    <div class="secao-titulo">Descrição das Irregularidades</div>
    <div class="secao-corpo">
      <p style="font-size:12px; color:#374151; line-height:1.6;">${r.descricao}</p>
    </div>
  </div>
  ` : ''}

  <!-- Testemunhas (auto) -->
  ${ehAuto && (r.testemunha1 || r.testemunha2) ? `
  <div class="secao">
    <div class="secao-titulo">Testemunhas</div>
    <div class="secao-corpo">
      ${r.testemunha1 ? `<div class="campo"><span class="campo-label">Testemunha 1</span><span class="campo-valor">${r.testemunha1}</span></div>` : ''}
      ${r.testemunha2 ? `<div class="campo"><span class="campo-label">Testemunha 2</span><span class="campo-valor">${r.testemunha2}</span></div>` : ''}
      ${r.obs_recusa  ? `<div class="campo"><span class="campo-label">Obs. recusa</span><span class="campo-valor">${r.obs_recusa}</span></div>` : ''}
    </div>
  </div>
  ` : ''}

  <!-- Fotos -->
  ${fotosHtml}

  <!-- Assinaturas -->
  <div class="assinaturas">
    <div class="assinatura-box">
      <div class="assinatura-nome">${r.fiscal || '—'}</div>
      <div class="assinatura-cargo">Fiscal Municipal — Mat. ${matFmt}</div>
    </div>
    <div class="assinatura-box">
      <div class="assinatura-nome">&nbsp;</div>
      <div class="assinatura-cargo">${ehAuto ? 'Assinatura do Autuado' : 'Assinatura do Notificado'}</div>
    </div>
  </div>

  <!-- Portal do Cidadão / QR Code -->
  <div class="rodape-portal">
    <img src="${qrUrl}" alt="QR Code Portal"/>
    <div class="rodape-texto">
      <div class="rodape-titulo">Portal do Cidadão — Acesse seu documento online</div>
      <div class="rodape-sub">
        Escaneie o QR Code ou acesse <strong>fiscon.pmvc.ba.gov.br/portal</strong><br/>
        e digite o código de acesso abaixo para consultar este documento,<br/>
        acompanhar o status e enviar sua defesa.
      </div>
      <div class="codigo-acesso" style="margin-top:6px;">${r.codigo_acesso || '—'}</div>
    </div>
  </div>

  <!-- Rodapé legal -->
  <div class="rodape-legal">
    Prefeitura Municipal de Vitória da Conquista — CNPJ: 14.105.183/0001-99 — Praça Teopompo de Almeida, s/n, Centro — CEP 45.010-971 — Vitória da Conquista — BA<br/>
    ${r.gerencia === 'obras'
      ? 'Documento emitido com fundamento na Lei Municipal nº 1.481/2007 (Código de Obras e Edificações de Vitória da Conquista).'
      : 'Documento emitido com fundamento na Lei Municipal nº 695/1993 (Código de Polícia Administrativa de Vitória da Conquista).'
    }<br/>
    O não cumprimento desta notificação no prazo estipulado poderá resultar em autuação e aplicação das penalidades previstas em lei.
  </div>

</div>
</div>
</body></html>`
}

// ============================================================
// HTML da defesa oficial
// ============================================================

function gerarHTMLDefesa(defesa, registro) {
  const info   = INFO_MODULO[registro?.gerencia] || INFO_MODULO.obras
  const tipoReg = registro?.type === 'auto' ? 'Auto de Infração' : 'Notificação Preliminar'

  const anexosHtml = (defesa.anexos || []).length > 0 ? `
    <div style="margin-top:16px;">
      <div style="font-size:10px; font-weight:700; color:#475569; text-transform:uppercase; margin-bottom:8px;">Documentos Anexados</div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        ${(defesa.anexos || []).map((url, i) => `
          <img src="${url}" style="width:120px; height:80px; object-fit:cover; border-radius:6px; border:1px solid #e2e8f0;"/>
        `).join('')}
      </div>
    </div>
  ` : ''

  const statusHtml = defesa.status !== 'pendente' ? `
    <div style="margin-top:20px; padding:14px; background:${defesa.status === 'deferida' ? '#F0FDF4' : '#FEE2E2'}; border:1px solid ${defesa.status === 'deferida' ? '#BBF7D0' : '#FECACA'}; border-radius:8px;">
      <div style="font-size:11px; font-weight:700; color:${defesa.status === 'deferida' ? '#166534' : '#B91C1C'}; margin-bottom:6px;">
        DEFESA ${defesa.status === 'deferida' ? 'DEFERIDA ✅' : 'INDEFERIDA ❌'}
      </div>
      <div style="font-size:10px; color:#64748B; margin-bottom:4px;">
        Julgado por ${defesa.julgado_por} em ${defesa.julgado_em}
      </div>
      <div style="font-size:12px; color:#374151;">${defesa.parecer || ''}</div>
    </div>
  ` : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Defesa — ${defesa.record_num}</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Barlow', sans-serif; font-size: 12px; color: #1E293B; background: #fff; }
    .pagina { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 15mm 18mm 20mm; position: relative; }
    .pagina::before {
      content: ''; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 160mm; height: 160mm;
      background-image: url('${BRASAO_URL}'); background-repeat: no-repeat;
      background-size: contain; background-position: center; opacity: 0.04; pointer-events: none; z-index: 0;
    }
    .conteudo { position: relative; z-index: 1; }
    .cabecalho { display: flex; align-items: center; gap: 16px; padding-bottom: 12px; border-bottom: 3px solid #1A56DB; margin-bottom: 16px; }
    .brasao { width: 60px; height: 60px; }
    @media print { @page { size: A4; margin: 0; } body { background: #fff; } }
  </style>
</head>
<body>
<div class="pagina">
<div class="conteudo">

  <div class="cabecalho">
    <img class="brasao" src="${BRASAO_URL}" alt="Brasão"/>
    <div>
      <div style="font-size:10px; color:#64748B; text-transform:uppercase; letter-spacing:0.05em;">Prefeitura Municipal de Vitória da Conquista — BA</div>
      <div style="font-size:13px; font-weight:700; margin:2px 0;">${info.secretaria}</div>
      <div style="font-size:11px; color:#475569;">${info.gerencia}</div>
    </div>
  </div>

  <div style="text-align:center; margin-bottom:20px; padding:12px; background:linear-gradient(135deg,#1A56DB,#1244A8); border-radius:8px;">
    <h1 style="font-family:'Barlow Condensed',sans-serif; font-size:20px; color:#fff; letter-spacing:0.1em;">DEFESA ADMINISTRATIVA</h1>
    <div style="font-size:13px; color:rgba(255,255,255,.9); font-weight:600; margin-top:4px;">Ref.: ${tipoReg} Nº ${defesa.record_num}</div>
    <div style="font-size:11px; color:rgba(255,255,255,.75); margin-top:2px;">
      ${new Date(defesa.created_at).toLocaleDateString('pt-BR')}
    </div>
  </div>

  <div style="border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; margin-bottom:16px;">
    <div style="background:#F8FAFC; padding:6px 12px; font-size:10px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #E2E8F0;">Dados do Defensor</div>
    <div style="padding:10px 12px;">
      <div style="display:flex; gap:8px; margin-bottom:6px;">
        <span style="font-size:10px; color:#94A3B8; min-width:80px; text-transform:uppercase;">Nome</span>
        <span style="font-size:12px; font-weight:600;">${defesa.nome}</span>
      </div>
      ${defesa.cpf ? `<div style="display:flex; gap:8px;">
        <span style="font-size:10px; color:#94A3B8; min-width:80px; text-transform:uppercase;">CPF</span>
        <span style="font-size:12px;">${defesa.cpf}</span>
      </div>` : ''}
    </div>
  </div>

  <div style="border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; margin-bottom:16px;">
    <div style="background:#F8FAFC; padding:6px 12px; font-size:10px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #E2E8F0;">Texto da Defesa</div>
    <div style="padding:14px 12px; font-size:12px; color:#374151; line-height:1.8; white-space:pre-wrap;">${defesa.texto}</div>
  </div>

  ${anexosHtml}
  ${statusHtml}

  <div style="margin-top:32px; display:flex; gap:20px;">
    <div style="flex:1; border-top:1px solid #1E293B; padding-top:6px; text-align:center;">
      <div style="font-size:11px; font-weight:600;">${defesa.nome}</div>
      <div style="font-size:10px; color:#64748B;">Assinatura do Defensor</div>
    </div>
    <div style="flex:1; border-top:1px solid #1E293B; padding-top:6px; text-align:center;">
      <div style="font-size:11px;">&nbsp;</div>
      <div style="font-size:10px; color:#64748B;">Recebido por / Data</div>
    </div>
  </div>

  <div style="margin-top:20px; padding-top:8px; border-top:1px solid #E2E8F0; font-size:9px; color:#94A3B8; text-align:center; line-height:1.6;">
    Prefeitura Municipal de Vitória da Conquista — Protocolo de Defesa Administrativa<br/>
    Este documento foi gerado pelo sistema FISCON e tem validade jurídica conforme legislação municipal vigente.
  </div>

</div>
</div>
</body></html>`
}
