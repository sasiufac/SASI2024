document.addEventListener("DOMContentLoaded", function () {
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
  document.body.appendChild(counterDisplay);

  const pointer = document.createElement("div");
  pointer.style.width = "20px";
  pointer.style.height = "20px";
  pointer.style.background = "red";
  pointer.style.borderRadius = "50%";
  pointer.style.position = "absolute";
  pointer.style.zIndex = "1000";
  pointer.style.transition = "all 0.5s ease";
  document.body.appendChild(pointer);

  function movePointerRandomly() {
    const x = Math.random() * (window.innerWidth - 20);
    const y = Math.random() * (window.innerHeight - 20);
    pointer.style.left = `${x}px`;
    pointer.style.top = `${y}px`;
  }

  setInterval(movePointerRandomly, 2000);

  pointer.addEventListener("click", () => {
    counter++;
    counterDisplay.innerText = `Counter: ${counter}`;
    if (counter === 10) {
      // Change this value to the desired number of clicks
      openBreakoutGame();
    }
  });

  function openBreakoutGame() {
    const modal = document.getElementById("gameModal");
    modal.style.display = "block";

    const canvas = document.getElementById("breakoutCanvas");
    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let dx = 2;
    let dy = -2;
    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
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

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - 10, paddleWidth, 10);
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
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
            }
          }
        }
      }
    }

    function draw() {
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
          document.getElementById("closeGame").click();
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

    draw();

    document.getElementById("closeGame").addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});
