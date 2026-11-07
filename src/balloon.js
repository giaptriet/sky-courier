// balloon.js — khinh khí cầu: vị trí, chuyển động và cách vẽ.
//
// Bước 1.2: khinh khí cầu chỉ chịu "trọng lực" nên từ từ hạ xuống,
// rồi dừng lại khi chạm mép dưới màn hình.
// (Chạm đất = thua sẽ làm ở bước 2.2; điều khiển bay lên làm ở bước 1.3.)

import { CONFIG } from './config.js';

export function createBalloon() {
  const b = CONFIG.balloon;
  return {
    x: b.startX,   // vị trí ngang (tâm bóng)
    y: b.startY,   // vị trí dọc (tâm bóng); số càng lớn càng ở thấp
    vy: 0,         // vận tốc dọc; số dương = đang đi xuống
  };
}

// Tính vị trí mới sau một khoảng thời gian dt (giây)
export function updateBalloon(balloon, dt) {
  const b = CONFIG.balloon;

  // Trọng lực làm tốc độ rơi tăng dần, nhưng không vượt quá tốc độ rơi tối đa
  // (khinh khí cầu hạ xuống nhẹ nhàng chứ không rơi như hòn đá).
  balloon.vy = Math.min(balloon.vy + b.gravity * dt, b.maxFallSpeed);
  balloon.y += balloon.vy * dt;

  // Tạm thời: dừng ở mép dưới để không rơi khỏi màn hình
  const lowestY = CONFIG.worldHeight - balloonBottomOffset();
  if (balloon.y > lowestY) {
    balloon.y = lowestY;
    balloon.vy = 0;
  }
}

// Khoảng cách từ tâm bóng xuống đáy giỏ
function balloonBottomOffset() {
  const b = CONFIG.balloon;
  return b.radius + b.ropeLength + b.basketHeight;
}

// Vẽ khinh khí cầu tại vị trí hiện tại
export function drawBalloon(ctx, balloon) {
  const b = CONFIG.balloon;
  const c = CONFIG.colors;
  const { x, y } = balloon;
  const r = b.radius;

  // --- Dây treo: nối đáy bóng xuống giỏ ---
  const basketTop = y + r + b.ropeLength;
  ctx.strokeStyle = c.balloonRope;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y + r * 0.85);
  ctx.lineTo(x - b.basketWidth / 2, basketTop);
  ctx.moveTo(x + r * 0.45, y + r * 0.85);
  ctx.lineTo(x + b.basketWidth / 2, basketTop);
  ctx.stroke();

  // --- Giỏ ---
  ctx.fillStyle = c.balloonBasket;
  ctx.fillRect(x - b.basketWidth / 2, basketTop, b.basketWidth, b.basketHeight);

  // --- Phong thư nhỏ gắn trên giỏ (dấu hiệu "giao thư") ---
  const ew = b.basketWidth * 0.6;
  const eh = b.basketHeight * 0.55;
  const ex = x - ew / 2;
  const ey = basketTop + (b.basketHeight - eh) / 2;
  ctx.fillStyle = c.envelope;
  ctx.fillRect(ex, ey, ew, eh);
  ctx.strokeStyle = c.envelopeLine;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(x, ey + eh * 0.6);
  ctx.lineTo(ex + ew, ey);
  ctx.stroke();

  // --- Thân bóng: hình tròn, đáy hơi thon ---
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI * 0.8, Math.PI * 2.2);
  ctx.quadraticCurveTo(x + r * 0.4, y + r * 1.05, x, y + r * 1.05);
  ctx.quadraticCurveTo(x - r * 0.4, y + r * 1.05, x - r * Math.cos(Math.PI * 0.2), y + r * Math.sin(Math.PI * 0.2));
  ctx.closePath();
  ctx.fillStyle = c.balloonMain;
  ctx.fill();

  // Sọc dọc trang trí (chỉ vẽ bên trong thân bóng)
  ctx.clip();
  ctx.fillStyle = c.balloonStripe;
  const stripeW = r * 0.32;
  ctx.fillRect(x - stripeW / 2, y - r, stripeW, r * 2.2);
  ctx.fillRect(x - r * 0.75 - stripeW / 2, y - r, stripeW * 0.7, r * 2.2);
  ctx.fillRect(x + r * 0.75 - stripeW * 0.35, y - r, stripeW * 0.7, r * 2.2);
  ctx.restore();
}
