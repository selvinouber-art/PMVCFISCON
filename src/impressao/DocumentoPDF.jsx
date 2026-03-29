// ============================================================
// FISCON — Documentos Oficiais A4
// Modelo governamental com header azul, marca d'água CSS,
// tabela de infrações, rodapé institucional
// Baseado no modelo beta aprovado
// ============================================================

import { INFO_MODULO } from '../gerencia/GerenciaUI.jsx'
import { mascaraMatricula, mascaraCPF } from '../components/MascaraInput.jsx'

const BRASAO      = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'
const PORTAL      = 'https://fiscon-portal.pmvc.ba.gov.br'
const ENDERECO    = 'Praça Joaquim Correia, 55, Centro — CEP: 45.040-901 — Vitória da Conquista — BA'
const CNPJ        = 'CNPJ: 14.105.183/0001-99'

// ============================================================
// CSS base — compartilhado entre notificação, auto e defesa
// ============================================================
const CSS_A4 = `
  @page { size: A4; margin: 0; }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0; padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px; color: #111; background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  #page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    position: relative;
    padding-bottom: 14mm;
  }

  /* Marca d'água via background-image — funciona no print */
  #watermark {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 170mm; height: 170mm;
    background-image: url('${BRASAO}');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.055;
    pointer-events: none;
    z-index: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  #content { position: relative; z-index: 1; }

  /* Header */
  #header {
    background: #0d3b7a;
    color: #fff;
    padding: 8mm 18mm 7mm;
    display: flex;
    align-items: center;
    gap: 10mm;
    border-bottom: 3px solid #b45309;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #header img.brasao { width: 22mm; height: auto; flex-shrink: 0; }
  #header .inst { flex: 1; }
  #header .inst h1 { font-size: 12px; font-weight: 800; margin: 0 0 2px; letter-spacing: 0.5px; }
  #header .inst p  { font-size: 9px; margin: 1px 0; opacity: 0.85; }
  #header .num-doc { text-align: right; flex-shrink: 0; }
  #header .num-doc .lbl { font-size: 8px; opacity: 0.7; margin-bottom: 2px; }
  #header .num-doc .val { font-size: 16px; font-weight: 800; letter-spacing: 0.5px; }
  #header .num-doc .dt  { font-size: 8.5px; margin-top: 2px; opacity: 0.8; }

  /* Body */
  #body { padding: 6mm 18mm; }

  /* Título do documento */
  .doc-title {
    background: #0d3b7a; color: #fff;
    text-align: center;
    padding: 5mm 0; margin-bottom: 5mm;
    border-radius: 2px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .doc-title h2 {
    font-size: 14px; font-weight: 800; margin: 0 0 2px;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .doc-title p { font-size: 8.5px; margin: 0; opacity: 0.8; }

  /* Seção título */
  .sec-title {
    font-size: 9px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.5px;
    color: #fff; padding: 3px 6px; margin: 5mm 0 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sec-blue { background: #0d3b7a; }
  .sec-red  { background: #b91c1c; }

  /* Tabela de campos */
  .field-table { width: 100%; border-collapse: collapse; font-size: 10px; }
  .field-table td {
    padding: 3px 6px;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .field-table td.lbl {
    font-weight: 700; color: #6b7280;
    font-size: 9px; width: 120px; white-space: nowrap;
  }

  /* Tabela de infrações */
  .inf-table { width: 100%; border-collapse: collapse; font-size: 10px; margin: 0; }
  .inf-table th {
    padding: 3px 6px; font-size: 9px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.3px;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .inf-table td {
    padding: 4px 6px;
    border-bottom: 1px solid #fed7d7;
    font-size: 10px;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* Boxes de prazo / acesso */
  .boxes { display: flex; gap: 5mm; margin: 5mm 0; }
  .box-prazo {
    flex: 1; border: 1px solid #fcd34d; border-radius: 4px;
    background: #fff7ed; padding: 4mm 6mm; text-align: center;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .box-prazo .tit { font-size: 9px; font-weight: 800; color: #b45309; margin-bottom: 3mm; }
  .box-prazo .val { font-size: 22px; font-weight: 800; color: #111; }
  .box-prazo .sub { font-size: 8.5px; color: #6b7280; margin-top: 2mm; }
  .box-defesa {
    flex: 1; border: 1px solid #93c5fd; border-radius: 4px;
    background: #eff6ff; padding: 4mm 6mm; text-align: center;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .box-defesa .tit { font-size: 9px; font-weight: 800; color: #1a56db; margin-bottom: 2mm; }
  .box-defesa .cod { font-size: 13px; font-weight: 800; color: #111; letter-spacing: 1px; font-family: monospace; }
  .box-defesa .url { font-size: 9px; color: #1a56db; }

  /* Multa total */
  .multa-box {
    background: #fff5f5; border: 2px solid #b91c1c; border-radius: 4px;
    padding: 6px 12px; margin: 4mm 0;
    display: flex; justify-content: space-between; align-items: center;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* QR Code rodapé */
  .qr-block { text-align: center; margin-top: 6px; }
  .qr-block img { border: 2px solid #cbd5e0; border-radius: 4px; display: block; margin: 0 auto 4px; }

  /* Assinaturas */
  .sig-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .sig-table td {
    border: 1px solid #d1d5db; padding: 6px 8px;
    background: #f8fafc; text-align: center;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* Footer */
  #footer {
    background: #0d3b7a; color: #fff;
    padding: 3mm 18mm;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 2px solid #b45309;
    margin-top: 8mm;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  #footer .left  { font-size: 8px; }
  #footer .right { font-size: 8px; text-align: right; }

  /* Botão impressão */
  #btn-print {
    display: block;
    width: calc(100% - 36mm);
    margin: 4mm 18mm 0;
    background: #0d3b7a; color: #fff;
    border: none; border-radius: 6px;
    padding: 10px; font-size: 13px;
    font-weight: 700; cursor: pointer;
    letter-spacing: 0.5px;
  }

  @media print {
    #btn-print { display: none !important; }
    body { background: #fff !important; }
    #page { min-height: auto; }
  }
`

