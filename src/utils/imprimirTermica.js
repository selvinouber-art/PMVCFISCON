// ============================================================
// FISCON — Impressão Térmica 58mm
// Blob URL — sem bloqueio de popup
// QR Code via qrcode.js (local, sem API externa)
// @page FORA de @media print — obrigatório
// Fontes maiores para preencher toda a largura do rolo
// ============================================================

import { mascaraMatricula } from '../components/MascaraInput.jsx'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'
const PORTAL = 'https://fiscon-portal.pmvc.ba.gov.br'

const INFO = {
  obras:    { secretaria: 'Sec. Infraestrutura Urbana',      gerencia: 'Gerência de Fiscalização de Obras' },
  posturas: { secretaria: 'Sec. de Serviços Públicos',       gerencia: 'Gerência de Fiscalização de Posturas' },
}

// ============================================================
// CSS 58mm — fontes maiores para preencher toda a largura
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
    font-family: 'Courier New', Courier, monospace;
    /* Fonte base maior — 13px preenche bem a largura de 58mm */
    font-size: 13px;
    line-height: 1.4;
    width: 58mm;
    max-width: 58mm;
    margin: 0 auto;
    /* Padding lateral menor para aproveitar mais espaço */
    padding: 2mm 2mm;
    background: #fff;
    color: #000;
  }

  * { max-width: 100%; }
  img { display: block; max-width: 100%; }

  /* Classes de texto */
  .c   { text-align: center; }
  .r   { text-align: right; }
  .b   { font-weight: bold; }
  /* Texto secundário — menor mas ainda legível */
  .p   { font-size: 11px; }
  .pp  { font-size: 10px; }
  /* Número do documento — grande e destacado */
  .xg  { font-size: 16px; font-weight: bold; letter-spacing: 1px; }
  /* Título tipo/número */
  .tit { font-size: 14px; font-weight: bold; }

  .hr  { border: none; border-top: 1px dashed #000; margin: 3px 0; }
  .hr2 { border: none; border-top: 2px solid #000; margin: 3px 0; }
  .blk { margin: 2px 0; }
  .box { border: 2px solid #000; padding: 2mm; text-align: center; margin: 2mm 0; }

  .brasao { width: 22mm; height: 22mm; margin: 0 auto 2px; }
  .qr     { width: 30mm; height: 30mm; margin: 3px auto; }

  /* Item de infração — fonte legível, label do item em negrito */
  .inf-item  { margin: 2px 0; font-size: 12px; line-height: 1.35; }
  .inf-label { font-weight: bold; font-size: 11px; }

  /* Botão visível na tela, oculto no print */
  #btn-imprimir {
    display: block;
    width: 100%;
    margin-top: 16px;
    padding: 12px;
    font-size: 15px;
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

  // Infrações — mostra item/código + descrição
  const infracoes = (registro.infracoes || [])
    .map((i, idx) => {
      const label = i.codigo ? `Art. ${i.codigo}` : `Item ${idx + 1}`
      const desc  = i.descricao || String(i)
      return `<div class="inf-item"><span class="inf-label">${label}:</span> ${desc}</div>`
    })
    .join('')

  // Multa — só auto
  const multaBloco = ehAuto && registro.multa && Number(registro.multa) > 0
    ? `<hr class="hr"/>
       <div class="box b" style="font-size:14px;">MULTA: R$ ${Number(registro.multa).toFixed(2).replace('.', ',')}</div>`
    : ''

  // Prazo
  const prazoBloco = ehAuto
    ? `<div class="c b">PRAZO P/ DEFESA: 10 DIAS</div>
       <div class="c p">Vencimento: ${registro.prazo || '—'}</div>`
    : `<div class="c b">PRAZO: ${registro.prazo || '—'}</div>`

  // Testemunhas — só auto
  const testemunhasBloco = ehAuto && (registro.testemunha1 || registro.testemunha2)
    ? `<hr class="hr"/>
       <div style="display:flex;gap:2mm">
         <div style="flex:1;border-top:1px solid #000;padding-top:1mm;text-align:center;font-size:11px;">
           <div style="height:7mm"></div>
           <div class="b p">${registro.testemunha1 || 'Testemunha 1'}</div>
         </div>
         <div style="flex:1;border-top:1px solid #000;padding-top:1mm;text-align:center;font-size:11px;">
           <div style="height:7mm"></div>
           <div class="b p">${registro.testemunha2 || 'Testemunha 2'}</div>
         </div>
       </div>
       ${registro.obs_recusa ? `<div class="p blk">Obs: ${registro.obs_recusa}</div>` : ''}`
    : ''

  // Bloco QR + instruções claras para o contribuinte
  const qrBlock = registro.codigo_acesso
    ? `<hr class="hr"/>
       <div class="c b p">━━ ACESSE SUA DEFESA ━━</div>
       <div class="c p" style="margin:2px 0;">Escaneie o QR Code abaixo:</div>
       <div class="c"><canvas id="qr-canvas"></canvas></div>
       <div class="c p" style="margin:2px 0;">Ou acesse o site e digite o código:</div>
       <div class="c p" style="font-size:10px;">${PORTAL.replace('https://', '')}</div>
       <div class="box b" style="font-size:17px;letter-spacing:3px;margin:3px 0;">${registro.codigo_acesso}</div>
       <div class="c p" style="font-size:10px;">O código acima dá acesso ao seu processo,<br/>permite ver o documento oficial e<br/>enviar sua defesa por escrito.</div>`
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

  <!-- Brasão centralizado -->
  <div class="c">
    <img class="brasao" src="${BRASAO}" alt=""/>
  </div>

  <!-- Órgão emissor -->
  <div class="c b p">Prefeitura Municipal de</div>
  <div class="c b p">Vitória da Conquista — BA</div>
  <div class="c pp">${info.secretaria}</div>
  <div class="c pp">${info.gerencia}</div>

  <hr class="hr2"/>

  <!-- Tipo de documento e número -->
  <div class="c tit">${ehAuto ? 'AUTO DE INFRAÇÃO' : 'NOTIFICAÇÃO PRELIMINAR'}</div>
  <div class="c xg">${registro.num || '—'}</div>
  <div class="c p">Data: ${registro.date || new Date().toLocaleDateString('pt-BR')}</div>

  <hr class="hr"/>

  <!-- Dados do notificado -->
  <div class="b">DADOS DO ${ehAuto ? 'AUTUADO' : 'NOTIFICADO'}:</div>
  <div class="blk">Nome: <span class="b">${registro.owner || '—'}</span></div>
  ${registro.cpf ? `<div class="blk p">CPF/CNPJ: ${registro.cpf}</div>` : ''}
  <div class="blk p">${registro.addr || '—'}${registro.bairro ? `, ${registro.bairro}` : ''}</div>
  ${registro.loteamento ? `<div class="blk p">Lot.: ${registro.loteamento}</div>` : ''}

  <hr class="hr"/>

  <!-- Infrações com número do item -->
  <div class="b">${ehAuto ? 'INFRAÇÕES:' : 'IRREGULARIDADE:'}</div>
  ${infracoes}
  ${registro.descricao ? `<div class="blk p">Obs: ${registro.descricao}</div>` : ''}

  ${multaBloco}

  <hr class="hr"/>

  <!-- Prazo -->
  ${prazoBloco}

  ${testemunhasBloco}

  <hr class="hr"/>

  <!-- Fiscal centralizado -->
  <div class="c b">${registro.fiscal || '—'}</div>
  <div class="c p">Mat.: ${matFmt}</div>
  <div class="c p">Agente de Fiscalização</div>

  ${qrBlock}

  <hr class="hr"/>
  <div class="c p">FISCON — Vitória da Conquista — BA</div>

  <button id="btn-imprimir" onclick="window.print()">🖨️ IMPRIMIR</button>

  <!-- QRCode.js via CDN — gera o QR localmente -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\/script>
  <script>
    ${registro.codigo_acesso ? `
    window.addEventListener('load', function() {
      var canvas = document.getElementById('qr-canvas')
      if (canvas && typeof QRCode !== 'undefined') {
        QRCode.toCanvas(canvas, '${portalUrl}', {
          width: 113,
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

function abrirBlob(html) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const tab  = window.open(url, '_blank')
  if (!tab) {
    alert(
      'Permita pop-ups para este site e tente novamente.\n\n' +
      'Chrome: toque no ícone 🔒 → Permitir pop-ups.'
    )
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
