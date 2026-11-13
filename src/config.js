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
    gravity: 150,       // trọng lực khi ĐANG BAY LÊN: càng lớn, mỗi lần chạm bay lên càng thấp
    fallGravity: 400,   // trọng lực khi ĐANG RƠI: càng lớn, càng nhanh đạt tốc độ rơi tối đa
    maxFallSpeed: 140,  // tốc độ rơi tối đa: càng nhỏ, hạ xuống càng nhẹ nhàng
    tapLift: 130,       // mỗi lần chạm đẩy lên mạnh cỡ nào (càng lớn bay lên càng cao)
    flameShowTime: 0.15, // ngọn lửa hiện bao lâu sau mỗi lần phụt (giây)
    radius: 30,         // bán kính thân bóng
    ropeLength: 14,     // độ dài dây treo giỏ
    basketWidth: 22,    // kích thước giỏ
    basketHeight: 16,
    hitboxScale: 0.85,  // vùng tính va chạm nhỏ hơn hình vẽ bao nhiêu (1 = bằng đúng hình; nhỏ hơn = dễ thở hơn)
  },

  // --- Vỡ và hồi sinh ---
  revive: {
    perLevel: 1,             // số lượt hồi sinh mỗi chặng (luật prototype đã chốt)
    rewindSeconds: 5,        // tua lùi về bao nhiêu giây trước lúc vỡ (TẠM — người dùng chọn 5, chỉnh sau khi chơi thử)
    rewindPlaybackSpeed: 4,  // cảnh tua ngược chạy nhanh gấp mấy lần bình thường
    burstTime: 0.9,          // hiệu ứng vỡ kéo dài bao lâu trước khi hiện lựa chọn (giây)
    blinkPerSecond: 8,       // khi bất tử, khinh khí cầu nhấp nháy bao nhiêu lần mỗi giây
  },

  // --- Chặng chơi ---
  level: {
    scrollSpeed: 90,        // cảnh vật trôi bao nhiêu đơn vị mỗi giây (càng lớn bay càng nhanh)
    obstacleWidth: 56,      // bề ngang mỗi chướng ngại
    groundHeight: 40,       // độ dày mặt đất ở đáy màn hình
    cloudSpeedFactor: 0.3,  // mây ở xa trôi chậm bằng mấy phần so với cảnh gần
    passMargin: 60,         // bay quá mép phải sân bưu cục bao xa thì tính là "đã bay qua bưu cục"
    letterFlyTime: 0.9,     // lá thư bay từ giỏ vào hòm thư mất bao lâu (giây)
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
    stormCloud: '#4a5361',       // mây đen (chướng ngại phía trên)
    stormCloudShadow: '#363d48', // phần tối dưới đáy mây
    stormCloudLight: '#525b69',  // vệt sáng nhẹ trên đỉnh mây
    towerWall: '#d9c6a5',     // tháp (chướng ngại phía dưới)
    towerRoof: '#b5523b',
    towerWindow: '#6b5a45',
    ground: '#7fa65a',        // mặt đất
    groundStripe: '#6a8f48',
    cloud: 'rgba(255, 255, 255, 0.7)',
    landingPad: '#f6c344',              // sân đáp trước bưu cục
    landingPadStripe: '#1b2a3a',
    postOfficeWall: '#f3e3c3',          // bưu điện
    postOfficeRoof: '#2f6f8f',
    postOfficeDoor: '#7a5230',
    postOfficeSign: '#ffffff',
    mailbox: '#d64545',                 // hòm thư
    progressBack: 'rgba(27, 42, 58, 0.25)', // thanh tiến độ
    progressFill: '#1b2a3a',
    panel: 'rgba(27, 42, 58, 0.85)',   // khung thông báo (vỡ / giao thư xong)
    panelText: '#ffffff',
    buttonPrimary: '#f6c344',          // nút chính (Hồi sinh)
    buttonPrimaryText: '#1b2a3a',
    buttonSecondary: '#ffffff',        // nút phụ (Chơi lại)
    buttonSecondaryText: '#1b2a3a',
  },
};
