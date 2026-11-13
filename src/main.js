// main.js — khởi động game và chạy "vòng lặp game".
//
// Vòng lặp game: lặp liên tục, mỗi vòng gồm 2 việc:
//   1. update(): tính toán (vị trí, va chạm...) — chạy đúng CONFIG.updatesPerSecond lần mỗi giây
//   2. draw():   vẽ lại màn hình theo trạng thái hiện tại
// Các trạng thái của game (biến state):
//   'ready'     — màn hình chờ, chạm để bắt đầu
//   'flying'    — đang bay
//   'crashed'   — vừa vỡ: hiệu ứng vỡ, rồi hiện nút Hồi sinh / Chơi lại
//   'rewinding' — đang tua lùi (sau khi bấm Hồi sinh)
//   'resume'    — tua xong, chờ chạm để bay tiếp (đang bất tử)
//   'delivered' — đã đáp đúng sân bưu cục: lá thư bay vào hòm thư, rồi hiện "Đã giao thư!"
//   'missed'    — bay vượt qua bưu cục mà không đáp: được đi tiếp nhưng thư chưa giao

import { CONFIG } from './config.js';
import {
  createBalloon, updateBalloon, drawBalloon, drawBurst, balloonHitbox, keepInsideScreen, drawLetter,
} from './balloon.js';
import { createInput, takePresses } from './input.js';
import {
  drawReadyScreen, drawCrashMenu, hitCrashMenu, drawRewindingText, drawResumeText,
  drawProgressBar, drawDeliveredPanel, drawMissedPanel, hitReplayButton,
} from './ui.js';
import {
  createLevel, updateLevel, drawClouds, drawObstacles, drawGround,
  findCollision, obstacleContactDistance,
  drawPostOffice, touchesGround, isOverLandingPad, passedLandingPad, levelProgress, mailboxSlot,
} from './level.js';
import { createHistory, clearHistory, recordFrame, startRewind, stepRewind } from './rewind.js';
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

// ---------- Trạng thái game ----------
const balloon = createBalloon();
const level = createLevel(LEVEL_1);
const history = createHistory();

let state = 'ready';
let revivesLeft = CONFIG.revive.perLevel; // lượt hồi sinh còn lại trong chặng này
let crashTimer = 0;       // đã bao lâu kể từ lúc vỡ (giây)
let invincible = false;   // đang bất tử sau khi hồi sinh?
let invincibleUntil = 0;  // bay tới quãng đường này thì hết bất tử
let blinkTimer = 0;       // dùng cho hiệu ứng nhấp nháy
let deliveredTimer = 0;   // đã bao lâu kể từ lúc đáp xuống sân bưu cục (giây)

// Khung kết thúc chặng: "Đã giao thư!" hiện sau khi lá thư bay vào hòm thư xong;
// "Bay qua bưu cục rồi!" hiện ngay.
function endPanelVisible() {
  if (state === 'missed') return true;
  return state === 'delivered' && deliveredTimer >= CONFIG.level.letterFlyTime;
}

// Khung "vỡ rồi" chỉ hiện sau khi hiệu ứng vỡ chạy xong
function crashMenuVisible() {
  return state === 'crashed' && crashTimer >= CONFIG.revive.burstTime;
}

// Mọi cú nhấn khi đang vỡ / đang tua đều dành cho nút, không tính là phụt lửa
const input = createInput(canvas, (x, y) => {
  if (crashMenuVisible()) {
    const choice = hitCrashMenu(x, y, revivesLeft);
    if (choice === 'revive') revive();
    if (choice === 'restart') restartLevel();
    return true;
  }
  if (endPanelVisible()) {
    if (hitReplayButton(x, y)) restartLevel();
    return true;
  }
  return state === 'crashed' || state === 'rewinding' || state === 'delivered';
});

// ---------- Các hành động ----------

// Vỡ: ghi nhớ đã đâm vào đâu để biết lúc nào hết bất tử nếu hồi sinh
function crash(hit) {
  state = 'crashed';
  crashTimer = 0;
  invincibleUntil = hit.kind === 'obstacle'
    ? obstacleContactDistance(level, hit.index) // gặp lại đúng chướng ngại đó
    : level.distance;                           // đâm đất/trần: tới đúng chỗ vừa đâm
}

function revive() {
  revivesLeft -= 1;
  startRewind(history);
  state = 'rewinding';
}

