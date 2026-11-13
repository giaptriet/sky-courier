// level1.js — DỮ LIỆU chặng 1 "Chuyến thư đầu tiên" (xem docs/TRAINING_LEVELS.md).
//
// Muốn đổi chặng, chỉ sửa số trong file này rồi tải lại trang. Không cần sửa code khác.
//
// Cách đọc số:
//   x         = chướng ngại cách điểm xuất phát bao xa. Màn hình trôi 90 đơn vị mỗi giây
//               (scrollSpeed trong config.js), nên x: 900 ≈ gặp sau 10 giây.
//   gapCenter = độ cao TÂM của khe bay (0 = mép trên màn hình, 600 = mặt đất).
//   gapSize   = khe bay rộng bao nhiêu. Khinh khí cầu cao khoảng 90, nên khe 250 là rất rộng.
//   finishX   = vị trí khu vực nhận thư (bưu điện). Bay tới đây là hoàn thành chặng.
// Mỗi chướng ngại gồm mây giông phía trên và một tòa tháp phía dưới, chừa khe ở giữa.

export const LEVEL_1 = {
  name: 'Chuyến thư đầu tiên',

  obstacles: [
    // 0–10 giây đầu: trời trống để làm quen việc chạm

    // 10–20 giây: vài chướng ngại khe rất rộng, cùng một độ cao → tập giữ độ cao
    { x: 900,  gapCenter: 320, gapSize: 250 },
    { x: 1200, gapCenter: 320, gapSize: 250 },
    { x: 1500, gapCenter: 320, gapSize: 250 },
    { x: 1800, gapCenter: 320, gapSize: 250 },

    // 20–28 giây: trời trống để hồi nhịp, rồi tới khu vực nhận thư
  ],

  finishX: 2500, // ≈ 28 giây bay
};
