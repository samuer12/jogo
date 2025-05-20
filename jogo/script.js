// base do jogo
const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

// Carrega as imagens
const naveImg = new Image();
naveImg.src = "ship.png";
const alienImg = new Image();
alienImg.src = "alien.png";


const jogador = {
  x: 280, 
  y: 340,
  largura: 40,
  altura: 40
};

let tiros = [];    
let inimigos = []; 
let pontos = 0;    
let vidas = 3;     
let jogoAtivo = true; 

// Função para iniciar o jogo
function iniciarJogo() {
  document.querySelector("button").style.display = "none";
  canvas.style.display = "block";
  jogoAtivo = true;
  pontos = 0;
  vidas = 3;
  tiros = [];
  inimigos = [];
  jogador.x = 280;
  desenhar();
}

// Cria inimigos a cada 2 segundos
setInterval(criarInimigo, 2000);

function criarInimigo() {
  if (!jogoAtivo) return;
  
  inimigos.push({
    x: Math.random() * (canvas.width - 40),
    y: 0,
    largura: 40,
    altura: 40
  });
}

// Controles do jogador
document.addEventListener("keydown", (e) => {
  if (!jogoAtivo) return;
  
  if (e.key === "ArrowLeft") jogador.x -= 10;
  if (e.key === "ArrowRight") jogador.x += 10;
  
  //  nave no canvas
  jogador.x = Math.max(0, Math.min(canvas.width - jogador.largura, jogador.x));
});

//  tiros  clique
document.addEventListener("click", () => {
  if (!jogoAtivo) return;
  
  tiros.push({
    x: jogador.x + jogador.largura/2 - 2.5,
    y: jogador.y,
    largura: 5,
    altura: 10
  });
});

// Função principal que desenha tudo
function desenhar() {
  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  
  ctx.drawImage(naveImg, jogador.x, jogador.y, jogador.largura, jogador.altura);
  
 
  atualizarTiros();
  
  atualizarInimigos();
  
  verificarColisoes();
 
  mostrarHUD();
  
  verificarFimDeJogo();
  
  // Continua o loop do jogo
  if (jogoAtivo) {
    requestAnimationFrame(desenhar);
  }
}


function atualizarTiros() {
  ctx.fillStyle = "red";
  
  // Move os tiros para cima
  tiros.forEach(tiro => {
    tiro.y -= 5;
    ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
  });
  
  // Remove tiros que saíram da tela
  tiros = tiros.filter(tiro => tiro.y + tiro.altura > 0);
}

function atualizarInimigos() {
  // Move os aliens para baixo
  inimigos.forEach(inimigo => {
    inimigo.y += 2;
    ctx.drawImage(alienImg, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
  });
  
  // Remove alien que saíram da tela
  inimigos = inimigos.filter(inimigo => inimigo.y < canvas.height + inimigo.altura);
}

function verificarColisoes() {
  // Tiros acertam monstro
  for (let i = tiros.length - 1; i >= 0; i--) {
    for (let j = inimigos.length - 1; j >= 0; j--) {
      if (colisao(tiros[i], inimigos[j])) {
        tiros.splice(i, 1);
        inimigos.splice(j, 1);
        pontos++;
        break;
      }
    }
  }
  
  // Inimigos atingem a nave
  for (let i = inimigos.length - 1; i >= 0; i--) {
    if (colisao(inimigos[i], jogador)) {
      inimigos.splice(i, 1);
      vidas--;
      if (vidas <= 0) {
        jogoAtivo = false;
      }
    }
  }
}

//  colisão
function colisao(obj1, obj2) {
  return obj1.x < obj2.x + obj2.largura &&
         obj1.x + obj1.largura > obj2.x &&
         obj1.y < obj2.y + obj2.altura &&
         obj1.y + obj1.altura > obj2.y;
}

function mostrarHUD() {
  ctx.fillStyle = "cyan";
  ctx.font = "16px Arial";
  ctx.fillText(`Pontos: ${pontos}`, 10, 20);
  ctx.fillText(`Vidas: ${vidas}`, 10, 40);
}

function verificarFimDeJogo() {
  if (vidas <= 0) {
    mostrarMensagem("Você Perdeu!");
  } else if (pontos >= 50) {
    mostrarMensagem("Você Ganhou!");
  }
}

function mostrarMensagem(texto) {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText(texto, canvas.width/2 - 120, canvas.height/2);
  jogoAtivo = false;
}
