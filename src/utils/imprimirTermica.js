import { mascaraMatricula } from '../components/MascaraInput.jsx'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

const INFO_MODULO = {
  obras: {
    secretaria: 'Sec. de Infraestrutura Urbana',
    gerencia:   'Gerência de Fiscalização de Obras',
  },
  posturas: {
    secretaria: 'Sec. de Serviços Públicos',
    gerencia:   'Gerência de Fiscalização de Posturas',
  },
}

// ============================================================
// CSS base para impressora térmica 58mm
// Chave: @page FORA de @media print, html/body fixados em 58mm
// sem nenhum container externo.
// ============================================================
function cssTermica() {
  return `
    /* Reset absoluto */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* @page PRECISA estar fora de @media print para funcionar */
    @page {
      size: 58mm auto;
      margin: 0mm;
    }

    html {
      width: 58mm;
      margin: 0;
      padding: 0;
      background: #fff;
    }

    body {
      width: 58mm;
      max-width: 58mm;
      margin: 0 auto;
      padding: 2mm 2.5mm;
      background: #fff;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #000;
      line-height: 1.35;
    }

    /* Garante que nada ultrapasse a largura */
    * { max-width: 100%; }

    img { display: block; }

    .c  { text-align: center; }
    .r  { text-align: right; }
    .b  { font-weight: bold; }
    .p  { font-size: 9px; }
    .g  { font-size: 10px; }
    .xg { font-size: 13px; letter-spacing: 1px; }

    .linha {
      border: none;
      border-top: 1px dashed #000;
      margin: 3px 0;
    }

    .bloco { margin: 2px 0; }

    .brasao {
      width: 18mm;
      height: 18mm;
      margin: 0 auto 2px;
    }

    .qr {
      width: 24mm;
      height: 24mm;
      margin: 2px auto;
    }

    /* Remove qualquer sombra/borda de print */
    @media print {
      html, body { background: #fff !important; }
    }
  `
}

// ============================================================
// Gera e abre a janela de impressão térmica
// ============================================================
export function imprimirTermica(registro) {
  if (!registro) return

  const info   = INFO_MODULO[registro.gerencia] || INFO_MODULO.obras
  const ehAuto = registro.type === 'auto'
  const matFmt = mascaraMatricula(registro.matricula || '')
  const qrData = `https://fiscon-portal.pmvc.ba.gov.br/?codigo=${registro.codigo_acesso}`
  const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}&margin=2`

  const infracoes = (registro.infracoes || [])
    .map(i => `<div class="bloco g">• ${i.descricao}</div>`)
    .join('')

  const multaHtml = ehAuto && registro.multa && Number(registro.multa) > 0
    ? `<hr class="linha"/><div class="b">MULTA: R$ ${Number(registro.multa).toFixed(2).replace('.', ',')}</div>`
    : ''

  const prazoLabel = ehAuto
    ? 'PRAZO PARA DEFESA: 10 DIAS'
    : `PRAZO: ${registro.prazo || '—'}`

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${registro.num}</title>
  <style>${cssTermica()}</style>
</head>
<body>

  <!-- Brasão -->
  <div class="c">
    <img class="brasao" src="${BRASAO}" alt=""/>
  </div>

  <!-- Órgão -->
  <div class="c p">${info.secretaria}</div>
  <div class="c p">${info.gerencia}</div>

  <hr class="linha"/>

  <!-- Tipo e número -->
  <div class="c b" style="font-size:12px;">${ehAuto ? 'AUTO DE INFRAÇÃO' : 'NOTIFICAÇÃO PRELIMINAR'}</div>
  <div class="c b xg">${registro.num}</div>
  <div class="c p">Data: ${registro.date}</div>

  <hr class="linha"/>

  <!-- Notificado -->
  <div class="b">NOTIFICADO:</div>
  <div class="bloco">${registro.owner || '—'}</div>
  ${registro.cpf ? `<div class="p">CPF/CNPJ: ${registro.cpf}</div>` : ''}
  <div class="p">${registro.addr || '—'}${registro.bairro ? `, ${registro.bairro}` : ''}</div>

  <hr class="linha"/>

  <!-- Infrações -->
  <div class="b">INFRAÇÕES:</div>
  ${infracoes}

  ${multaHtml}

  <hr class="linha"/>

  <!-- Prazo -->
  <div class="b">${prazoLabel}</div>
  ${registro.prazo && ehAuto ? `<div class="p">Vencimento: ${registro.prazo}</div>` : ''}

  <hr class="linha"/>

  <!-- Fiscal centralizado -->
  <div class="c b">${registro.fiscal || '—'}</div>
  <div class="c p">Mat.: ${matFmt}</div>

  <hr class="linha"/>

  <!-- QR Code e código de acesso -->
  <div class="c">
    <div class="p b" style="margin-bottom:2px;">Portal do Cidadão — Acesse sua defesa:</div>
    <img class="qr" src="${qrUrl}" alt="QR Code"/>
    <div class="p">Código de acesso:</div>
    <div class="b" style="font-size:14px; letter-spacing:3px; margin-top:1px;">${registro.codigo_acesso || '—'}</div>
    <div class="p" style="margin-top:2px;">fiscon-portal.pmvc.ba.gov.br</div>
  </div>

  <hr class="linha"/>
  <div class="c p">Vitória da Conquista — BA</div>
  <div class="c p">PMVC — FISCON ${new Date().getFullYear()}</div>

</body>
</html>`

  abrirJanelaImpressao(html)
}

// ============================================================
// Abre a janela e aciona o diálogo de impressão
// ============================================================
function abrirJanelaImpressao(html) {
  // Tenta abrir popup (desktop)
  const win = window.open('', '_blank', 'width=300,height=600,menubar=no,toolbar=no,location=no,status=no')

  if (win) {
    win.document.open()
    win.document.write(html)
    win.document.close()

    // Aguarda imagens carregarem antes de imprimir
    win.onload = () => {
      setTimeout(() => {
        win.focus()
        win.print()
        // Fecha após imprimir (alguns navegadores ignoram)
        setTimeout(() => win.close(), 1500)
      }, 300)
    }

    // Fallback: se onload não disparar
    setTimeout(() => {
      if (!win.closed) {
        win.focus()
        win.print()
      }
    }, 1200)
  } else {
    // Fallback mobile: abre em nova aba
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 30000)
  }
}
