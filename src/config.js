// config.js — NƠI CHỨA MỌI CON SỐ TINH CHỈNH CỦA GAME.
// Muốn thử cảm giác khác, chỉ cần sửa số ở đây rồi tải lại trang (F5).
// Không cần đụng vào các file khác.

export const CONFIG = {
  // --- Khung hình ---
  // Kích thước "thế giới game" (đơn vị tự đặt, không phải pixel thật).
  // Khung dọc tỉ lệ 9:16 giống điện thoại. Game tự co giãn cho vừa màn hình.
  worldWidth: 360,
  worldHeight: 640,

  // --- Vòng lặp game ---
  // Số lần cập nhật mỗi giây. Cố định để chuyển động giống nhau trên mọi máy.
  updatesPerSecond: 60,

  // --- Màu sắc (tạm thời, sẽ thay bằng hình vẽ sau) ---
  colors: {
    skyTop: '#7ec8f2',    // màu trời phía trên
    skyBottom: '#fde7c4', // màu trời sát chân trời
    title: '#1b2a3a',     // màu chữ tiêu đề
  },
};
