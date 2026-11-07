// input.js — nhận thao tác của người chơi: chạm màn hình, chuột, phím Space.
//
// Kiểu điều khiển đã chốt: CHẠM — mỗi lần nhấn xuống = một lần phụt lửa.
// File này chỉ đếm số lần người chơi VỪA nhấn xuống kể từ lần cập nhật trước;
// balloon.js quyết định khinh khí cầu phản ứng ra sao.
//
// onUiPress: hàm được gọi khi nhấn, nhận tọa độ trong thế giới game; trả về true nếu
// cú nhấn trúng một nút trên màn hình (khi đó không tính là phụt lửa).
// Hiện chưa có nút nào, nhưng sau này sẽ có (ví dụ nút "Chơi lại", "Hồi sinh").

import { CONFIG } from './config.js';

export function createInput(canvas, onUiPress = () => false) {
  const input = { presses: 0 };

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
    if (onUiPress(x, y)) return; // nhấn trúng nút → không tính là phụt lửa
    input.presses += 1;
  });

  window.addEventListener('keydown', (event) => {
    if (event.code !== 'Space') return;
    event.preventDefault();
    if (event.repeat) return; // giữ phím lâu: máy tự gửi lặp lại, không tính là nhấn mới
    input.presses += 1;
  });

  return input;
}

// Lấy số lần nhấn đã gom được rồi đặt lại về 0 (mỗi cú nhấn chỉ được dùng một lần)
export function takePresses(input) {
  const count = input.presses;
  input.presses = 0;
  return count;
}
