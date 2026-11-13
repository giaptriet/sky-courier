// balloon.js — khinh khí cầu: vị trí, chuyển động và cách vẽ.
//
// Chuyển động (kiểu điều khiển đã chốt: CHẠM):
//   - Luôn có "trọng lực" kéo khinh khí cầu xuống từ từ.
//   - Mỗi lần chạm = một lần phụt lửa, khinh khí cầu được đẩy lên một đoạn.
// Va chạm: file này chỉ cho biết "vùng va chạm" của khinh khí cầu (balloonHitbox);
// việc kiểm tra có đâm vào gì không nằm ở level.js, xử lý vỡ/hồi sinh nằm ở main.js.

import { CONFIG } from './config.js';

export function createBalloon() {
  const b = CONFIG.balloon;
  return {
    x: b.startX,      // vị trí ngang (tâm bóng)
    y: b.startY,      // vị trí dọc (tâm bóng); số càng lớn càng ở thấp
    vy: 0,            // vận tốc dọc; số dương = đang đi xuống, số âm = đang đi lên
    flameTimer: 0,    // còn bao lâu nữa thì tắt ngọn lửa đang hiện (giây)
  };
}

// Tính vị trí mới sau một khoảng thời gian dt (giây).
// presses = số lần người chơi vừa chạm kể từ lần cập nhật trước
export function updateBalloon(balloon, dt, presses) {
  const b = CONFIG.balloon;

  // Vừa chạm → phụt lửa: đặt ngay tốc độ đi lên
  if (presses > 0) {
    balloon.vy = -b.tapLift;
    balloon.flameTimer = b.flameShowTime;
  }

  // Trọng lực luôn kéo xuống. Khi đang rơi dùng trọng lực mạnh hơn (fallGravity)
  // để khinh khí cầu rơi nhanh gần bằng tốc độ bay lên, mà không làm cú phụt yếu đi.
  const pull = balloon.vy < 0 ? b.gravity : b.fallGravity;
  balloon.vy += pull * dt;

  // Giới hạn tốc độ rơi: hạ xuống nhẹ nhàng, không rơi như hòn đá
  balloon.vy = Math.min(balloon.vy, b.maxFallSpeed);
  balloon.y += balloon.vy * dt;

  balloon.flameTimer = Math.max(0, balloon.flameTimer - dt);
}

// Khi đang bất tử: không cho bay ra khỏi màn hình hay chui xuống đất
export function keepInsideScreen(balloon) {
  const b = CONFIG.balloon;
  const highestY = b.radius;
  const lowestY = CONFIG.worldHeight - CONFIG.level.groundHeight - balloonBottomOffset();
  if (balloon.y < highestY) {
    balloon.y = highestY;
    balloon.vy = 0;
  }
  if (balloon.y > lowestY) {
    balloon.y = lowestY;
    balloon.vy = 0;
  }
}

// Vùng va chạm: một hình tròn cho thân bóng và một hình chữ nhật cho giỏ.
// Nhỏ hơn hình vẽ một chút (hitboxScale) để sượt nhẹ không bị tính là đâm.
export function balloonHitbox(balloon) {
  const b = CONFIG.balloon;
  const s = b.hitboxScale;
  const basketTop = balloon.y + b.radius + b.ropeLength;
  return {
    circle: { x: balloon.x, y: balloon.y, r: b.radius * s },
    basket: {
      x: balloon.x - (b.basketWidth * s) / 2,
      y: basketTop,
      w: b.basketWidth * s,
      h: b.basketHeight * s,
    },
  };
}

// Khoảng cách từ tâm bóng xuống đáy giỏ
function balloonBottomOffset() {
  const b = CONFIG.balloon;
  return b.radius + b.ropeLength + b.basketHeight;
}

