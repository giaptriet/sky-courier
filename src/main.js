// main.js — khởi động game và chạy "vòng lặp game".
//
// Vòng lặp game: lặp liên tục, mỗi vòng gồm 2 việc:
//   1. update(): tính toán (vị trí, va chạm...) — chạy đúng CONFIG.updatesPerSecond lần mỗi giây
//   2. draw():   vẽ lại màn hình theo trạng thái hiện tại
// Hiện có: màn hình chờ (chạm để bắt đầu), khinh khí cầu điều khiển bằng cách chạm,
// chặng 1 trôi ngang với chướng ngại. Các bước sau thêm va chạm, đích, hồi sinh...

import { CONFIG } from './config.js';
import { createBalloon, updateBalloon, drawBalloon } from './balloon.js';
import { createInput, takePresses } from './input.js';
import { drawUi } from './ui.js';
import { createLevel, updateLevel, drawClouds, drawObstacles, drawGround } from './level.js';
import { LEVEL_1 } from './levels/level1.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ---------- Co giãn khung hình cho vừa màn hình ----------
// Thế giới game luôn rộng worldWidth × cao worldHeight.
// Ta tính tỉ lệ phóng to sao cho khung dọc vừa khít màn hình, giữ nguyên tỉ lệ.
let scale = 1;

function resize() {
  const w = CONFIG.worldWidth;
  const h = CONFIG.worldHeight;
  scale = Math.min(window.innerWidth / w, window.innerHeight / h);

  // Màn hình điện thoại có mật độ điểm ảnh cao: vẽ chi tiết hơn để chữ không bị mờ.
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.style.width = `${Math.floor(w * scale)}px`;
  canvas.style.height = `${Math.floor(h * scale)}px`;
  canvas.width = Math.floor(w * scale * pixelRatio);
  canvas.height = Math.floor(h * scale * pixelRatio);

  // Từ đây trở đi, mọi lệnh vẽ dùng tọa độ thế giới game (0..360, 0..640).
  ctx.setTransform(scale * pixelRatio, 0, 0, scale * pixelRatio, 0, 0);
}

window.addEventListener('resize', resize);
resize();

// ---------- Cập nhật trạng thái ----------
const balloon = createBalloon();
const level = createLevel(LEVEL_1);
const input = createInput(canvas);

// Trạng thái game: 'ready' = đang chờ lần chạm đầu tiên; 'flying' = đang bay
let state = 'ready';

function update(dt) {
  const presses = takePresses(input);

  if (state === 'ready') {
    // Chờ người chơi sẵn sàng: khinh khí cầu đứng yên, cảnh chưa trôi
    if (presses === 0) return;
    state = 'flying';
  }

  updateLevel(level, dt);
  updateBalloon(balloon, dt, presses);
}

// ---------- Vẽ ----------
function draw() {
  const w = CONFIG.worldWidth;
  const h = CONFIG.worldHeight;

  // Bầu trời: chuyển màu từ trên xuống dưới
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, CONFIG.colors.skyTop);
  sky.addColorStop(1, CONFIG.colors.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  drawClouds(ctx, level);
  drawObstacles(ctx, level);
  drawGround(ctx, level);
  drawBalloon(ctx, balloon);

  // Tiêu đề và hướng dẫn: chỉ hiện ở màn hình chờ
  if (state === 'ready') {
    ctx.fillStyle = CONFIG.colors.title;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText('Sky Courier', w / 2, h * 0.12);
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('Khinh khí cầu giao thư', w / 2, h * 0.12 + 36);
    drawUi(ctx);
  }
}

// ---------- Vòng lặp với bước thời gian cố định ----------
// Dù máy nhanh hay chậm, update() luôn được gọi với cùng một khoảng thời gian (dt),
// nhờ vậy chuyển động giống nhau trên mọi máy và tua lùi khi hồi sinh sẽ chính xác.
const dt = 1 / CONFIG.updatesPerSecond;
let lastTime = performance.now();
let leftover = 0; // thời gian thực đã trôi qua nhưng chưa được update()

function loop(now) {
  // Giới hạn 0.25 giây để khi chuyển tab rồi quay lại, game không "nhảy cóc"
  leftover += Math.min((now - lastTime) / 1000, 0.25);
  lastTime = now;

  while (leftover >= dt) {
    update(dt);
    leftover -= dt;
  }
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// Chỉ dùng để kiểm thử tự động (đọc vị trí khinh khí cầu); không ảnh hưởng tới cách chơi.
window.skyCourier = { balloon, level, getState: () => state };
