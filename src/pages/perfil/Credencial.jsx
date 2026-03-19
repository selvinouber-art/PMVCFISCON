import { INFO_MODULO } from '../../gerencia/GerenciaUI.jsx'
import { getGerencia, nomePerfil } from '../../gerencia/gerencia.js'
import { mascaraMatricula, mascaraCPF } from '../../components/MascaraInput.jsx'
import { getOne } from '../../config/supabase.js'

const BRASAO_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

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
  const gradiente = `linear-gradient(175deg, ${g.cor} 0%, ${g.cor}CC 50%, #0a1a4a 100%)`
  const fotoSrc = usuario.foto_perfil || ''

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <title>Crachá — ${usuario.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%; width: 100%;
      display: flex; align-items: center; justify-content: center;
      background: #0a1a4a;
      font-family: 'Barlow', sans-serif;
      overflow: hidden;
    }
    .card {
      width: min(88vw, 50vh * 0.631);
      height: min(88vh, 88vw / 0.631);
      background: ${gradiente};
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 16px 64px rgba(0,0,0,0.6);
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .dagua {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      pointer-events: none; z-index: 0;
    }
    .dagua img { width: 85%; height: 85%; opacity: 0.07; object-fit: contain; filter: brightness(10); }
    .topo { height: 5px; background: rgba(255,255,255,0.5); position: relative; z-index: 1; }
    .cabecalho {
      padding: 3% 5% 2%; text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      position: relative; z-index: 1;
    }
    .brasao-img { width: 11%; height: auto; margin-bottom: 2%; }
    .cab-pref { font-size: 1.7vmin; color: rgba(255,255,255,0.8); line-height: 1.3; }
    .cab-sec  { font-size: 2.1vmin; font-weight: 700; color: #fff; margin: 1% 0; line-height: 1.2; }
    .cab-ger  { font-size: 1.7vmin; color: rgba(255,255,255,0.75); line-height: 1.3; }
    /* Foto — maior */
    .foto-wrap {
      display: flex; justify-content: center;
      padding: 4% 0 2%;
      position: relative; z-index: 1;
    }
    .foto-circulo {
      /* 34% da largura do card */
      width: 34%; padding-top: 34%;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.85);
      overflow: hidden;
      background: rgba(255,255,255,0.15);
      position: relative;
      flex-shrink: 0;
    }
    .foto-circulo img {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center top;
    }
    .foto-sem {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 8vmin;
    }
    .nome-area { text-align: center; padding: 0 5% 3%; position: relative; z-index: 1; }
    .nome {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 4.8vmin; font-weight: 700; color: #fff;
      line-height: 1.1; letter-spacing: 0.02em;
    }
    .cargo { font-size: 2.6vmin; color: rgba(255,255,255,0.9); font-weight: 600; margin-top: 1.5%; }
    .divisor { height: 1px; background: rgba(255,255,255,0.25); margin: 0 5%; position: relative; z-index: 1; }
    .rodape {
      padding: 3% 5%; flex: 1;
      display: flex; flex-direction: column; justify-content: center;
      gap: 3%; position: relative; z-index: 1;
    }
    .row { display: flex; justify-content: space-between; align-items: flex-start; }
    .info-label { font-size: 1.5vmin; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1px; }
    .info-valor    { font-size: 3vmin; color: #fff; font-weight: 700; letter-spacing: 0.05em; }
    .info-valor-sm { font-size: 2.5vmin; color: #fff; font-weight: 600; letter-spacing: 0.04em; }
    .barra-inf { height: 5px; background: rgba(255,255,255,0.3); position: relative; z-index: 1; }
  </style>
</head>
<body>
<div class="card">
  <div class="dagua"><img src="${BRASAO_URL}" alt=""/></div>
  <div class="topo"></div>
  <div class="cabecalho">
    <img class="brasao-img" src="${BRASAO_URL}" alt="Brasão"/>
    <div class="cab-pref">Prefeitura Municipal de Vitória da Conquista</div>
    <div class="cab-sec">${info.secretaria}</div>
    <div class="cab-ger">${info.gerencia}</div>
  </div>
  <div class="foto-wrap">
    <div class="foto-circulo">
      ${fotoSrc
        ? `<img src="${fotoSrc}" alt="Foto"/>`
        : `<div class="foto-sem">👤</div>`
      }
    </div>
  </div>
  <div class="nome-area">
    <div class="nome">${(usuario.name || '').toUpperCase()}</div>
    <div class="cargo">${usuario.cargo || nomePerfil(usuario)}</div>
  </div>
  <div class="divisor"></div>
  <div class="rodape">
    <div class="row">
      <div>
        <div class="info-label">Matrícula</div>
        <div class="info-valor">${mat}</div>
      </div>
    </div>
    ${cpf ? `<div><div class="info-label">CPF</div><div class="info-valor-sm">${cpf}</div></div>` : ''}
  </div>
  <div class="barra-inf"></div>
</div>
</body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}

// ============================================================
// Componente de ajuste de foto antes do upload
// Usado no UserFormModal
// ============================================================
export function FotoAjuste({ arquivo, onConfirmar, onCancelar }) {
  // Renderizado via portal no UserFormModal
  // Exibe a foto em tela cheia com slider de posição vertical
  // O usuário arrasta para ajustar e clica em "Confirmar"
  return null // implementado via HTML puro abaixo
}

export function abrirAjusteFoto(arquivo, onConfirmar) {
  const objUrl = URL.createObjectURL(arquivo)
  const win = window.open('', '_blank', 'width=400,height=600')

  win.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ajustar foto</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a1a4a; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; color: #fff; padding: 20px; gap: 20px; }
    h2 { font-size: 1.1rem; text-align: center; }
    .circulo-wrap { width: 220px; height: 220px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.8); overflow: hidden; background: rgba(255,255,255,0.1); position: relative; cursor: ns-resize; flex-shrink: 0; }
    .circulo-wrap img { position: absolute; left: 0; width: 100%; height: auto; min-height: 100%; object-fit: cover; user-select: none; -webkit-user-drag: none; }
    .dica { font-size: 0.82rem; color: rgba(255,255,255,0.6); text-align: center; }
    .slider-wrap { width: 220px; }
    label { font-size: 0.82rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 6px; }
    input[type=range] { width: 100%; accent-color: #4A90E2; }
    .btns { display: flex; gap: 12px; }
    button { padding: 12px 28px; border-radius: 10px; border: none; font-size: 1rem; font-weight: 700; cursor: pointer; }
    .btn-ok  { background: #1A56DB; color: #fff; }
    .btn-can { background: rgba(255,255,255,0.15); color: #fff; }
  </style>
</head><body>
  <h2>Ajuste a posição da foto</h2>
  <div class="circulo-wrap" id="circulo">
    <img src="${objUrl}" id="img" draggable="false"/>
  </div>
  <div class="slider-wrap">
    <label>Posição vertical</label>
    <input type="range" id="slider" min="0" max="100" value="30"/>
  </div>
  <div class="dica">Arraste o slider para centralizar o rosto</div>
  <div class="btns">
    <button class="btn-ok"  onclick="confirmar()">✅ Confirmar</button>
    <button class="btn-can" onclick="window.close()">Cancelar</button>
  </div>
  <script>
    const img    = document.getElementById('img')
    const slider = document.getElementById('slider')
    let pos = 30

    slider.addEventListener('input', () => {
      pos = Number(slider.value)
      img.style.top = (-pos * 0.8) + '%'
    })

    function confirmar() {
      // Renderiza no canvas com a posição ajustada
      const canvas = document.createElement('canvas')
      canvas.width  = 400
      canvas.height = 400
      const ctx = canvas.getContext('2d')
      const naturalW = img.naturalWidth
      const naturalH = img.naturalHeight
      // Escala para caber na largura
      const scale = 400 / naturalW
      const scaledH = naturalH * scale
      const offsetY = (pos / 100) * (scaledH - 400)
      ctx.drawImage(img, 0, -offsetY, 400, scaledH)
      canvas.toBlob(blob => {
        const channel = new BroadcastChannel('fiscon_foto_ajuste')
        const reader  = new FileReader()
        reader.onload = e => { channel.postMessage({ dataUrl: e.target.result }); window.close() }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', 0.92)
    }
  </script>
</body></html>`)
  win.document.close()

  // Escuta o resultado
  const channel = new BroadcastChannel('fiscon_foto_ajuste')
  channel.onmessage = (e) => {
    fetch(e.data.dataUrl)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], arquivo.name, { type: 'image/jpeg' })
        onConfirmar(file, e.data.dataUrl)
      })
    channel.close()
    URL.revokeObjectURL(objUrl)
  }
}