// Vẽ khinh khí cầu tại vị trí hiện tại.
// faded = true → vẽ mờ (dùng cho hiệu ứng nhấp nháy khi bất tử)
// hasLetter = false → không vẽ phong thư trên giỏ (thư đã giao)
export function drawBalloon(ctx, balloon, faded = false, hasLetter = true) {
  const b = CONFIG.balloon;
  const c = CONFIG.colors;
  const { x, y } = balloon;
  const r = b.radius;

  ctx.save();
  if (faded) ctx.globalAlpha = 0.35;

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

  // --- Ngọn lửa đèn khò: hiện ngay sau mỗi lần phụt lửa ---
  if (balloon.flameTimer > 0) {
    const flameBottom = basketTop - 1;
    const flameHeight = b.ropeLength + r * 0.15;
    ctx.fillStyle = c.flameOuter;
    ctx.beginPath();
    ctx.moveTo(x - 5, flameBottom);
    ctx.quadraticCurveTo(x, flameBottom - flameHeight * 1.4, x + 5, flameBottom);
    ctx.fill();
    ctx.fillStyle = c.flameInner;
    ctx.beginPath();
    ctx.moveTo(x - 2.5, flameBottom);
    ctx.quadraticCurveTo(x, flameBottom - flameHeight * 0.9, x + 2.5, flameBottom);
    ctx.fill();
  }

  // --- Giỏ ---
  ctx.fillStyle = c.balloonBasket;
  ctx.fillRect(x - b.basketWidth / 2, basketTop, b.basketWidth, b.basketHeight);

  // --- Phong thư nhỏ gắn trên giỏ (dấu hiệu "giao thư") ---
  if (hasLetter) drawLetter(ctx, x, basketTop + b.basketHeight / 2, 1);

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

  ctx.restore(); // bỏ hiệu ứng mờ
}

// Hiệu ứng vỡ: các mảnh bóng bay tung ra rồi rơi, giỏ rơi xuống.
// t = số giây kể từ lúc vỡ. Hướng bay của các mảnh cố định (không ngẫu nhiên).
export function drawBurst(ctx, balloon, t) {
  const b = CONFIG.balloon;
  const c = CONFIG.colors;
  const { x, y } = balloon;
  const fall = 0.5 * 400 * t * t; // rơi nhanh dần theo thời gian

  // Vòng "bụp" lan ra rồi mờ đi
  if (t < 0.3) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - t / 0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, b.radius + t * 120, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 10 mảnh bóng bay ra theo 10 hướng
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + 0.3;
    const speed = 90 + (i % 3) * 30;
    const px = x + Math.cos(angle) * speed * t;
    const py = y + Math.sin(angle) * speed * t + fall;
    ctx.fillStyle = i % 2 === 0 ? c.balloonMain : c.balloonStripe;
    ctx.beginPath();
    ctx.moveTo(px, py - 6);
    ctx.lineTo(px + 6, py + 5);
    ctx.lineTo(px - 5, py + 4);
    ctx.closePath();
    ctx.fill();
  }

  // Giỏ (có phong thư) rơi thẳng xuống
  const groundY = CONFIG.worldHeight - CONFIG.level.groundHeight;
  const basketTop = Math.min(y + b.radius + b.ropeLength + fall, groundY - b.basketHeight); // dừng trên mặt đất
  ctx.fillStyle = c.balloonBasket;
  ctx.fillRect(x - b.basketWidth / 2, basketTop, b.basketWidth, b.basketHeight);
}

// Vẽ một lá thư (phong bì) có tâm tại (cx, cy). size = 1 là cỡ gắn trên giỏ.
export function drawLetter(ctx, cx, cy, size = 1) {
  const b = CONFIG.balloon;
  const c = CONFIG.colors;
  const ew = b.basketWidth * 0.6 * size;
  const eh = b.basketHeight * 0.55 * size;
  const ex = cx - ew / 2;
  const ey = cy - eh / 2;
  ctx.fillStyle = c.envelope;
  ctx.fillRect(ex, ey, ew, eh);
  ctx.strokeStyle = c.envelopeLine;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(cx, ey + eh * 0.6);
  ctx.lineTo(ex + ew, ey);
  ctx.stroke();
}
