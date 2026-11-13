// ui.js — chữ và nút hiện trên màn hình (không phải phần chơi).
//
// Gồm:
//   - Màn hình chờ: tiêu đề + hướng dẫn
//   - Khung "Khinh khí cầu vỡ rồi!" với nút Hồi sinh / Chơi lại
//   - Dòng chữ khi đang tua lùi và khi chờ bay tiếp
//   - Thanh tiến độ chặng và khung "Đã giao thư!"

import { CONFIG } from './config.js';

const W = CONFIG.worldWidth;
const H = CONFIG.worldHeight;

// Vị trí các nút trong khung thông báo khi vỡ (tọa độ thế giới game)
const BUTTON_W = 220;
const BUTTON_H = 48;
const reviveButton = { x: (W - BUTTON_W) / 2, y: 300, w: BUTTON_W, h: BUTTON_H };
const restartTopButton = { x: (W - BUTTON_W) / 2, y: 300, w: BUTTON_W, h: BUTTON_H }; // khi hết lượt hồi sinh
const restartBottomButton = { x: (W - BUTTON_W) / 2, y: 362, w: BUTTON_W, h: BUTTON_H };

// ---------- Màn hình chờ ----------
export function drawReadyScreen(ctx) {
  setText(ctx, CONFIG.colors.title, 'bold 36px');
  ctx.fillText('Sky Courier', W / 2, H * 0.12);
  setText(ctx, CONFIG.colors.title, '18px');
  ctx.fillText('Khinh khí cầu giao thư', W / 2, H * 0.12 + 36);
  setText(ctx, CONFIG.colors.title, '16px');
  ctx.fillText('Chạm để bắt đầu · mỗi lần chạm = phụt lửa', W / 2, 140);
}

// ---------- Khung khi vỡ ----------
export function drawCrashMenu(ctx, revivesLeft) {
  const c = CONFIG.colors;

  // Khung nền (thấp hơn khi chỉ còn 1 nút)
  ctx.fillStyle = c.panel;
  roundedRect(ctx, 30, 190, W - 60, revivesLeft > 0 ? 250 : 185, 16);
  ctx.fill();

  setText(ctx, c.panelText, 'bold 24px');
  ctx.fillText('Khinh khí cầu vỡ rồi!', W / 2, 225);

  if (revivesLeft > 0) {
    setText(ctx, c.panelText, '14px');
    ctx.fillText(`Hồi sinh: quay lại ${CONFIG.revive.rewindSeconds} giây trước,`, W / 2, 256);
    ctx.fillText('bất tử tới chỗ vừa đâm.', W / 2, 276);
    drawButton(ctx, reviveButton, `Hồi sinh (còn ${revivesLeft})`, c.buttonPrimary, c.buttonPrimaryText);
    drawButton(ctx, restartBottomButton, 'Chơi lại từ đầu', c.buttonSecondary, c.buttonSecondaryText);
  } else {
    setText(ctx, c.panelText, '14px');
    ctx.fillText('Đã hết lượt hồi sinh của chặng này.', W / 2, 262);
    drawButton(ctx, restartTopButton, 'Chơi lại từ đầu', c.buttonPrimary, c.buttonPrimaryText);
  }
}

// Kiểm tra cú nhấn tại (x, y) trúng nút nào trong khung khi vỡ.
// Trả về 'revive', 'restart' hoặc null.
export function hitCrashMenu(x, y, revivesLeft) {
  if (revivesLeft > 0) {
    if (inside(reviveButton, x, y)) return 'revive';
    if (inside(restartBottomButton, x, y)) return 'restart';
  } else if (inside(restartTopButton, x, y)) {
    return 'restart';
  }
  return null;
}

// ---------- Khi đang tua lùi / chờ bay tiếp ----------
export function drawRewindingText(ctx) {
  setText(ctx, CONFIG.colors.title, 'bold 22px');
  ctx.fillText('⏪ Đang tua lại...', W / 2, 120);
}

export function drawResumeText(ctx) {
  setText(ctx, CONFIG.colors.title, 'bold 22px');
  ctx.fillText('Chạm để bay tiếp', W / 2, 110);
  setText(ctx, CONFIG.colors.title, '15px');
  ctx.fillText('Bạn đang bất tử (nhấp nháy) tới chỗ vừa đâm.', W / 2, 140);
  ctx.fillText('Tới đó phải tự vượt qua!', W / 2, 160);
}

// ---------- Thanh tiến độ (trên cùng màn hình) ----------
// progress: 0 = vừa xuất phát, 1 = tới khu vực nhận thư
export function drawProgressBar(ctx, progress) {
  const c = CONFIG.colors;
  const x = 70;
  const w = W - 140;
  const y = 18;
  ctx.fillStyle = c.progressBack;
  roundedRect(ctx, x, y, w, 8, 4);
  ctx.fill();
  ctx.fillStyle = c.progressFill;
  roundedRect(ctx, x, y, Math.max(8, w * progress), 8, 4);
  ctx.fill();
  setText(ctx, c.progressFill, 'bold 12px');
  ctx.textAlign = 'left';
  ctx.fillText('📮', x + w + 6, y + 4);
}

// ---------- Khung "Đã giao thư!" ----------
const replayButton = { x: (W - BUTTON_W) / 2, y: 310, w: BUTTON_W, h: BUTTON_H };

export function drawDeliveredPanel(ctx, levelName, revivesUsed) {
  const c = CONFIG.colors;
  ctx.fillStyle = c.panel;
  roundedRect(ctx, 30, 190, W - 60, 195, 16);
  ctx.fill();

  setText(ctx, c.panelText, 'bold 26px');
  ctx.fillText('Đã giao thư! ✉️', W / 2, 228);
  setText(ctx, c.panelText, '15px');
  ctx.fillText(`Hoàn thành: ${levelName}`, W / 2, 260);
  ctx.fillText(revivesUsed > 0 ? `Đã dùng ${revivesUsed} lượt hồi sinh` : 'Không cần hồi sinh!', W / 2, 282);
  drawButton(ctx, replayButton, 'Chơi lại chặng', c.buttonPrimary, c.buttonPrimaryText);
}

export function hitDeliveredPanel(x, y) {
  return inside(replayButton, x, y);
}

// ---------- Hàm phụ ----------
function setText(ctx, color, size) {
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${size} system-ui, sans-serif`;
}

function drawButton(ctx, b, label, fill, textColor) {
  ctx.fillStyle = fill;
  roundedRect(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  setText(ctx, textColor, 'bold 17px');
  ctx.fillText(label, b.x + b.w / 2, b.y + b.h / 2 + 1);
}

function inside(b, x, y) {
  return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
}

// Vẽ hình chữ nhật bo góc (tự vẽ để chạy được cả trên trình duyệt điện thoại đời cũ)
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
