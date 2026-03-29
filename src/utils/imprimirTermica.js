// ============================================================
// FISCON — Impressão Térmica 58mm
// Usa Blob URL para evitar bloqueio de popup em mobile/Android
// QR Code gerado via biblioteca JS (sem dependência de API externa)
// @page FORA de @media print — obrigatório para 58mm funcionar
// ============================================================

import { mascaraMatricula } from '../components/MascaraInput.jsx'

const BRASAO    = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'
const PORTAL    = 'https://fiscon-portal.pmvc.ba.gov.br'

const INFO = {
  obras:    { secretaria: 'Sec. Municipal de Infraestrutura Urbana', gerencia: 'Gerência de Fiscalização de Obras' },
  posturas: { secretaria: 'Sec. Municipal de Serviços Públicos',     gerencia: 'Gerência de Fiscalização de Posturas' },
}

// ============================================================
// CSS 58mm — regras críticas para impressão correta
// ============================================================
const CSS58 = `
  @page { size: 58mm auto; margin: 0mm; }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    width: 58mm;
    margin: 0;
    padding: 0;
    background: #fff;
  }

  body {
    font-family: monospace, 'Courier New', Courier;
    font-size: 12px;
    line-height: 1.35;
    width: 58mm;
    max-width: 58mm;
    margin: 0 auto;
    padding: 2mm 3mm;
    background: #fff;
    color: #000;
  }

  * { max-width: 100%; }
  img { display: block; max-width: 100%; }

  .c   { text-align: center; }
  .r   { text-align: right; }
  .b   { font-weight: bold; }
  .p   { font-size: 10px; }
  .pp  { font-size: 9px; }
  .xg  { font-size: 14px; font-weight: bold; letter-spacing: 1px; }
  .hr  { border: none; border-top: 1px dashed #000; margin: 4px 0; }
  .hr2 { border: none; border-top: 2px solid #000; margin: 4px 0; }
  .blk { margin: 2px 0; }
  .box { border: 2px solid #000; padding: 2mm; text-align: center; margin: 2mm 0; }

  .brasao { width: 20mm; height: 20mm; margin: 0 auto 3px; }
  .qr     { width: 28mm; height: 28mm; margin: 3px auto; }

  /* Botão de impressão — não aparece no print */
  #btn-imprimir {
    display: block;
    width: 100%;
    margin-top: 16px;
    padding: 12px;
    font-size: 14px;
    font-weight: bold;
    background: #001f5e;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  @media print {
    html, body { background: #fff !important; }
    #btn-imprimir { display: none !important; }
    body * { visibility: visible; }
  }
`

