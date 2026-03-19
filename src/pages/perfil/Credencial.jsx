import { getGerencia, nomePerfil } from '../../gerencia/gerencia.js'
import { INFO_MODULO } from '../../gerencia/GerenciaUI.jsx'
import { mascaraMatricula, mascaraCPF } from '../../components/MascaraInput.jsx'
import { getOne } from '../../config/supabase.js'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

export async function abrirCredencial(usuarioInicial) {
  let usuario = usuarioInicial
  try {
    const dados = await getOne('usuarios', usuarioInicial.id)
    if (dados) usuario = dados
  } catch { /* usa o que tem */ }

  const g    = getGerencia(usuario.gerencia)
  const info = INFO_MODULO[usuario.gerencia] || INFO_MODULO.obras
  const mat  = mascaraMatricula(usuario.matricula || '')
  const cpf  = mascaraCPF(usuario.endereco || '')
  const foto = usuario.foto_perfil || ''

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
  <title>Crachá — ${usuario.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%;
      background: #0f172a;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow', sans-serif;
      overflow: hidden;
    }

    /* Card proporcional — 54mm × 85.6mm = 0.631 ratio */
    .card {
      /* Ocupa o máximo possível mantendo a proporção */
      width: min(92vw, 92vh * 0.631);
      height: min(92vh, 92vw / 0.631);
      border-radius: min(3.2vw, 14px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 64px rgba(0,0,0,0.8);
      position: relative;
    }

    /* Faixas tricolores */
    .tricolor {
      flex-shrink: 0;
      height: min(2vh, 8px);
      background: linear-gradient(90deg, #009c3b 33.33%, #ffdf00 33.33% 66.66%, #002776 66.66%);
    }

    /* Header azul escuro — textos centralizados */
    .header {
      background: #001f5e;
      flex-shrink: 0;
      padding: min(2.5vh, 12px) min(4vw, 16px);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: min(0.4vh, 2px);
    }
    .h-prefeitura {
      font-size: min(1.7vw, 7px);
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      line-height: 1.3;
    }
    .h-municipio {
      font-size: min(2.4vw, 10px);
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.05em;
      line-height: 1.2;
    }
    .h-secretaria {
      font-size: min(1.7vw, 7px);
      font-weight: 600;
      color: #ffdf00;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.3;
    }
    .h-gerencia {
      font-size: min(1.5vw, 6px);
      color: rgba(255,255,255,0.5);
      line-height: 1.3;
    }

    /* Banner CREDENCIAL FUNCIONAL */
    .banner {
      background: #1a56db;
      flex-shrink: 0;
      padding: min(0.8vh, 4px) 0;
      text-align: center;
    }
    .banner-txt {
      font-size: min(1.9vw, 7.5px);
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    /* Brasão grande centralizado */
    .brasao-area {
      background: #001f5e;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: min(2.5vh, 13px) 0;
    }
    .brasao-area img {
      width: min(19vw, 78px);
      height: min(19vw, 78px);
    }

    /* Separador fino azul */
    .sep {
      background: #1a56db;
      height: min(0.6vh, 3px);
      flex-shrink: 0;
    }

    /* Corpo branco: foto + dados */
    .corpo {
      flex: 1;
      background: #f8fafc;
      display: flex;
      gap: min(2.5vw, 11px);
      padding: min(2.2vh, 11px) min(3vw, 13px);
      position: relative;
      overflow: hidden;
      min-height: 0;
    }

    /* Marca d'água */
    .dagua {
      position: absolute;
      bottom: -8px; right: -8px;
      opacity: 0.04;
      pointer-events: none;
    }
    .dagua img { width: min(28vw, 110px); height: min(28vw, 110px); }

    /* Foto */
    .foto-wrap { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: min(0.5vh, 3px); }
    .foto-box {
      border-radius: min(1.2vw, 5px);
      border: min(0.5vw, 2px) solid #001f5e;
      overflow: hidden;
      background: #dde3ec;
      display: flex; align-items: center; justify-content: center;
      width: min(19vw, 74px);
      height: min(24vw, 94px);
      flex-shrink: 0;
    }
    .foto-box img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
    .foto-sem { font-size: min(8vw, 32px); opacity: 0.25; }
    .foto-label { font-size: min(1.4vw, 5.5px); color: #94a3b8; letter-spacing: 0.06em; }

    /* Dados */
    .dados { flex: 1; display: flex; flex-direction: column; gap: min(1.2vh, 6px); min-width: 0; justify-content: center; }
    .campo-label {
      font-size: min(1.5vw, 5.5px);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      line-height: 1;
      margin-bottom: min(0.3vh, 1px);
    }
    .campo-nome {
      font-size: min(2.4vw, 9.5px);
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }
    .campo-cargo {
      font-size: min(2.2vw, 8.5px);
      font-weight: 700;
      color: #001f5e;
      line-height: 1.2;
    }
    .campo-mat {
      font-size: min(2.8vw, 11px);
      font-weight: 700;
      color: #1e293b;
      letter-spacing: 0.1em;
      font-family: 'Courier New', monospace;
    }
    .campo-cpf {
      font-size: min(2.3vw, 9px);
      font-weight: 600;
      color: #1e293b;
      font-family: 'Courier New', monospace;
    }

    @media print {
      html, body { background: #fff; }
      @page { size: 54mm 85.6mm; margin: 0; }
      .card { width: 54mm; height: 85.6mm; border-radius: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
<div class="card">

  <!-- Faixa tricolor topo -->
  <div class="tricolor"></div>

  <!-- Header textos centralizados -->
  <div class="header">
    <div class="h-prefeitura">Prefeitura Municipal de</div>
    <div class="h-municipio">VITÓRIA DA CONQUISTA</div>
    <div class="h-secretaria">${info.secretaria}</div>
    <div class="h-gerencia">${info.gerencia}</div>
  </div>

  <!-- Banner -->
  <div class="banner">
    <div class="banner-txt">Credencial Funcional</div>
  </div>

  <!-- Brasão grande centralizado -->
  <div class="brasao-area">
    <img src="${BRASAO}" alt="Brasão PMVC"/>
  </div>

  <!-- Separador -->
  <div class="sep"></div>

  <!-- Corpo: foto + dados -->
  <div class="corpo">
    <div class="dagua"><img src="${BRASAO}" alt=""/></div>

    <div class="foto-wrap">
      <div class="foto-box">
        ${foto
          ? `<img src="${foto}" alt="Foto" id="fotoImg"/>`
          : `<div class="foto-sem">👤</div>`
        }
      </div>
      <div class="foto-label">FOTO 3×4</div>
    </div>

    <div class="dados">
      <div>
        <div class="campo-label">Nome</div>
        <div class="campo-nome">${(usuario.name || '').toUpperCase()}</div>
      </div>
      <div>
        <div class="campo-label">Cargo</div>
        <div class="campo-cargo">${usuario.cargo || nomePerfil(usuario)}</div>
      </div>
      <div>
        <div class="campo-label">Matrícula</div>
        <div class="campo-mat">${mat}</div>
      </div>
      ${cpf ? `<div>
        <div class="campo-label">CPF</div>
        <div class="campo-cpf">${cpf}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- Faixa tricolor rodapé -->
  <div class="tricolor"></div>
</div>

${foto ? `
<script>
  const img = document.getElementById('fotoImg')
  if (img) {
    let dragging = false, startY = 0, pos = 20
    img.style.objectPosition = 'center ' + pos + '%'
    img.style.cursor = 'ns-resize'
    img.addEventListener('mousedown', e => { dragging = true; startY = e.clientY; e.preventDefault() })
    img.addEventListener('touchstart', e => { dragging = true; startY = e.touches[0].clientY; e.preventDefault() }, { passive: false })
    document.addEventListener('mousemove', e => {
      if (!dragging) return
      pos = Math.max(0, Math.min(100, pos - (e.clientY - startY) * 0.4))
      img.style.objectPosition = 'center ' + pos + '%'
      startY = e.clientY
    })
    document.addEventListener('touchmove', e => {
      if (!dragging) return
      pos = Math.max(0, Math.min(100, pos - (e.touches[0].clientY - startY) * 0.4))
      img.style.objectPosition = 'center ' + pos + '%'
      startY = e.touches[0].clientY
    }, { passive: false })
    document.addEventListener('mouseup', () => dragging = false)
    document.addEventListener('touchend', () => dragging = false)
  }
</script>` : ''}
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}
