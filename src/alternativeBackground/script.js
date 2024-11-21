// num mexer
let max_particles = 300;
let particles = [];
let frequency = 100;
let init_num = max_particles;
let max_time = frequency * max_particles;
let time_to_recreate = false;
let mouse = { x: 0, y: 0, active: false };

// Cria canvas e inicializar contexto
let tela = document.createElement("canvas");
tela.width = window.innerWidth;
tela.height = window.innerHeight;
// document.body.appendChild(tela);
document.getElementById("animation-bg").appendChild(tela); // é gambiarra também

let canvas = tela.getContext("2d");

// Verifica se o canvas foi criado
if (!canvas) {
  console.error("Erro ao inicializar o canvas!");
}

// Eventos do mouse
tela.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});

tela.addEventListener("mouseleave", function () {
  mouse.active = false;
});

tela.addEventListener("click", function (event) {
  const num_particles_on_click = 5;

  for (let i = 0; i < num_particles_on_click; i++) {
    particles.push(
      new Particle(canvas, {
        x: event.clientX,
        y: event.clientY,
      })
    );
  }
});

// recriação
setTimeout(() => {
  time_to_recreate = true;
}, max_time);

// init
popolate(max_particles);

class Particle {
  constructor(canvas, options = {}) {
    let colors = ["#fcfcfc", "#fcfcfc", "#fcfcfc", "#fcfcfc", "#fcfcfc"];
    let types = ["fill", "empty"];
    this.random = Math.random();
    this.canvas = canvas;

    this.x =
      (options.x ?? window.innerWidth / 2) +
      (Math.random() * 200 - Math.random() * 200);
    this.y =
      (options.y ?? window.innerHeight / 2) +
      (Math.random() * 200 - Math.random() * 200);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.radius = 1 + 8 * this.random;
    this.type = types[this.randomIntFromInterval(0, types.length - 1)];
    this.color = colors[this.randomIntFromInterval(0, colors.length - 1)];
    this.a = 0;
    this.s = (this.radius + Math.random() * 1) / 10; // Velocidade da partícula
  }

  move() {
    // Interação com o mouse
    if (mouse.active) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      // Se a partícula estiver perto do mouse, será atraída ou repelida
      if (distance < 100) {
        this.x += dx / 10; // Ajuste a força de atração
        this.y += dy / 10;
      }
    }

    // Movimento normal
    this.x += Math.cos(this.a) * this.s;
    this.y += Math.sin(this.a) * this.s;
    this.a += Math.random() * 0.4 - 0.2;

    // Limites do canvas
    if (this.x < 0 || this.x > this.w - this.radius) return false;
    if (this.y < 0 || this.y > this.h - this.radius) return false;

    // Renderizar partícula
    this.render();
    return true;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  render() {
    let lineWidth = 0.2 + 2.8 * this.random;
    let color = this.color;

    switch (this.type) {
      case "full":
        this.createArcFill(this.radius, color);
        this.createArcEmpty(this.radius + lineWidth, lineWidth / 2, color);
        break;
      case "fill":
        this.createArcFill(this.radius, color);
        break;
      case "empty":
        this.createArcEmpty(this.radius, lineWidth, color);
        break;
    }
  }

  createArcFill(radius, color) {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.canvas.fillStyle = color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  createArcEmpty(radius, lineWidth, color) {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.canvas.lineWidth = lineWidth;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
    this.canvas.closePath();
  }

  // Adiciona o método getCoordinates pra saber onde cada bolinha ta e fazr a conexão laa em baixo
  getCoordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

// Funções de controle
function popolate(num) {
  for (let i = 0; i < num; i++) {
    setTimeout(() => {
      particles.push(new Particle(canvas));
    }, frequency * i);
  }
  return particles.length;
}

function clear() {
  canvas.fillStyle = "#111111";
  canvas.fillRect(0, 0, tela.width, tela.height);
}

function connection() {
  let old_element = null;
  particles.forEach((element, i) => {
    if (old_element && typeof old_element.getCoordinates === "function") {
      let box1 = old_element.getCoordinates();
      let box2 = element.getCoordinates();
      canvas.beginPath();
      canvas.moveTo(box1.x, box1.y);
      canvas.lineTo(box2.x, box2.y);
      canvas.lineWidth = 0.45;
      canvas.strokeStyle = "#3f47ff";
      canvas.stroke();
      canvas.closePath();
    }
    old_element = element;
  });
}

function update() {
  clear();
  connection();
  particles = particles.filter((p) => p.move());

  // Recriação de partículas
  if (time_to_recreate && particles.length < init_num) {
    popolate(1);
  }

  requestAnimationFrame(update);
}

update();
