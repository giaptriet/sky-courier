// index.js — DANH SÁCH CÁC CHẶNG theo thứ tự chơi.
// Thiết kế từng chặng: docs/TRAINING_LEVELS.md
//
// Mỗi chặng là một khối dữ liệu gồm:
//   name      = tên chặng
//   intro     = một câu giới thiệu hiện ở màn hình chờ
//   hints     = lời hướng dẫn ngắn hiện ra khi bay tới vị trí x: [{ x, text }]
//   obstacles = danh sách chướng ngại (xem 3 kiểu bên dưới)
//   landing   = sân bưu cục ở cuối chặng: { x: mép trái, width: độ rộng }
//
// Đơn vị: màn hình trôi 90 đơn vị mỗi giây (scrollSpeed trong config.js) → x: 900 ≈ giây thứ 10.
// Độ cao: 0 = mép trên màn hình, 600 = mặt đất. Khinh khí cầu cao khoảng 85, mây đen cao khoảng 75.
//
// 3 kiểu chướng ngại:
//   cổng:      { x, gapCenter, gapSize }     mây đen phía trên khe + tháp phía dưới khe
//                                            gapCenter = độ cao tâm khe, gapSize = khe rộng bao nhiêu
//   chỉ mây:   { type: 'cloud', x, bottom }  một đám mây đen lơ lửng, đáy mây ở độ cao bottom
//   chỉ tháp:  { type: 'tower', x, top }     một tòa tháp, đỉnh mái ở độ cao top

import { LEVEL_1 } from './level1.js';
import { LEVEL_2 } from './level2.js';
import { LEVEL_3 } from './level3.js';
import { LEVEL_4 } from './level4.js';
import { LEVEL_5 } from './level5.js';

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];
