// ui.js — chữ và nút hiện trên màn hình (không phải phần chơi).
//
// Hiện có: dòng hướng dẫn ở màn hình chờ. Các bước sau sẽ thêm nút "Chơi lại", "Hồi sinh"...

import { CONFIG } from './config.js';

export function drawUi(ctx) {
  ctx.fillStyle = CONFIG.colors.title;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText('Chạm để bắt đầu · mỗi lần chạm = phụt lửa', CONFIG.worldWidth / 2, 140);
}
