const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600; 
canvas.height = 400; 

let pontuacao = 0;
let jogador = { x: canvas.width / 2, y: canvas.height - 70, w: 40, h: 40, sprite: new Image() };
jogador.sprite.src = 'ship.png'; 

let tiros = [];
let inimigos = [];
const inimigoSprite = new Image();
inimigoSprite.src = 'alien.png';

function desenharSprite(obj, sprite) {
  ctx.drawImage(sprite, obj.x, obj.y, obj.w, obj.h);
}

setInterval(() => {
  inimigos.push({ x: Math.random() * (canvas.width - 40), y: 0, w: 40, h: 40 });
}, 1000);

function atualizar() {
  tiros = tiros.filter(t => (t.y -= 5) > 0);
  inimigos = inimigos.filter(i => (i.y += 2) < canvas.height);
  tiros.forEach((t, ti) => {
    inimigos.forEach((i, ii) => {
      if (t.x < i.x + i.w && t.x + t.w > i.x && t.y < i.y + i.h && t.y + t.h > i.y) {
        tiros.splice(ti, 1);
        inimigos.splice(ii, 1);
        pontuacao++;
      }
    });
  });

  if (pontuacao === 50) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Você Ganhou!', canvas.width / 2, canvas.height / 2);
    return true; 
  }

  return false; 
}

function desenharTudo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharSprite(jogador, jogador.sprite);
  tiros.forEach(t => ctx.fillRect(t.x, t.y, t.w, t.h));
  inimigos.forEach(i => desenharSprite(i, inimigoSprite));
  ctx.fillStyle = 'cyan';
  ctx.font = '20px Arial';
  ctx.fillText(`Pontuação: ${pontuacao}`, 10, 20);
}

function loop() {
  if (!atualizar()) {
    desenharTudo();
    requestAnimationFrame(loop);
  }
}

loop();

document.addEventListener('keydown', e => {
  jogador.x += e.key === 'ArrowLeft' ? -10 : e.key === 'ArrowRight' ? 10 : 0;
  jogador.x = Math.max(0, Math.min(canvas.width - jogador.w, jogador.x));
});

document.addEventListener('click', () => {
  tiros.push({ x: jogador.x + jogador.w / 2 - 2.5, y: jogador.y, w: 5, h: 10 });
});