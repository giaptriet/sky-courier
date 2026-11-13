// level1.js — DỮ LIỆU chặng 1 "Chuyến thư đầu tiên" (xem docs/TRAINING_LEVELS.md).
//
// Muốn đổi chặng, chỉ sửa số trong file này rồi tải lại trang. Không cần sửa code khác.
//
// Cách đọc số:
//   x         = chướng ngại cách điểm xuất phát bao xa. Màn hình trôi 90 đơn vị mỗi giây
//               (scrollSpeed trong config.js), nên x: 900 ≈ gặp sau 10 giây.
//   gapCenter = độ cao TÂM của khe bay (0 = mép trên màn hình, 600 = mặt đất).
//   gapSize   = khe bay rộng bao nhiêu. Khinh khí cầu cao khoảng 90, nên khe 250 là rất rộng.
//   landing   = sân bưu cục ở cuối chặng: x = mép trái của sân, width = sân rộng bao nhiêu.
//               Phải ĐÁP khinh khí cầu xuống trong sân mới giao được thư.
//               Chạm đất ngoài sân = vỡ. Bay vượt qua sân = được đi tiếp nhưng thư chưa giao.
//               Sân càng hẹp càng khó đáp (giỏ khinh khí cầu rộng khoảng 20).
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

    // 20–27 giây: trời trống để hồi nhịp, rồi hạ dần xuống sân bưu cục
  ],

  landing: { x: 2450, width: 150 }, // ≈ 27 giây bay; sân rộng 150 ≈ 1,7 giây để đáp
};