function restartLevel() {
  Object.assign(balloon, createBalloon());
  level.distance = 0;
  clearHistory(history);
  revivesLeft = CONFIG.revive.perLevel;
  invincible = false;
  state = 'ready';
}

// ---------- Cập nhật mỗi bước ----------
function update(dt) {
  const presses = takePresses(input);
  blinkTimer += dt;

  if (state === 'ready' || state === 'resume') {
    // Chờ người chơi chạm: khinh khí cầu đứng yên, cảnh chưa trôi
    if (presses === 0) return;
    state = 'flying';
  }

  if (state === 'crashed') {
    crashTimer += dt;
    // Trên máy tính: phím Space = bấm nút chính (Hồi sinh nếu còn lượt, không thì Chơi lại)
    if (presses > 0 && crashMenuVisible()) {
      if (revivesLeft > 0) revive();
      else restartLevel();
    }
    return;
  }

  if (state === 'delivered' || state === 'missed') {
    deliveredTimer += dt;
    // Trên máy tính: phím Space = Chơi lại chặng
    if (presses > 0 && endPanelVisible()) restartLevel();
    return;
  }

  if (state === 'rewinding') {
    if (stepRewind(history, level, balloon)) {
      invincible = true;
      state = 'resume';
    }
    return;
  }

  // state === 'flying'
  updateLevel(level, dt);
  updateBalloon(balloon, dt, presses);
  recordFrame(history, level, balloon);

  const hitbox = balloonHitbox(balloon);

  // Giỏ chạm đất NẰM TRỌN trong sân bưu cục → đáp thành công, giao thư
  // (kiểm tra trước va chạm, vì chạm đất ở chỗ khác mới là vỡ)
  if (touchesGround(hitbox) && isOverLandingPad(level, hitbox)) {
    keepInsideScreen(balloon); // đặt giỏ nằm ngay trên mặt đất
    invincible = false;
    deliveredTimer = 0;
    state = 'delivered';
    return;
  }

  // Bay vượt qua bưu cục mà không đáp → được đi tiếp, nhưng thư chưa giao
  if (passedLandingPad(level, hitbox)) {
    invincible = false;
    state = 'missed';
    return;
  }

  if (invincible && level.distance >= invincibleUntil) invincible = false;

  if (invincible) {
    keepInsideScreen(balloon); // bất tử: xuyên qua chướng ngại, nhưng không ra khỏi màn hình
    return;
  }

  const hit = findCollision(level, hitbox);
  if (hit) crash(hit);
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
  drawPostOffice(ctx, level);

  if (state === 'crashed') {
    drawBurst(ctx, balloon, Math.min(crashTimer, CONFIG.revive.burstTime));
  } else if (state === 'delivered') {
    drawBalloon(ctx, balloon, false, false);
    drawFlyingLetter();
  } else {
    // Nhấp nháy khi bất tử
    const blinkOff = Math.floor(blinkTimer * CONFIG.revive.blinkPerSecond * 2) % 2 === 1;
    drawBalloon(ctx, balloon, invincible && blinkOff);
  }

  if (state !== 'ready' && !endPanelVisible()) drawProgressBar(ctx, levelProgress(level));
  if (state === 'ready') drawReadyScreen(ctx);
  if (state === 'delivered' && endPanelVisible()) {
    drawDeliveredPanel(ctx, level.data.name, CONFIG.revive.perLevel - revivesLeft);
  }
  if (state === 'missed') drawMissedPanel(ctx);
  if (crashMenuVisible()) drawCrashMenu(ctx, revivesLeft);
  if (state === 'rewinding') drawRewindingText(ctx);
  if (state === 'resume') drawResumeText(ctx);
}

// Lá thư bay theo đường cong từ giỏ khinh khí cầu vào khe hòm thư
function drawFlyingLetter() {
  const t = Math.min(1, deliveredTimer / CONFIG.level.letterFlyTime);
  if (t >= 1) return; // đã vào hòm thư
  const b = CONFIG.balloon;
  const from = { x: balloon.x, y: balloon.y + b.radius + b.ropeLength + b.basketHeight / 2 };
  const to = mailboxSlot(level);
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 60; // vồng lên một chút
  drawLetter(ctx, x, y, 1.6);
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
window.skyCourier = {
  balloon, level, history,
  getState: () => state,
  getInfo: () => ({ revivesLeft, invincible, invincibleUntil }),
};
