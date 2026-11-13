// level2.js — DỮ LIỆU chặng 2 "Phố mái nhà" (xem docs/TRAINING_LEVELS.md).
// Dạy: va vào mây đen hay mái tháp là vỡ. Độ cao khe đổi TỪ TỪ theo cụm, giữa các cụm có khoảng nghỉ.
// Cách đọc số: xem src/levels/index.js.

export const LEVEL_2 = {
  name: 'Phố mái nhà',
  intro: 'Khe bay đổi độ cao từ từ. Đừng chạm mây đen hay mái tháp!',

  hints: [
    { x: 60, text: 'Va vào mây đen hay mái tháp là vỡ!' },
  ],

  obstacles: [
    // Cụm 1 (4–12 giây): khe hạ dần từ cao xuống thấp
    { x: 400, gapCenter: 250, gapSize: 220 },
    { x: 650, gapCenter: 300, gapSize: 220 },
    { x: 900, gapCenter: 350, gapSize: 220 },

    // Nghỉ khoảng 4 giây

    // Cụm 2 (15–22 giây): khe nâng dần từ thấp lên cao
    { x: 1350, gapCenter: 360, gapSize: 220 },
    { x: 1600, gapCenter: 300, gapSize: 220 },
    { x: 1850, gapCenter: 250, gapSize: 220 },

    // Khoảng 4 giây trống để hạ xuống bưu cục
  ],

  landing: { x: 2200, width: 160 }, // ≈ 26 giây bay
};
