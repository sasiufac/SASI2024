const buttons = document.querySelectorAll(".minicurso-btn");
console.log("me disseram que tem um ovo por ai 🐰");

let isGameRunning = false;

document.addEventListener("DOMContentLoaded", () => {
  // conferir o css global pra entender
  const sections = document.querySelectorAll(".section-hidden");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          entry.target.classList.remove("section-hidden");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 } // o quanto de visibilidade precisa pra começar a aparecer (0 a 1, é uma porcentagem)
  );

  sections.forEach((section) => observer.observe(section));
});

// navbar colapse
document.getElementById("menu-toggle").addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
});

// colapser de minicursos
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;

    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.classList.add("hidden");
      content.style.maxHeight = "0";
    }
  });
});

// esconde esconde com a bolinha
document.addEventListener("DOMContentLoaded", function () {
  // bolina bolinha
  const pointer = document.createElement("div");
  pointer.style.width = "20px";
  pointer.style.height = "20px";
  pointer.style.border = "3px solid white";
  pointer.style.background = "black";
  pointer.style.borderRadius = "50%";
  pointer.style.position = "absolute";
  pointer.style.zIndex = "1000";
  pointer.style.transition = "all 0.5s ease";
  pointer.style.cursor = "grab";
  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    document.body.appendChild(pointer);
  }

  // randomizador da bolinha -- pagina toda
  function movePointerRandomly() {
    const pageWidth = document.documentElement.scrollWidth;
    const pageHeight = document.documentElement.scrollHeight;
    const x = Math.random() * (pageWidth - 20);
    const y = Math.random() * (pageHeight - 20);
    pointer.style.left = `${x}px`;
    pointer.style.top = `${y}px`;
  }

  movePointerRandomly();

  // intervalo da reincidencia do movimento em ms
  setInterval(movePointerRandomly, 5000);

  let counter = 0;
  const counterDisplay = document.createElement("div");
  counterDisplay.style.position = "fixed";
  counterDisplay.style.top = "10px";
  counterDisplay.style.right = "10px";
  counterDisplay.style.background = "white";
  counterDisplay.style.padding = "10px";
  counterDisplay.style.border = "1px solid black";
  counterDisplay.style.zIndex = "1000";
  counterDisplay.innerText = `Counter: ${counter}`;

  pointer.addEventListener("click", () => {
    counter++;
    counterDisplay.innerText = `Counter: ${counter}`;
    if (counter === 7) {
      // alert("clicado");
      startBreakoutGame();
    }
  });
});

function startBreakoutGame() {
  isGameRunning = true;

  // main def da modal
  const modal = document.createElement("div");
  modal.id = "gameModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0, 0, 0, 0.9)";
  modal.style.zIndex = "9999";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  document.body.appendChild(modal);

  // botão de fechar modal
  const closeButton = document.createElement("button");
  closeButton.id = "closeGame";
  closeButton.innerText = "Fechar";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.background = "red";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.padding = "10px 15px";
  closeButton.style.cursor = "pointer";
  closeButton.style.zIndex = "10000";

  closeButton.addEventListener("click", () => {
    isGameRunning = false;
    document.body.removeChild(modal);
  });

  modal.appendChild(closeButton);
  // jogo
  const canvas = document.createElement("canvas");
  canvas.id = "breakoutCanvas";
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.background = "black";
  modal.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let ballRadius = 10;
  let x = canvas.width / 2;
  let y = canvas.height - 30;

  // velocidade da bola é aqui
  let dx = 2;
  let dy = -2;

  let paddleHeight = 10;
  let paddleWidth = 75;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let rightPressed = false;
  let leftPressed = false;

  const brickRowCount = 3;
  const brickColumnCount = 5;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  // gambiarra pros tiles porque eu sou burro e não consegui fazer melhor
  const bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "green";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    const encodedCode = encodeCode();
    let blocksRemaining = 0;

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          blocksRemaining++;

          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            // aumenta a velocidade ao quebrar os blocos
            dy = -dy * 1.1;
            b.status = 0;
          }
        }
      }
    }

    if (blocksRemaining === 0) {
      setTimeout(() => {
        alert(
          "PARABÉNS! VOCÊ VENCEU O JOGO, QUE ERA BEM FACIL, MAS FEZ ISSO DEPOIS QUE A SASI ACABOU...\n 🦆 qwen "
          // "PARABÉNS! VOCÊ VENCEU O JOGO! CÓDIGO COMPROBATÓRIO: " + encodedCode
        );
        closeButton.click();
      }, 200);
    }
  }

  function draw() {
    const encodedCode = encodeCode();
    // se o jogo não estiver rodando, breka
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        alert("GAME OVER");
        closeButton.click();
        return;
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  });

  draw();
}

// encode

function encodeCode() {
  const baseString = "SASI-2024";
  const currentTime = new Date().getTime();
  const encoded = btoa(baseString + "|" + currentTime);
  return encoded;
}

// decode, so pra testar mesmo
// function decodeCode(encoded) {
//   try {
//     const decoded = atob(encoded); // decode com base64
//     const [decodedString, timestamp] = decoded.split("|");

//     if (decodedString === "SASI-2024") {
//       return "SASI-2024";
//     } else {
//       return "Código inválido.";
//     }
//   } catch (error) {
//     return "Erro ao decodificar.";
//   }
// }

// const test = encodeCode();
// console.log(test);

// const uncode = decodeCode();
// console.log(uncode);
