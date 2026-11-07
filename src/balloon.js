// balloon.js — khinh khí cầu: vị trí, chuyển động và cách vẽ.
//
// Chuyển động (kiểu điều khiển đã chốt: CHẠM):
//   - Luôn có "trọng lực" kéo khinh khí cầu xuống từ từ.
//   - Mỗi lần chạm = một lần phụt lửa, khinh khí cầu được đẩy lên một đoạn.
// Tạm thời khinh khí cầu dừng lại ở mép trên màn hình và trên mặt đất.
// (Chạm đất/trần/chướng ngại = thua sẽ làm ở bước 2.2.)

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

  // Trọng lực luôn kéo xuống
  balloon.vy += b.gravity * dt;

  // Giới hạn tốc độ rơi: hạ xuống nhẹ nhàng, không rơi như hòn đá
  balloon.vy = Math.min(balloon.vy, b.maxFallSpeed);
  balloon.y += balloon.vy * dt;

  balloon.flameTimer = Math.max(0, balloon.flameTimer - dt);

  // Tạm thời: giữ khinh khí cầu trong màn hình, đứng trên mặt đất
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
