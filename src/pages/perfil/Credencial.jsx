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

  const info  = INFO_MODULO[usuario.gerencia] || INFO_MODULO.obras
  const mat   = mascaraMatricula(usuario.matricula || '')
  const cpf   = mascaraCPF(usuario.endereco || '')
  const foto  = usuario.foto_perfil || ''
  const nome  = (usuario.name || '').toUpperCase()
  const cargo = (usuario.cargo || nomePerfil(usuario)).toUpperCase()

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
  <title>Crachá — ${usuario.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{
      width:100%;height:100%;
      background:#0f172a;
      display:flex;align-items:center;justify-content:center;
      font-family:'Barlow',sans-serif;
      overflow:hidden;
    }
    .card{
      width:min(88vw, 88vh * 0.631);
      height:min(88vh, 88vw / 0.631);
      border-radius:min(3vw,14px);
      overflow:hidden;
      display:flex;
      flex-direction:column;
      box-shadow:0 20px 64px rgba(0,0,0,0.85);
    }
    .tri{
      flex-shrink:0;
      height:min(2.5vh,9px);
      background:linear-gradient(90deg,#009c3b 33.33%,#ffdf00 33.33% 66.66%,#002776 66.66%);
    }
    .hdr{
      background:#001f5e;
      flex-shrink:0;
      padding:min(1.6vh,9px) min(4vw,16px) min(1.4vh,8px);
      text-align:center;
      display:flex;flex-direction:column;
      gap:min(0.4vh,2px);
    }
    .h-pre{font-size:min(2.2vw,9px);color:rgba(255,255,255,0.65);letter-spacing:0.08em;text-transform:uppercase;}
    .h-mun{font-size:min(3.8vw,16px);font-weight:800;color:#fff;letter-spacing:0.04em;}
    .h-sec{font-size:min(2.2vw,9px);font-weight:700;color:#ffdf00;letter-spacing:0.06em;text-transform:uppercase;}
    .h-ger{font-size:min(1.8vw,7.5px);color:rgba(255,255,255,0.55);}
    .banner{
      background:#1a56db;flex-shrink:0;
      padding:min(0.8vh,4px) 0;text-align:center;
    }
    .banner span{
      font-size:min(2.3vw,9.5px);font-weight:700;
      color:#fff;letter-spacing:0.2em;text-transform:uppercase;
    }
    .brasao-wrap{
      background:#001f5e;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      padding:min(1.8vh,9px) 0;
    }
    .brasao-wrap img{width:min(20vw,76px);height:min(20vw,76px);}
    .sep{background:#1a56db;height:min(0.5vh,3px);flex-shrink:0;}
    .corpo{
      flex:1;background:#f8fafc;
      display:flex;min-height:0;
      position:relative;overflow:hidden;
    }
    .dagua{
      position:absolute;bottom:-8px;right:-8px;
      opacity:0.05;pointer-events:none;
    }
    .dagua img{width:min(32vw,120px);height:min(32vw,120px);}
    .col-foto{
      width:42%;flex-shrink:0;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      padding:min(1.8vh,9px) min(1.5vw,6px) min(1.8vh,9px) min(2.5vw,10px);
      border-right:1px solid #e2e8f0;
    }
    .foto-box{
      width:100%;aspect-ratio:3/4;
      border-radius:min(1vw,4px);
      border:min(0.6vw,2.5px) solid #001f5e;
      overflow:hidden;background:#cbd5e0;
      display:flex;align-items:center;justify-content:center;
    }
    .foto-box img{
      width:100%;height:100%;
      object-fit:cover;object-position:center 20%;
      display:block;cursor:ns-resize;
    }
    .foto-sem{font-size:min(10vw,42px);opacity:0.25;}
    .foto-lbl{
      font-size:min(1.5vw,6px);color:#94a3b8;
      letter-spacing:0.06em;margin-top:min(0.5vh,3px);
      text-transform:uppercase;
    }
    .col-dados{
      flex:1;display:flex;flex-direction:column;
      justify-content:space-evenly;
      padding:min(1.8vh,9px) min(2.5vw,10px);
      min-width:0;
    }
    .campo{display:flex;flex-direction:column;gap:min(0.2vh,1px);}
    /* Labels menores */
    .lbl{
      font-size:min(1.6vw,6.5px);
      color:#94a3b8;text-transform:uppercase;
      letter-spacing:0.09em;line-height:1;
    }
    /* Valores BEM maiores — como no rascunho */
    .v-nome{
      font-size:min(3vw,12px);font-weight:800;
      color:#1e293b;line-height:1.15;
    }
    .v-cargo{
      font-size:min(2.8vw,11px);font-weight:700;
      color:#001f5e;line-height:1.2;
    }
    .v-mat{
      font-size:min(3.8vw,15px);font-weight:800;
      color:#1e293b;letter-spacing:0.08em;
      font-family:'Courier New',monospace;
    }
    .v-cpf{
      font-size:min(2.8vw,11px);font-weight:600;
      color:#1e293b;font-family:'Courier New',monospace;
    }
    @media print{
      html,body{background:#fff;}
      @page{size:54mm 85.6mm;margin:0;}
      .card{width:54mm;height:85.6mm;border-radius:0;box-shadow:none;}
    }
  </style>
</head>
<body>
<div class="card">
  <div class="tri"></div>
  <div class="hdr">
    <div class="h-pre">Prefeitura Municipal de</div>
    <div class="h-mun">VITÓRIA DA CONQUISTA</div>
    <div class="h-sec">${info.secretaria}</div>
    <div class="h-ger">${info.gerencia}</div>
  </div>
  <div class="banner"><span>Credencial Funcional</span></div>
  <div class="brasao-wrap"><img src="${BRASAO}" alt="Brasão"/></div>
  <div class="sep"></div>
  <div class="corpo">
    <div class="dagua"><img src="${BRASAO}" alt=""/></div>
    <div class="col-foto">
      <div class="foto-box">
        ${foto ? `<img src="${foto}" alt="Foto" id="fotoImg"/>` : `<div class="foto-sem">👤</div>`}
      </div>
      <div class="foto-lbl">Foto 3×4</div>
    </div>
    <div class="col-dados">
      <div class="campo">
        <div class="lbl">Nome</div>
        <div class="v-nome">${nome}</div>
      </div>
      <div class="campo">
        <div class="lbl">Cargo</div>
        <div class="v-cargo">${cargo}</div>
      </div>
      <div class="campo">
        <div class="lbl">Matrícula</div>
        <div class="v-mat">${mat}</div>
      </div>
      ${cpf ? `<div class="campo">
        <div class="lbl">CPF</div>
        <div class="v-cpf">${cpf}</div>
      </div>` : ''}
    </div>
  </div>
  <div class="tri"></div>
</div>
${foto ? `<script>
  const img=document.getElementById('fotoImg')
  if(img){
    let drag=false,sy=0,pos=20
    img.style.objectPosition='center '+pos+'%'
    const mv=y=>{pos=Math.max(0,Math.min(100,pos-(y-sy)*.5));img.style.objectPosition='center '+pos+'%';sy=y}
    img.addEventListener('mousedown', e=>{drag=true;sy=e.clientY;e.preventDefault()})
    img.addEventListener('touchstart',e=>{drag=true;sy=e.touches[0].clientY;e.preventDefault()},{passive:false})
    document.addEventListener('mousemove', e=>{if(drag)mv(e.clientY)})
    document.addEventListener('touchmove', e=>{if(drag)mv(e.touches[0].clientY)},{passive:false})
    document.addEventListener('mouseup',  ()=>drag=false)
    document.addEventListener('touchend', ()=>drag=false)
  }
</script>` : ''}
</body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}