// ============================================================
// Utilitário: abre blob HTML em nova aba
// ============================================================
function abrirBlob(html, titulo = 'Documento') {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const tab  = window.open(url, '_blank')
  if (!tab) alert('Permita pop-ups para este site e tente novamente.')
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

// ============================================================
// Cabeçalho HTML institucional (compartilhado)
// ============================================================
function htmlHeader(numDoc, date, gerencia) {
  const info = INFO_MODULO[gerencia] || INFO_MODULO.obras
  return `
    <div id="header">
      <img class="brasao" src="${BRASAO}" alt="Brasão PMVC"/>
      <div class="inst">
        <h1>Prefeitura Municipal de Vitória da Conquista — Bahia</h1>
        <p>${info.secretaria}</p>
        <p>${info.gerencia} — FISCON</p>
      </div>
      <div class="num-doc">
        <div class="lbl">Nº DO DOCUMENTO</div>
        <div class="val">${numDoc}</div>
        <div class="dt">Emissão: ${date}</div>
      </div>
    </div>
  `
}

// ============================================================
// Rodapé HTML (compartilhado)
// ============================================================
function htmlFooter(numDoc, date) {
  return `
    <div id="footer">
      <div class="left">
        <strong>FISCON — Sistema de Fiscalização | PMVC</strong><br/>
        ${CNPJ} — ${ENDERECO}
      </div>
      <div class="right">
        <strong>${numDoc}</strong><br/>
        Emitido em: ${date} — Documento eletrônico
      </div>
    </div>
  `
}

// ============================================================
// NOTIFICAÇÃO / AUTO DE INFRAÇÃO — A4
// ============================================================
export function imprimirDocumentoOficial(registro) {
  const info   = INFO_MODULO[registro.gerencia] || INFO_MODULO.obras
  const ehAuto = registro.type === 'auto'
  const titulo = ehAuto ? 'AUTO DE INFRAÇÃO' : 'NOTIFICAÇÃO PRELIMINAR'
  const lei    = registro.gerencia === 'obras'
    ? 'Lei Municipal nº 1.481/2007 — Código de Obras e Edificações'
    : 'Lei Municipal nº 695/1993 — Código de Polícia Administrativa'
  const matFmt = mascaraMatricula(registro.matricula || '')
  const cpfFmt = registro.cpf ? mascaraCPF(registro.cpf) : ''
  const hoje   = registro.date || new Date().toLocaleDateString('pt-BR')

  const qrData = `${PORTAL}/?codigo=${encodeURIComponent(registro.codigo_acesso || '')}`
  const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(qrData)}&margin=2`

  // Infrações — zebra
  const infRows = (registro.infracoes || []).map((inf, i) => {
    const bg    = i % 2 === 0 ? '#fff5f5' : '#fffafa'
    const valor = ehAuto && inf.valor > 0
      ? `<td style="text-align:right;font-weight:700;color:#b91c1c;white-space:nowrap">R$ ${Number(inf.valor).toFixed(2).replace('.', ',')}</td>`
      : ehAuto ? `<td style="text-align:right;color:#aaa">—</td>` : ''
    const codigo = inf.codigo ? `<span style="font-weight:700;color:#374151">Art. ${inf.codigo}</span> — ` : ''
    return `<tr style="background:${bg}">
      <td style="font-size:10px;padding:4px 6px;border-bottom:1px solid #fed7d7;">${codigo}${inf.descricao || inf}</td>
      ${valor}
    </tr>`
  }).join('')

  const totalRow = ehAuto && registro.multa && Number(registro.multa) > 0
    ? `<tr style="background:#b91c1c;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        <td style="color:#fff;font-weight:800;font-size:12px;padding:4px 6px;">TOTAL DA PENALIDADE</td>
        <td style="color:#fff;font-weight:800;font-size:12px;text-align:right;padding:4px 6px;">
          R$ ${Number(registro.multa).toFixed(2).replace('.', ',')}
        </td>
       </tr>`
    : ''

  const valorTh = ehAuto
    ? `<th style="text-align:right;color:#b91c1c;padding:3px 6px;background:#fef2f2;">VALOR DA MULTA</th>`
    : ''

  // Assinaturas
  const sigBlock = ehAuto
    ? `<table class="sig-table">
        <tr>
          <td style="width:34%">
            <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:16px;">Agente de Fiscalização</div>
            <div style="border-top:1px solid #9ca3af;padding-top:4px;">
              <div style="font-size:10px;font-weight:700;">${registro.fiscal || '—'}</div>
              <div style="font-size:9px;color:#6b7280;">Mat. ${matFmt}</div>
            </div>
          </td>
          <td style="width:33%">
            <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:16px;">Testemunha 1</div>
            <div style="border-top:1px solid #9ca3af;padding-top:4px;">
              <div style="font-size:10px;font-weight:700;">${registro.testemunha1 || ''}</div>
            </div>
          </td>
          <td style="width:33%">
            <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:16px;">Testemunha 2</div>
            <div style="border-top:1px solid #9ca3af;padding-top:4px;">
              <div style="font-size:10px;font-weight:700;">${registro.testemunha2 || ''}</div>
            </div>
          </td>
        </tr>
       </table>
       ${registro.obs_recusa ? `<div style="background:#fef3c7;border:1px solid #f59e0b;padding:5px 10px;margin:4px 0;border-radius:3px;font-size:10px;"><strong>Obs.:</strong> ${registro.obs_recusa}</div>` : ''}`
    : `<table class="sig-table">
        <tr>
          <td style="width:40%">
            <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:16px;">Agente de Fiscalização</div>
            <div style="border-top:1px solid #9ca3af;padding-top:4px;">
              <div style="font-size:10px;font-weight:700;">${registro.fiscal || '—'}</div>
              <div style="font-size:9px;color:#6b7280;">Mat. ${matFmt}</div>
            </div>
          </td>
          <td style="width:60%"></td>
        </tr>
       </table>`

  // Prazo
  const prazoDias = ehAuto ? '10' : (registro.prazo || '—')

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>${titulo} — ${registro.num}</title>
  <style>${CSS_A4}</style>
</head>
<body>
<div id="page">
  <div id="watermark"></div>
  <div id="content">

    ${htmlHeader(registro.num, hoje, registro.gerencia)}

    <div id="body">
      <div class="doc-title">
        <h2>${titulo}</h2>
        <p>${lei}</p>
      </div>

      <div class="sec-title sec-blue">Identificação do ${ehAuto ? 'Autuado' : 'Notificado'} / Responsável</div>
      <table class="field-table">
        <tr>
          <td class="lbl">Nome / Razão Social</td>
          <td colspan="3"><strong>${registro.owner || '—'}</strong></td>
        </tr>
        <tr>
          <td class="lbl">CPF / CNPJ</td>
          <td style="width:40%">${cpfFmt || registro.cpf || '—'}</td>
          <td class="lbl" style="width:110px;">Data da Emissão</td>
          <td>${hoje}</td>
        </tr>
        <tr>
          <td class="lbl">Endereço da Obra</td>
          <td colspan="3">${registro.addr || '—'}${registro.bairro ? `, ${registro.bairro}` : ''}</td>
        </tr>
        ${registro.loteamento ? `<tr><td class="lbl">Loteamento / Quadra</td><td colspan="3">${registro.loteamento}</td></tr>` : ''}
      </table>

      <div class="sec-title sec-red">Infrações Constatadas — ${lei.split('—')[0].trim()}</div>
      <table class="inf-table">
        <thead style="background:#fef2f2;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
          <tr>
            <th style="text-align:left;color:#b91c1c;padding:3px 6px;">DESCRIÇÃO DA INFRAÇÃO</th>
            ${valorTh}
          </tr>
        </thead>
        <tbody>${infRows}</tbody>
        <tfoot>${totalRow}</tfoot>
      </table>

      ${registro.descricao ? `
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:3px;padding:6px 10px;margin:4mm 0;font-size:10px;">
        <strong>Obs. do Agente:</strong> ${registro.descricao}
      </div>` : ''}

      <div class="boxes">
        <div class="box-prazo">
          <div class="tit">${ehAuto ? 'Prazo para Apresentar Defesa' : 'Prazo para Regularização'}</div>
          <div class="val">${prazoDias} dias</div>
          <div class="sub">${ehAuto ? 'corridos a partir da autuação' : `Vencimento: ${registro.prazo || '—'}`}</div>
        </div>
        ${registro.codigo_acesso ? `
        <div class="box-defesa">
          <div class="tit">Defesa Online — Portal do Cidadão</div>
          <div class="cod">${registro.codigo_acesso}</div>
          <div class="url">${PORTAL.replace('https://', '')}</div>
          <div style="font-size:8px;color:#6b7280;margin-top:1mm;">Apresente sua defesa pelo portal</div>
        </div>` : ''}
      </div>

      <div class="sec-title sec-blue">Assinaturas</div>
      ${sigBlock}

      ${registro.codigo_acesso ? `
      <div class="qr-block" style="margin-top:6mm;">
        <div style="font-size:10px;font-weight:800;color:#0d3b7a;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">
          Acesse o Portal para Enviar sua Defesa
        </div>
        <img src="${qrUrl}" width="110" height="110" alt="QR Code"/>
        <div style="font-size:12px;font-weight:800;letter-spacing:2px;font-family:monospace;">${registro.codigo_acesso}</div>
        <div style="font-size:9px;color:#1a56db;">${PORTAL.replace('https://', '')}</div>
      </div>` : ''}
    </div>

    ${htmlFooter(registro.num, hoje)}

  </div>
</div>
<button id="btn-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
</body>
</html>`

  abrirBlob(html, registro.num)
}

