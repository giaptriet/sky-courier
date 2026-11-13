// ui.js — chữ và nút hiện trên màn hình (không phải phần chơi).
//
// Gồm:
//   - Màn hình chờ: tiêu đề + hướng dẫn
//   - Khung "Khinh khí cầu vỡ rồi!" với nút Hồi sinh / Chơi lại
//   - Dòng chữ khi đang tua lùi và khi chờ bay tiếp
//   - Thanh tiến độ chặng, lời hướng dẫn trong chặng
//   - Khung kết thúc chặng: "Đã giao thư!" / "Bay qua bưu cục rồi!" với nút Chặng tiếp theo / Chơi lại

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
// levelNumber bắt đầu từ 1; levelData = dữ liệu chặng (lấy name, intro)
export function drawReadyScreen(ctx, levelNumber, levelCount, levelData) {
  const c = CONFIG.colors.title;
  setText(ctx, c, 'bold 34px');
  ctx.fillText('Sky Courier', W / 2, 60);
  setText(ctx, c, '16px');
  ctx.fillText('Khinh khí cầu giao thư', W / 2, 92);

  setText(ctx, c, 'bold 20px');
  ctx.fillText(`Chặng ${levelNumber}/${levelCount}: ${levelData.name}`, W / 2, 132);
  setText(ctx, c, '14px');
  wrapText(ctx, levelData.intro || '', W / 2, 158, W - 40, 19);
  setText(ctx, c, 'bold 15px');
  ctx.fillText('Chạm để bắt đầu · mỗi lần chạm = phụt lửa', W / 2, 210);
}

// ---------- Lời hướng dẫn trong chặng (nằm trên dải cỏ ở đáy màn hình) ----------
export function drawHint(ctx, text) {
  const c = CONFIG.colors;
  ctx.fillStyle = c.panel;
  roundedRect(ctx, 14, H - 78, W - 28, 32, 10);
  ctx.fill();
  setText(ctx, c.panelText, 'bold 14px');
  ctx.fillText(text, W / 2, H - 61);
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

// ---------- Khung kết thúc chặng ----------
// Hai nút: nút chính (Chặng tiếp theo / Đi tiếp / Về chặng 1) và nút phụ (Chơi lại chặng)
const nextButton = { x: (W - BUTTON_W) / 2, y: 310, w: BUTTON_W, h: BUTTON_H };
const replayButton = { x: (W - BUTTON_W) / 2, y: 372, w: BUTTON_W, h: BUTTON_H };

// isLast = đây là chặng cuối cùng
export function drawDeliveredPanel(ctx, levelName, revivesUsed, isLast) {
  const c = CONFIG.colors;
  drawEndPanelBox(ctx);
  setText(ctx, c.panelText, isLast ? 'bold 21px' : 'bold 26px');
  ctx.fillText(isLast ? 'Hoàn thành huấn luyện! 🎉' : 'Đã giao thư! ✉️', W / 2, 228);
  setText(ctx, c.panelText, '15px');
  ctx.fillText(`Hoàn thành: ${levelName}`, W / 2, 260);
  ctx.fillText(revivesUsed > 0 ? `Đã dùng ${revivesUsed} lượt hồi sinh` : 'Không cần hồi sinh!', W / 2, 282);
  drawEndButtons(ctx, isLast ? 'Về chặng 1' : 'Chặng tiếp theo');
}

// Khi bay vượt qua sân bưu cục mà không đáp
export function drawMissedPanel(ctx, isLast) {
  const c = CONFIG.colors;
  drawEndPanelBox(ctx);
  setText(ctx, c.panelText, 'bold 24px');
  ctx.fillText('Bay qua bưu cục rồi!', W / 2, 225);
  setText(ctx, c.panelText, '14px');
  ctx.fillText('Thư chưa được giao. Bạn được đi tiếp,', W / 2, 256);
  ctx.fillText('nhưng chuyến này không được tính điểm.', W / 2, 276);
  drawEndButtons(ctx, isLast ? 'Về chặng 1' : 'Đi tiếp');
}

function drawEndPanelBox(ctx) {
  ctx.fillStyle = CONFIG.colors.panel;
  roundedRect(ctx, 30, 190, W - 60, 250, 16);
  ctx.fill();
}

function drawEndButtons(ctx, nextLabel) {
  const c = CONFIG.colors;
  drawButton(ctx, nextButton, nextLabel, c.buttonPrimary, c.buttonPrimaryText);
  drawButton(ctx, replayButton, 'Chơi lại chặng', c.buttonSecondary, c.buttonSecondaryText);
}

// Cú nhấn trúng nút nào của khung kết thúc chặng: 'next', 'replay' hoặc null
export function hitEndPanel(x, y) {
  if (inside(nextButton, x, y)) return 'next';
  if (inside(replayButton, x, y)) return 'replay';
  return null;
}

// ---------- Hàm phụ ----------
// Viết chữ dài, tự xuống dòng khi quá rộng
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

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