// ============================================================
// Exportação principal
// ============================================================
export function imprimirTermica(registro) {
  if (!registro) return

  const info   = INFO[registro.gerencia] || INFO.obras
  const ehAuto = registro.type === 'auto'
  const matFmt = mascaraMatricula(registro.matricula || '')
  const portalUrl = `${PORTAL}/?codigo=${encodeURIComponent(registro.codigo_acesso || '')}`

  // Infrações
  const infracoes = (registro.infracoes || [])
    .map(i => `<div class="blk p">&#9642; ${i.descricao || i}</div>`)
    .join('')

  // Multa — só auto
  const multaBloco = ehAuto && registro.multa && Number(registro.multa) > 0
    ? `<hr class="hr"/>
       <div class="box b">MULTA: R$ ${Number(registro.multa).toFixed(2).replace('.', ',')}</div>`
    : ''

  // Prazo
  const prazoBloco = ehAuto
    ? `<div class="c b">PRAZO PARA DEFESA: 10 DIAS</div>
       <div class="c pp">Vencimento: ${registro.prazo || '—'}</div>`
    : `<div class="c b">PRAZO: ${registro.prazo || '—'}</div>`

  // Testemunhas — só auto
  const testemunhasBloco = ehAuto && (registro.testemunha1 || registro.testemunha2)
    ? `<hr class="hr"/>
       <div style="display:flex;gap:3mm">
         <div style="flex:1;border-top:1px solid #000;padding-top:1.5mm;text-align:center;font-size:10px">
           <div style="height:8mm"></div>
           <div class="b pp">${registro.testemunha1 || 'Testemunha 1'}</div>
         </div>
         <div style="flex:1;border-top:1px solid #000;padding-top:1.5mm;text-align:center;font-size:10px">
           <div style="height:8mm"></div>
           <div class="b pp">${registro.testemunha2 || 'Testemunha 2'}</div>
         </div>
       </div>
       ${registro.obs_recusa ? `<div class="pp blk">Obs: ${registro.obs_recusa}</div>` : ''}`
    : ''

  // QR block — usa lib qrcode.js para gerar localmente
  const qrBlock = registro.codigo_acesso
    ? `<hr class="hr"/>
       <div class="c b p">Portal do Cidadão — Envie sua defesa:</div>
       <div class="c"><canvas id="qr-canvas"></canvas></div>
       <div class="box b" style="font-size:16px;letter-spacing:3px;">${registro.codigo_acesso}</div>
       <div class="c pp">${PORTAL.replace('https://', '')}</div>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${registro.num || 'Documento'}</title>
  <style>${CSS58}</style>
</head>
<body>

  <!-- Cabeçalho -->
  <div class="c">
    <img class="brasao" src="${BRASAO}" alt="Brasão PMVC"/>
  </div>
  <div class="c b p">Prefeitura Municipal de</div>
  <div class="c b p">Vitória da Conquista</div>
  <div class="c pp">${info.secretaria}</div>
  <div class="c pp">${info.gerencia}</div>

  <hr class="hr2"/>

  <!-- Tipo e número -->
  <div class="c b" style="font-size:13px;">${ehAuto ? 'AUTO DE INFRAÇÃO' : 'NOTIFICAÇÃO PRELIMINAR'}</div>
  <div class="c xg">${registro.num || '—'}</div>
  <div class="c pp">Data: ${registro.date || new Date().toLocaleDateString('pt-BR')}</div>

  <hr class="hr"/>

  <!-- Dados do notificado -->
  <div class="b p">DADOS DO ${ehAuto ? 'AUTUADO' : 'NOTIFICADO'}:</div>
  <div class="blk">Nome: <span class="b">${registro.owner || '—'}</span></div>
  ${registro.cpf ? `<div class="blk pp">CPF/CNPJ: ${registro.cpf}</div>` : ''}
  <div class="blk pp">${registro.addr || '—'}${registro.bairro ? `, ${registro.bairro}` : ''}</div>
  ${registro.loteamento ? `<div class="blk pp">Lot.: ${registro.loteamento}</div>` : ''}

  <hr class="hr"/>

  <!-- Infrações -->
  <div class="b p">${ehAuto ? 'INFRAÇÕES:' : 'IRREGULARIDADE:'}</div>
  ${infracoes}
  ${registro.descricao ? `<div class="blk pp">Obs: ${registro.descricao}</div>` : ''}

  ${multaBloco}

  <hr class="hr"/>

  <!-- Prazo -->
  ${prazoBloco}

  ${testemunhasBloco}

  <hr class="hr"/>

  <!-- Fiscal centralizado -->
  <div class="c b">${registro.fiscal || '—'}</div>
  <div class="c pp">Mat.: ${matFmt}</div>
  <div class="c pp">Agente de Fiscalização</div>

  ${qrBlock}

  <hr class="hr"/>
  <div class="c pp">FISCON — Vitória da Conquista — BA</div>
  <div class="c pp">${new Date().getFullYear()}</div>

  <button id="btn-imprimir" onclick="window.print()">🖨️ IMPRIMIR</button>

  <!-- QRCode.js — gera QR localmente sem API externa -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\/script>
  <script>
    ${registro.codigo_acesso ? `
    window.addEventListener('load', function() {
      var canvas = document.getElementById('qr-canvas')
      if (canvas && typeof QRCode !== 'undefined') {
        QRCode.toCanvas(canvas, '${portalUrl}', {
          width: 106,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        }, function(err) {
          if (err) console.error(err)
          setTimeout(function() { window.print() }, 600)
        })
      } else {
        setTimeout(function() { window.print() }, 400)
      }
    })
    ` : `
    window.addEventListener('load', function() {
      setTimeout(function() { window.print() }, 400)
    })
    `}
  <\/script>
</body>
</html>`

  abrirBlob(html)
}

// ============================================================
// Abre via Blob URL — evita bloqueio de popup no Chrome mobile
// ============================================================
function abrirBlob(html) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const tab  = window.open(url, '_blank')

  if (!tab) {
    alert(
      'Permita pop-ups para este site e tente novamente.\n\n' +
      'Chrome: toque no ícone 🔒 na barra de endereço → Permitir pop-ups.'
    )
  }

  // Libera memória após 60 segundos
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