// ============================================================
// DEFESA ADMINISTRATIVA — A4
// ============================================================
export function imprimirDefesaOficial(defesa, registro) {
  const ehAuto   = registro?.type === 'auto'
  const hoje     = new Date().toLocaleDateString('pt-BR')
  const matFmt   = mascaraMatricula(registro?.matricula || '')

  const STATUS = {
    pendente:   { label: 'PENDENTE — AGUARDANDO ANÁLISE', cor: '#B45309', bg: '#FEF3C7', borda: '#FCD34D' },
    deferida:   { label: 'DEFERIDA',                      cor: '#166534', bg: '#D1FAE5', borda: '#6EE7B7' },
    indeferida: { label: 'INDEFERIDA',                    cor: '#B91C1C', bg: '#FEE2E2', borda: '#FECACA' },
  }
  const st = STATUS[defesa.status] || STATUS.pendente

  // Infrações do registro
  const infRows = (registro?.infracoes || []).map((inf, i) => {
    const bg  = i % 2 === 0 ? '#fff5f5' : '#fffafa'
    const desc = typeof inf === 'string' ? inf : (inf.descricao || '')
    return `<tr style="background:${bg}">
      <td style="padding:3px 6px;border-bottom:1px solid #fed7d7;font-size:10px;">${desc}</td>
    </tr>`
  }).join('')

  const multaBloco = ehAuto && registro?.multa && Number(registro.multa) > 0
    ? `<div class="multa-box">
        <span style="font-size:9px;font-weight:800;color:#b91c1c;text-transform:uppercase;">Valor da Penalidade</span>
        <span style="font-size:16px;font-weight:800;color:#b91c1c;">R$ ${Number(registro.multa).toFixed(2).replace('.', ',')}</span>
       </div>`
    : ''

  const decisaoBloco = defesa.status !== 'pendente'
    ? `<div class="sec-title sec-blue" style="margin-top:5mm;">Decisão Administrativa</div>
       <div style="background:${st.bg};border:1px solid ${st.borda};border-radius:3px;padding:8px 12px;margin-top:2mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
         <div style="font-size:9px;font-weight:800;color:${st.cor};text-transform:uppercase;margin-bottom:4px;">
           ${st.label} — Julgado por ${defesa.julgado_por || '—'} em ${defesa.julgado_em || '—'}
         </div>
         <div style="font-size:11px;line-height:1.5;">${(defesa.parecer || '').replace(/\n/g, '<br/>')}</div>
       </div>`
    : `<div class="sec-title sec-blue" style="margin-top:5mm;">Situação da Defesa</div>
       <div style="background:${st.bg};border:1px solid ${st.borda};border-radius:3px;padding:8px 12px;margin-top:2mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
         <div style="font-size:11px;font-weight:800;color:${st.cor};">⏳ Aguardando análise da Gerência</div>
       </div>`

  const numDoc = defesa.num || `DEF-${registro?.num || ''}`

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Defesa Administrativa — ${numDoc}</title>
  <style>${CSS_A4}</style>
</head>
<body>
<div id="page">
  <div id="watermark"></div>
  <div id="content">

    ${htmlHeader(numDoc, hoje, registro?.gerencia || 'obras')}

    <div id="body">
      <div class="doc-title">
        <h2>Defesa Administrativa</h2>
        <p>${ehAuto ? 'Auto de Infração' : 'Notificação Preliminar'} · ${registro?.num || defesa.record_num}</p>
      </div>

      <div style="display:inline-block;background:${st.bg};color:${st.cor};font-weight:800;font-size:11px;padding:4px 14px;border-radius:20px;margin-bottom:4mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        ${st.label}
      </div>

      <div class="sec-title sec-blue">Identificação do Agente de Fiscalização</div>
      <table class="field-table">
        <tr>
          <td class="lbl">Agente Fiscal</td>
          <td>${registro?.fiscal || '—'}</td>
          <td class="lbl" style="width:110px;">Matrícula</td>
          <td>${matFmt}</td>
        </tr>
        <tr>
          <td class="lbl">Proprietário / Responsável</td>
          <td colspan="3">${registro?.owner || '—'}</td>
        </tr>
        <tr>
          <td class="lbl">CPF / CNPJ</td>
          <td>${registro?.cpf || '—'}</td>
          <td class="lbl">Data da Emissão</td>
          <td>${registro?.date || '—'}</td>
        </tr>
        <tr>
          <td class="lbl">Endereço</td>
          <td colspan="3">${registro?.addr || '—'}${registro?.bairro ? `, ${registro.bairro}` : ''}</td>
        </tr>
        ${registro?.prazo ? `<tr><td class="lbl">Prazo Concedido</td><td colspan="3">${registro.prazo}</td></tr>` : ''}
      </table>

      ${infRows ? `
      <div class="sec-title sec-red">Infrações / Irregularidades Constatadas</div>
      <table style="width:100%;border-collapse:collapse;">${infRows}</table>
      ${multaBloco}` : ''}

      ${registro?.descricao ? `
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:3px;padding:6px 10px;margin:3mm 0;font-size:10px;">
        <strong>Obs. do Fiscal:</strong> ${registro.descricao}
      </div>` : ''}

      <div class="sec-title sec-blue" style="margin-top:5mm;">Dados do Requerente</div>
      <table class="field-table">
        <tr>
          <td class="lbl">Nome</td>
          <td colspan="3"><strong>${defesa.nome || '—'}</strong></td>
        </tr>
        <tr>
          <td class="lbl">CPF</td>
          <td>${defesa.cpf || '—'}</td>
          <td class="lbl">Telefone</td>
          <td>${defesa.telefone || '—'}</td>
        </tr>
        ${defesa.email ? `<tr><td class="lbl">E-mail</td><td colspan="3">${defesa.email}</td></tr>` : ''}
        <tr>
          <td class="lbl">Data de Envio</td>
          <td colspan="3">${defesa.created_at ? new Date(defesa.created_at).toLocaleString('pt-BR') : hoje}</td>
        </tr>
        <tr>
          <td class="lbl">Protocolo</td>
          <td colspan="3"><strong>${numDoc}</strong></td>
        </tr>
      </table>

      <div class="sec-title sec-blue" style="margin-top:5mm;">Defesa Apresentada pelo Contribuinte</div>
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:3px;padding:10px 12px;margin-top:2mm;font-size:11px;line-height:1.7;white-space:pre-wrap;">
        ${(defesa.texto || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}
      </div>

      ${defesa.anexos?.length > 0 ? `
      <div class="sec-title sec-blue" style="margin-top:4mm;">Documentos Anexados</div>
      <div style="padding:6px 8px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:3px;margin-top:2mm;font-size:10px;">
        ${defesa.anexos.map((url, i) => `<div>📎 Anexo ${i + 1}: ${url}</div>`).join('')}
      </div>` : ''}

      ${decisaoBloco}

      <div class="sec-title sec-blue" style="margin-top:5mm;">Identificação</div>
      <table class="sig-table">
        <tr>
          <td style="width:40%">
            <div style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:16px;">Agente de Fiscalização</div>
            <div style="border-top:1px solid #9ca3af;padding-top:4px;">
              <div style="font-size:10px;font-weight:700;">${registro?.fiscal || '—'}</div>
              <div style="font-size:9px;color:#6b7280;">Mat. ${matFmt}</div>
            </div>
          </td>
          <td style="width:60%"></td>
        </tr>
      </table>
    </div>

    ${htmlFooter(numDoc, hoje)}

  </div>
</div>
<button id="btn-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
</body>
</html>`

  abrirBlob(html, numDoc)
}
