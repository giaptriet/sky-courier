// level5.js — DỮ LIỆU chặng 5 "Hai đường bay" (xem docs/TRAINING_LEVELS.md).
// "Bài thi tốt nghiệp": ôn lại nhịp của chặng 2–3, rồi một NGÃ RẼ:
//   - đường TRÊN: rộng, an toàn (bay phía trên dãy mây đen)
//   - đường DƯỚI: hẹp (giữa dãy mây đen và dãy tháp) — mạo hiểm.
//     Sau này có thể đặt vật phẩm hồi sinh ở đây; prototype chưa có vật phẩm nên chưa có phần thưởng.
// Sau ngã rẽ là đoạn kết dễ rồi tới bưu cục.
// Cách đọc số: xem src/levels/index.js.

export const LEVEL_5 = {
  name: 'Hai đường bay',
  intro: 'Bài thi cuối! Có một ngã rẽ: chọn đường bạn tự tin nhất.',

  hints: [
    { x: 1330, text: 'Ngã rẽ! Đường trên rộng, đường dưới hẹp.' },
  ],

  obstacles: [
    // Ôn tập (4–13 giây)
    { x: 400,  gapCenter: 280, gapSize: 220 },
    { x: 640,  gapCenter: 360, gapSize: 220 },
    { x: 880,  gapCenter: 270, gapSize: 220 },
    { x: 1120, gapCenter: 360, gapSize: 220 },

    // NGÃ RẼ (18–24 giây): một dãy mây đen nối nhau ở giữa trời (đáy mây ở độ cao 320)
    { type: 'cloud', x: 1650, bottom: 320 },
    { type: 'cloud', x: 1790, bottom: 320 },
    { type: 'cloud', x: 1930, bottom: 320 },
    //   …và một dãy tháp bên dưới (đỉnh mái ở 480) → đường dưới chỉ còn khe 320–480.
    //   Lưu ý: mỗi cú chạm đẩy lên ~56, khe dưới phải đủ chỗ cho khinh khí cầu (~85) + nhịp lên xuống,
    //   nên đừng làm khe dưới hẹp hơn ~160, nếu không sẽ không thể bay qua.
    { type: 'tower', x: 1680, top: 480 },
    { type: 'tower', x: 1820, top: 480 },
    { type: 'tower', x: 1960, top: 480 },

    // Hai đường nhập lại, đoạn kết dễ
    { x: 2350, gapCenter: 300, gapSize: 230 },
    { x: 2600, gapCenter: 330, gapSize: 230 },
  ],

  landing: { x: 2950, width: 130 }, // ≈ 34 giây bay
};
