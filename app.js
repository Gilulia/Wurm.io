let canvas, ctx;
let worm;
let cupcakes = [];
let dx, dy;
let size = 20;
let running = false;

const width = 600;
const height = 600;

window.onload = () => {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
};

function startGame() {
  worm = [
    { x: 300, y: 300 },
    { x: 280, y: 300 },
    { x: 260, y: 300 }
  ];

  dx = size;
  dy = 0;

  cupcakes = [];
  for (let i = 0; i < 8; i++) spawnCupcake();

  running = true;
  gameLoop();
}

function spawnCupcake() {
  cupcakes.push({
    x: Math.floor(Math.random() * (width / size)) * size,
    y: Math.floor(Math.random() * (height / size)) * size
  });
}

document.addEventListener("keydown", (e) => {
  if (!running) return;
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -size; }
  if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = size; }
  if (e.key === "ArrowLeft" && dx === 0) { dx = -size; dy = 0; }
  if (e.key === "ArrowRight" && dx === 0) { dx = size; dy = 0; }
});

function gameLoop() {
  if (!running) return;
  setTimeout(() => {
    move();
    draw();
    gameLoop();
  }, 100);
}

function move() {
  let head = {
    x: worm[0].x + dx,
    y: worm[0].y + dy
  };

  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    running = false;
    alert("💀 Spiel vorbei!");
    return;
  }

  worm.unshift(head);

  let ate = false;

  cupcakes = cupcakes.filter(c => {
    if (
      Math.abs(head.x - c.x) < size &&
      Math.abs(head.y - c.y) < size
    ) {
      ate = true;
      return false;
    }
    return true;
  });

  if (ate) {
    spawnCupcake();
    if (worm.length > 120) worm.pop();
  } else {
    worm.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#2ecc71";
  ctx.lineWidth = size;

  ctx.beginPath();
  ctx.moveTo(worm[0].x + size/2, worm[0].y + size/2);

  for (let i = 1; i < worm.length; i++) {
    ctx.lineTo(worm[i].x + size/2, worm[i].y + size/2);
  }

  ctx.stroke();

  ctx.fillStyle = "#00ff99";
  ctx.beginPath();
  ctx.arc(worm[0].x + size/2, worm[0].y + size/2, size/1.7, 0, Math.PI*2);
  ctx.fill();

  cupcakes.forEach(c => drawCupcake(c.x, c.y));
}

function drawCupcake(x, y) {
  ctx.fillStyle = "#d35400";
  ctx.fillRect(x, y + size/2, size, size/2);

  ctx.fillStyle = "#ff69b4";
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size/2, Math.PI, 0);
  ctx.fill();
}