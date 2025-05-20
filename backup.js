let canvas = document.getElementById("meuCanvas");
let ctx    = canvas.getContext("2d");

let naveImg  = new Image();
naveImg.src  = "ship.png";
let alienImg = new Image();
alienImg.src = "alien.png";

let jogador   = { x:280, y:340, largura:40, altura:40 };
let tiros      = [];
let inimigos   = [];
let pontos     = 0;
let vidas      = 3;         // 3 vidas
let jogoGanho  = false;
let jogoPerdido = false;    // sinaliza derrota
let rodando    = false;

function iniciarJogo() {
  document.querySelector("button").style.display = "none";
  canvas.style.display = "block";
  rodando = true;
  pontos = 0;
  vidas  = 3;
  jogoGanho   = false;
  jogoPerdido = false;
  tiros    = [];
  inimigos = [];
  jogador.x = 280;
  desenhar();
}

// gera inimigos a cada 1s
setInterval(function(){
  if (!rodando || jogoGanho || jogoPerdido) return;
  inimigos.push({
    x: Math.random()*(canvas.width-40),
    y: 0,
    largura: 40,
    altura: 40
  });
}, 1000);

document.addEventListener("keydown", e => {
  if (!rodando) return;
  if (e.key === "ArrowLeft")  jogador.x -= 10;
  if (e.key === "ArrowRight") jogador.x += 10;
  jogador.x = Math.max(0, Math.min(canvas.width-jogador.largura, jogador.x));
});

document.addEventListener("click", () => {
  if (!rodando || jogoGanho || jogoPerdido) return;
  tiros.push({
    x: jogador.x + jogador.largura/2 - 2.5,
    y: jogador.y,
    largura: 5,
    altura: 10
  });
});

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nave
  ctx.drawImage(naveImg, jogador.x, jogador.y, jogador.largura, jogador.altura);

  // atira
  ctx.fillStyle = "red";
  tiros.forEach(t => t.y -= 5);
  tiros.forEach(t => ctx.fillRect(t.x, t.y, t.largura, t.altura));
  tiros = tiros.filter(t => t.y + t.altura > 0);

  // inimigos
  inimigos.forEach(i => i.y += 2);
  inimigos.forEach(i => ctx.drawImage(alienImg, i.x, i.y, i.largura, i.altura));
  inimigos = inimigos.filter(i => i.y < canvas.height + i.altura);

  // colisões tiro ↔ inimigo
  for (let ti = tiros.length-1; ti >= 0; ti--) {
    for (let ii = inimigos.length-1; ii >= 0; ii--) {
      let t = tiros[ti], i = inimigos[ii];
      if (t.x < i.x+i.largura && t.x+t.largura > i.x &&
          t.y < i.y+i.altura && t.y+t.altura > i.y) {
        tiros.splice(ti,1);
        inimigos.splice(ii,1);
        pontos++;
        break;
      }
    }
  }

  // colisões inimigo ↔ jogador
  for (let ii = inimigos.length-1; ii >= 0; ii--) {
    let i = inimigos[ii];
    if (i.x < jogador.x+jogador.largura &&
        i.x+i.largura > jogador.x &&
        i.y + i.altura >= jogador.y) {
      inimigos.splice(ii,1);
      vidas--;
      if (vidas <= 0) {
        jogoPerdido = true;
        rodando = false;
      }
    }
  }

  // HUD
  ctx.fillStyle = "cyan";
  ctx.font = "16px Arial";
  ctx.fillText("Pontos: "+pontos, 10, 20);
  ctx.fillText("Vidas: "+vidas, 10, 40);

  // fim de jogo
  if (jogoGanho) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Você Ganhou!", canvas.width/2-120, canvas.height/2);
  }
  else if (jogoPerdido) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Você Perdeu!", canvas.width/2-120, canvas.height/2);
  }
  else {
    if (pontos >= 50) {
      jogoGanho = true;
      rodando = false;
    }
    requestAnimationFrame(desenhar);
  }
}
