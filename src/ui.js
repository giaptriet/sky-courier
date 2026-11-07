// ui.js — các nút và chữ hiện trên màn hình (không phải phần chơi).
//
// Bước 1.3: một nút ở góc dưới bên phải để đổi kiểu điều khiển (Chạm ↔ Giữ),
// và một dòng hướng dẫn ngắn. Nút này chỉ dùng để chơi so sánh trong prototype;
// khi đã chọn xong kiểu điều khiển sẽ bỏ đi.

import { CONFIG } from './config.js';

// Vị trí và kích thước nút đổi kiểu (tọa độ thế giới game)
const modeButton = { x: 228, y: 590, width: 120, height: 38 };

const MODE_LABELS = {
  tap: 'Kiểu: Chạm',
  hold: 'Kiểu: Giữ',
};

const MODE_HINTS = {
  tap: 'Chạm để phụt lửa, bay lên',
  hold: 'Giữ để đốt lửa, thả ra để hạ',
};

// Kiểm tra một cú nhấn tại (x, y) có trúng nút đổi kiểu không
export function hitModeButton(x, y) {
  const b = modeButton;
  return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
}

export function nextMode(mode) {
  return mode === 'tap' ? 'hold' : 'tap';
}

export function drawUi(ctx, mode) {
  const c = CONFIG.colors;
  const b = modeButton;

  // Dòng hướng dẫn
  ctx.fillStyle = c.title;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(MODE_HINTS[mode], CONFIG.worldWidth / 2, 140);

  // Nút đổi kiểu
  ctx.fillStyle = c.buttonFill;
  roundedRect(ctx, b.x, b.y, b.width, b.height, 10);
  ctx.fill();
  ctx.fillStyle = c.buttonText;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(MODE_LABELS[mode], b.x + b.width / 2, b.y + b.height / 2 + 1);
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
