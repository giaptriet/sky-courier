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
// Mỗi chướng ngại gồm một đám mây đen lơ lửng phía trên và một tòa tháp phía dưới, chừa khe ở giữa.
// Phía trên mây đen vẫn là trời trống. Mây đen cao khoảng 75, khinh khí cầu cao khoảng 85:
// khe càng cao thì khoảng trống phía trên mây càng hẹp → bay vượt lên trên rất khó qua.

export const LEVEL_1 = {
  name: 'Chuyến thư đầu tiên',

  obstacles: [
    // 0–4 giây đầu: trời trống ngắn để làm quen việc chạm
    // (chướng ngại đầu tiên hiện ra ở mép phải màn hình khoảng giây thứ 1)

    // 4–15 giây: 4 chướng ngại khe rộng, xen kẽ CAO – THẤP → bay theo đường lượn sóng
    { x: 410,  gapCenter: 260, gapSize: 230 }, // cao: mây sát trần, không vượt lên trên được
    { x: 710,  gapCenter: 350, gapSize: 230 }, // thấp: phía trên mây còn chỗ, nhưng sẽ khó qua cái sau
    { x: 1010, gapCenter: 260, gapSize: 230 }, // cao
    { x: 1310, gapCenter: 350, gapSize: 230 }, // thấp → sau đó hạ dần xuống bưu cục

    // 15–18 giây: khoảng trống ngắn, vừa đủ để hạ dần xuống sân bưu cục
  ],

  landing: { x: 1610, width: 150 }, // ≈ 18 giây bay; sân rộng 150 ≈ 1,7 giây để đáp
};
