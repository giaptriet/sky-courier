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
    // 0–5 giây đầu: trời trống ngắn để làm quen việc chạm
    // (chướng ngại đầu tiên hiện ra ở mép phải màn hình khoảng giây thứ 2)

    // 5–16 giây: vài chướng ngại khe rất rộng, cùng một độ cao → tập giữ độ cao
    { x: 500,  gapCenter: 320, gapSize: 250 },
    { x: 800,  gapCenter: 320, gapSize: 250 },
    { x: 1100, gapCenter: 320, gapSize: 250 },
    { x: 1400, gapCenter: 320, gapSize: 250 },

    // 16–19 giây: khoảng trống ngắn, vừa đủ để hạ dần xuống sân bưu cục
  ],

  landing: { x: 1700, width: 150 }, // ≈ 19 giây bay; sân rộng 150 ≈ 1,7 giây để đáp
};
