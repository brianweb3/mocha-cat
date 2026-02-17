// Simple canvas chart drawing
export const drawChart = (canvas, data, color = "#ff6600", maxValue = 100) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 20;

  ctx.clearRect(0, 0, width, height);

  if (!data || data.length === 0) return;

  // Draw grid
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (height - padding * 2) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw data line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
  const stepY = (height - padding * 2) / maxValue;

  data.forEach((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - value * stepY;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw fill
  ctx.fillStyle = color + "20";
  ctx.lineTo(width - padding, height - padding);
  ctx.lineTo(padding, height - padding);
  ctx.closePath();
  ctx.fill();
};
