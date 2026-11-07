// input.js — nhận thao tác của người chơi: chạm màn hình, chuột, phím Space.
//
// File này chỉ ghi lại 2 điều, rồi để các file khác quyết định ý nghĩa:
//   - held:    người chơi có ĐANG giữ ngón tay / chuột / phím Space không
//   - presses: số lần người chơi VỪA nhấn xuống kể từ lần cập nhật trước
//
// Riêng khi nhấn trúng một nút trên màn hình (ví dụ nút đổi kiểu điều khiển),
// cú nhấn đó dành cho nút, không tính là điều khiển khinh khí cầu.

import { CONFIG } from './config.js';

// canvas:    tấm vải vẽ của game
// onUiPress: hàm được gọi khi nhấn, nhận tọa độ trong thế giới game;
//            trả về true nếu cú nhấn trúng một nút (khi đó bỏ qua, không tính là bay)
export function createInput(canvas, onUiPress) {
  const input = { held: false, presses: 0 };

  const activePointers = new Set(); // các ngón tay / chuột đang giữ
  let spaceDown = false;

  function refreshHeld() {
    input.held = activePointers.size > 0 || spaceDown;
  }

  // Đổi tọa độ trên màn hình thật sang tọa độ thế giới game (0..360, 0..640)
  function toWorld(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CONFIG.worldWidth,
      y: ((event.clientY - rect.top) / rect.height) * CONFIG.worldHeight,
    };
  }

  // "pointer" = gộp chung chạm tay và chuột
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const { x, y } = toWorld(event);
    if (onUiPress(x, y)) return; // nhấn trúng nút → không tính là bay
    activePointers.add(event.pointerId);
    input.presses += 1;
    refreshHeld();
  });

  // Nghe ở cả cửa sổ để thả tay ra ngoài khung game vẫn được tính là thả
  function release(event) {
    activePointers.delete(event.pointerId);
    refreshHeld();
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  window.addEventListener('keydown', (event) => {
    if (event.code !== 'Space') return;
    event.preventDefault();
    if (event.repeat) return; // giữ phím lâu: máy tự gửi lặp lại, không tính là nhấn mới
    spaceDown = true;
    input.presses += 1;
    refreshHeld();
  });

  window.addEventListener('keyup', (event) => {
    if (event.code !== 'Space') return;
    spaceDown = false;
    refreshHeld();
  });

  // Chuyển sang ứng dụng khác giữa chừng → coi như đã thả tay
  window.addEventListener('blur', () => {
    activePointers.clear();
    spaceDown = false;
    refreshHeld();
  });

  return input;
}

// Lấy số lần nhấn đã gom được rồi đặt lại về 0 (mỗi cú nhấn chỉ được dùng một lần)
export function takePresses(input) {
  const count = input.presses;
  input.presses = 0;
  return count;
}
