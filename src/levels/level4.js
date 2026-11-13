// level4.js — DỮ LIỆU chặng 4 "Thêm một cơ hội" (xem docs/TRAINING_LEVELS.md).
// Dạy: hồi sinh tua lùi. Nửa đầu dễ (ôn tập), rồi MỘT ĐOẠN KHÓ rõ ràng mà nhiều người sẽ đâm lần đầu.
// Khi đâm, khung "vỡ rồi" đã có sẵn lời giải thích cách hồi sinh.
// Cách đọc số: xem src/levels/index.js.

export const LEVEL_4 = {
  name: 'Thêm một cơ hội',
  intro: 'Phía trước có một đoạn khó. Vỡ thì cứ bình tĩnh hồi sinh!',

  hints: [
    { x: 1150, text: 'Đoạn khó! Nếu vỡ, bạn được hồi sinh 1 lần.' },
  ],

  obstacles: [
    // Nửa đầu (4–12 giây): ôn tập, khe rộng
    { x: 400,  gapCenter: 300, gapSize: 230 },
    { x: 700,  gapCenter: 340, gapSize: 230 },
    { x: 1000, gapCenter: 290, gapSize: 230 },

    // Nghỉ khoảng 5 giây, có lời nhắc

    // ĐOẠN KHÓ (17–28 giây): khe hẹp hơn (180), cách nhau 230, lên xuống mạnh (lệch ~95)
    { x: 1500, gapCenter: 255, gapSize: 180 },
    { x: 1730, gapCenter: 350, gapSize: 180 },
    { x: 1960, gapCenter: 255, gapSize: 180 },
    { x: 2190, gapCenter: 350, gapSize: 180 },
    { x: 2420, gapCenter: 270, gapSize: 180 },

    // Nghỉ rồi hạ xuống bưu cục
  ],

  landing: { x: 2830, width: 140 }, // ≈ 33 giây bay
};
