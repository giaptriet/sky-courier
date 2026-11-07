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

  // --- Khinh khí cầu ---
  balloon: {
    startX: 110,        // vị trí ngang lúc bắt đầu (lệch trái để sau này nhìn thấy chướng ngại phía trước)
    startY: 260,        // vị trí dọc lúc bắt đầu (0 = mép trên, 640 = mép dưới)
    gravity: 120,       // trọng lực: càng lớn, tốc độ rơi tăng càng nhanh
    maxFallSpeed: 120,  // tốc độ rơi tối đa: càng nhỏ, hạ xuống càng nhẹ nhàng
    maxRiseSpeed: 120,  // tốc độ bay lên tối đa
    tapLift: 130,       // mỗi lần chạm đẩy lên mạnh cỡ nào (càng lớn bay lên càng cao)
    flameShowTime: 0.15, // ngọn lửa hiện bao lâu sau mỗi lần phụt (giây)
    radius: 30,         // bán kính thân bóng
    ropeLength: 14,     // độ dài dây treo giỏ
    basketWidth: 22,    // kích thước giỏ
    basketHeight: 16,
  },

  // --- Màu sắc (tạm thời, sẽ thay bằng hình vẽ sau) ---
  colors: {
    skyTop: '#7ec8f2',    // màu trời phía trên
    skyBottom: '#fde7c4', // màu trời sát chân trời
    title: '#1b2a3a',     // màu chữ tiêu đề
    balloonMain: '#e85d4a',   // màu chính của bóng
    balloonStripe: '#f6c344', // màu sọc trên bóng
    balloonRope: '#5a4632',   // màu dây
    balloonBasket: '#9b6b3d', // màu giỏ mây
    envelope: '#ffffff',      // phong thư trên giỏ
    envelopeLine: '#9aa7b4',
    flameOuter: '#ff9f1c',    // ngọn lửa đèn khò
    flameInner: '#ffe066',
  },
};
