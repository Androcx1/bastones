import React, { useEffect } from 'react';

const RainEffect = () => {
  useEffect(() => {
    const canvas = document.getElementById('rainCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = [];
    const numberOfDrops = 100;

    // Crear gotas
    for (let i = 0; i < numberOfDrops; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 5 + 2,
        length: Math.random() * 20 + 10,
      });
    }

    function drawRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000'; // Fondo negro
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#aaa'; // Color de las líneas (gris claro)
      ctx.lineWidth = 1;

      drops.forEach((drop, index) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {
          drops[index] = {
            x: Math.random() * canvas.width,
            y: -20,
            speed: Math.random() * 5 + 2,
            length: Math.random() * 20 + 10,
          };
        }
      });

      requestAnimationFrame(drawRain);
    }

    drawRain();

    // Ajustar el tamaño del canvas al redimensionar la ventana
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return <canvas id="rainCanvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default RainEffect;