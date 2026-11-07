// rewind.js — ghi lại hành trình và tua lùi khi hồi sinh.
//
// Cách hoạt động:
//   - Khi đang bay, mỗi lần cập nhật ta chụp lại một "khung hình" gồm: quãng đường đã bay,
//     độ cao và vận tốc của khinh khí cầu. Chỉ giữ lại vài giây gần nhất cho nhẹ máy.
//   - Khi hồi sinh, ta lùi dần qua các khung hình đã chụp (người chơi thấy cảnh tua ngược),
//     tới đúng thời điểm CONFIG.revive.rewindSeconds giây trước lúc vỡ thì dừng.
// Nhờ vòng lặp có bước thời gian cố định, mỗi khung hình luôn cách nhau đúng 1/60 giây.

import { CONFIG } from './config.js';

export function createHistory() {
  return {
    frames: [],       // các khung hình đã chụp, cũ nhất ở đầu
    rewindIndex: -1,  // đang tua tới khung hình nào (−1 = không tua)
    rewindTarget: -1, // tua tới khung hình này thì dừng
  };
}

export function clearHistory(history) {
  history.frames.length = 0;
  history.rewindIndex = -1;
  history.rewindTarget = -1;
}

// Chụp lại trạng thái hiện tại
export function recordFrame(history, level, balloon) {
  history.frames.push({ distance: level.distance, y: balloon.y, vy: balloon.vy });

  // Chỉ giữ đủ số khung hình cho rewindSeconds (+1 giây dự phòng)
  const maxFrames = (CONFIG.revive.rewindSeconds + 1) * CONFIG.updatesPerSecond;
  if (history.frames.length > maxFrames) history.frames.shift();
}

// Bắt đầu tua: xác định cần lùi về khung hình nào.
// Nếu mới bay chưa đủ số giây thì lùi về lúc bắt đầu bay.
export function startRewind(history) {
  const framesBack = CONFIG.revive.rewindSeconds * CONFIG.updatesPerSecond;
  history.rewindIndex = history.frames.length - 1;
  history.rewindTarget = Math.max(0, history.frames.length - 1 - framesBack);
}

// Tua lùi thêm một chút (gọi mỗi lần cập nhật). Trả về true khi đã tua xong.
export function stepRewind(history, level, balloon) {
  history.rewindIndex = Math.max(
    history.rewindTarget,
    history.rewindIndex - CONFIG.revive.rewindPlaybackSpeed,
  );
  applyFrame(history.frames[history.rewindIndex], level, balloon);

  if (history.rewindIndex > history.rewindTarget) return false;

  // Tua xong: bỏ các khung hình "tương lai" đã bị tua qua
  history.frames.length = history.rewindTarget + 1;
  history.rewindIndex = -1;
  history.rewindTarget = -1;
  return true;
}

function applyFrame(frame, level, balloon) {
  level.distance = frame.distance;
  balloon.y = frame.y;
  balloon.vy = frame.vy;
}
