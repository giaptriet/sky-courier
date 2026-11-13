// level3.js — DỮ LIỆU chặng 3 "Nhịp bay" (xem docs/TRAINING_LEVELS.md).
// Dạy: căn nhịp — khe đổi độ cao NHANH hơn và các chướng ngại GẦN nhau hơn, phải chuẩn bị trước.
// Khe không hẹp hơn chặng 2 (độ khó đến từ nhịp, không phải từ khe hẹp).
// Đoạn 1 cách nhau 240 (lệch 80) → đoạn 2 cách 240 (lệch 100) → đoạn 3 cách 230 (lệch 90).
// Cách đọc số: xem src/levels/index.js.

export const LEVEL_3 = {
  name: 'Nhịp bay',
  intro: 'Chướng ngại dày hơn, đổi độ cao nhanh hơn. Hãy nhìn trước!',

  hints: [
    { x: 60, text: 'Nhìn trước chướng ngại tiếp theo!' },
  ],

  obstacles: [
    // Đoạn 1 (4–11 giây): cách nhau 240, lên xuống vừa phải
    { x: 400, gapCenter: 280, gapSize: 220 },
    { x: 640, gapCenter: 360, gapSize: 220 },
    { x: 880, gapCenter: 280, gapSize: 220 },

    // Nghỉ khoảng 3 giây

    // Đoạn 2 (14–24 giây): cách nhau 240, lên xuống mạnh hơn (lệch 100)
    { x: 1250, gapCenter: 260, gapSize: 230 },
    { x: 1490, gapCenter: 360, gapSize: 230 },
    { x: 1730, gapCenter: 260, gapSize: 230 },
    { x: 1970, gapCenter: 360, gapSize: 230 },

    // Nghỉ khoảng 3 giây

    // Đoạn 3 (26–35 giây): cách nhau 230 — nhịp nhanh nhất (lệch ~90)
    // Lưu ý: sau mỗi cú chạm, khinh khí cầu còn bay lên ~0,9 giây. Chướng ngại sát nhau quá
    // (dưới ~220) thì không kịp chuyển từ khe cao xuống khe thấp.
    { x: 2350, gapCenter: 270, gapSize: 230 },
    { x: 2580, gapCenter: 360, gapSize: 230 },
    { x: 2810, gapCenter: 270, gapSize: 230 },
    { x: 3040, gapCenter: 350, gapSize: 230 },

    // Khoảng 4 giây để hạ xuống bưu cục
  ],

  landing: { x: 3420, width: 150 }, // ≈ 39 giây bay
};
