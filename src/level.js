// level.js — chặng chơi: cho màn hình trôi ngang, vẽ chướng ngại, mặt đất và mây.
//
// Cách "cuộn ngang" hoạt động: khinh khí cầu thực ra đứng yên theo chiều ngang trên màn hình.
// Chính cảnh vật trôi từ phải sang trái, tạo cảm giác khinh khí cầu đang bay về phía trước.
// distance = quãng đường đã bay; vị trí trên màn hình của một vật = vị trí của nó − distance.
//
// Mọi chặng dùng chung file này; khác nhau chỉ ở dữ liệu trong thư mục src/levels/.

import { CONFIG } from './config.js';

export function createLevel(levelData) {
  return {
    data: levelData,
    distance: 0, // quãng đường đã bay (đơn vị thế giới game)
  };
}

export function updateLevel(level, dt) {
  level.distance += CONFIG.level.scrollSpeed * dt;
}

// Độ cao mặt đất (y của mép trên mặt đất)
export function groundTop() {
  return CONFIG.worldHeight - CONFIG.level.groundHeight;
}

// Đổi vị trí trong chặng sang vị trí trên màn hình.
// Cộng thêm startX để chướng ngại có x = 0 nằm ngay chỗ khinh khí cầu lúc xuất phát.
function toScreenX(level, x) {
  return x - level.distance + CONFIG.balloon.startX;
}

// ---------- Va chạm ----------

// Kiểm tra khinh khí cầu có đâm vào gì không.
// hitbox lấy từ balloonHitbox() trong balloon.js.
// Trả về null nếu không đâm, hoặc { kind, index }:
//   kind = 'obstacle' (index = số thứ tự chướng ngại trong dữ liệu chặng), 'ground' hoặc 'ceiling'
export function findCollision(level, hitbox) {
  const { circle, basket } = hitbox;

  if (circle.y - circle.r < 0) return { kind: 'ceiling', index: -1 };
  if (basket.y + basket.h > groundTop()) return { kind: 'ground', index: -1 };

  const w = CONFIG.level.obstacleWidth;
  const obstacles = level.data.obstacles;
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    const sx = toScreenX(level, ob.x);
    if (sx > CONFIG.worldWidth || sx + w < 0) continue; // ở xa, bỏ qua

    const gapTop = ob.gapCenter - ob.gapSize / 2;
    const gapBottom = ob.gapCenter + ob.gapSize / 2;
    const parts = [
      { x: sx, y: 0, w, h: gapTop },                           // mây giông phía trên
      { x: sx, y: gapBottom, w, h: groundTop() - gapBottom },  // tháp phía dưới
    ];
    for (const part of parts) {
      if (circleHitsRect(circle, part) || rectHitsRect(basket, part)) {
        return { kind: 'obstacle', index: i };
      }
    }
  }
  return null;
}

// Quãng đường (distance) mà tại đó khinh khí cầu chạm tới mép trước của chướng ngại số index
export function obstacleContactDistance(level, index) {
  return level.data.obstacles[index].x - CONFIG.balloon.radius;
}

function circleHitsRect(c, r) {
  // Tìm điểm trong hình chữ nhật gần tâm hình tròn nhất, rồi đo khoảng cách
  const nearestX = Math.max(r.x, Math.min(c.x, r.x + r.w));
  const nearestY = Math.max(r.y, Math.min(c.y, r.y + r.h));
  const dx = c.x - nearestX;
  const dy = c.y - nearestY;
  return dx * dx + dy * dy < c.r * c.r;
}

function rectHitsRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ---------- Khu vực nhận thư (đích) ----------

// Đã bay tới khu vực nhận thư chưa? (tâm khinh khí cầu chạm giữa dải vàng)
export function reachedFinish(level) {
  return level.distance >= level.data.finishX;
}

// Tiến độ chặng: 0 = vừa xuất phát, 1 = tới khu vực nhận thư
export function levelProgress(level) {
  return Math.min(1, level.distance / level.data.finishX);
}

// Vị trí khe nhận thư trên hòm thư (tọa độ màn hình) — để vẽ lá thư bay vào
export function mailboxSlot(level) {
  const x = toScreenX(level, level.data.finishX) + MAILBOX_OFFSET;
  return { x: x + 9, y: groundTop() - MAILBOX_HEIGHT + 8 };
}

const MAILBOX_OFFSET = 52;  // hòm thư nằm bên phải dải vàng một chút
const MAILBOX_HEIGHT = 48;

// Vẽ dải vàng "nhận thư", hòm thư và tòa bưu điện
export function drawFinish(ctx, level) {
  const c = CONFIG.colors;
  const zoneW = CONFIG.level.deliveryZoneWidth;
  const ground = groundTop();
  const cx = toScreenX(level, level.data.finishX); // giữa dải vàng
  if (cx - zoneW > CONFIG.worldWidth) return;      // còn ở xa, chưa cần vẽ

  // Dải vàng từ trời xuống đất, hai mép nét đứt
  ctx.fillStyle = c.deliveryZone;
  ctx.fillRect(cx - zoneW / 2, 0, zoneW, ground);
  ctx.strokeStyle = c.deliveryZoneEdge;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(cx - zoneW / 2, 0);
  ctx.lineTo(cx - zoneW / 2, ground);
  ctx.moveTo(cx + zoneW / 2, 0);
  ctx.lineTo(cx + zoneW / 2, ground);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = c.title;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('NHẬN', cx, 60);
  ctx.fillText('THƯ', cx, 76);

  // Tòa bưu điện bên phải dải vàng
  const bx = cx + 75;
  const bw = 140;
  const bh = 150;
  const by = ground - bh;
  ctx.fillStyle = c.postOfficeWall;
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = c.postOfficeRoof;
  ctx.beginPath();
  ctx.moveTo(bx - 10, by);
  ctx.lineTo(bx + bw / 2, by - 40);
  ctx.lineTo(bx + bw + 10, by);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = c.postOfficeRoof;
  ctx.fillRect(bx + 15, by + 15, bw - 30, 26);
  ctx.fillStyle = c.postOfficeSign;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillText('BƯU ĐIỆN', bx + bw / 2, by + 29);
  ctx.fillStyle = c.postOfficeDoor;
  ctx.fillRect(bx + bw / 2 - 18, ground - 56, 36, 56);

  // Hòm thư đỏ
  const mx = cx + MAILBOX_OFFSET;
  ctx.fillStyle = c.mailbox;
  ctx.fillRect(mx, ground - MAILBOX_HEIGHT, 18, MAILBOX_HEIGHT);
  ctx.beginPath();
  ctx.arc(mx + 9, ground - MAILBOX_HEIGHT, 9, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = c.title;
  ctx.fillRect(mx + 3, ground - MAILBOX_HEIGHT + 6, 12, 3); // khe bỏ thư
}

// ---------- Vẽ ----------

// Mây trang trí ở phía xa. Trôi chậm hơn cảnh gần (hiệu ứng chiều sâu).
// Vị trí mây tính bằng công thức cố định (không ngẫu nhiên) để lần chơi nào cũng giống nhau.
export function drawClouds(ctx, level) {
  const L = CONFIG.level;
  const spacing = 170;
  const offset = level.distance * L.cloudSpeedFactor;
  const first = Math.floor(offset / spacing) - 1;
  ctx.fillStyle = CONFIG.colors.cloud;
  for (let i = first; i < first + CONFIG.worldWidth / spacing + 3; i++) {
    const x = i * spacing - offset + ((i * 53) % 60);
    const y = 190 + ((i * 97) % 220);
    const size = 18 + ((i * 31) % 14);
    ctx.beginPath();
    ctx.ellipse(x, y, size * 1.8, size, 0, 0, Math.PI * 2);
    ctx.ellipse(x + size * 1.2, y - size * 0.4, size * 1.1, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawObstacles(ctx, level) {
  const L = CONFIG.level;
  const c = CONFIG.colors;
  const w = L.obstacleWidth;
  const ground = groundTop();

  for (const ob of level.data.obstacles) {
    const sx = toScreenX(level, ob.x);
    if (sx + w < 0 || sx > CONFIG.worldWidth) continue; // ngoài màn hình thì không vẽ

    const gapTop = ob.gapCenter - ob.gapSize / 2;
    const gapBottom = ob.gapCenter + ob.gapSize / 2;

    drawStormCloud(ctx, sx, w, gapTop);
    drawTower(ctx, sx, w, gapBottom, ground);
  }
}

// Phía trên khe: mây giông, từ mép trên màn hình xuống tới khe (đáy mây gợn tròn)
function drawStormCloud(ctx, x, w, bottom) {
  const bump = w * 0.3; // bán kính 3 gợn tròn ở đáy mây
  ctx.fillStyle = CONFIG.colors.stormCloud;
  ctx.fillRect(x, 0, w, bottom - bump);
  ctx.beginPath();
  for (const part of [0.22, 0.5, 0.78]) {
    const cx = x + w * part;
    const cy = part === 0.5 ? bottom - bump : bottom - bump * 1.3; // gợn giữa thấp nhất
    ctx.moveTo(cx + bump, cy);
    ctx.arc(cx, cy, bump, 0, Math.PI * 2);
  }
  ctx.fill();
}

// Phía dưới khe: tòa tháp có mái nhọn, từ khe xuống tới mặt đất
function drawTower(ctx, x, w, top, ground) {
  const c = CONFIG.colors;
  const roofHeight = 22;

  // Mái nhọn (đỉnh mái chạm đúng mép dưới của khe)
  ctx.fillStyle = c.towerRoof;
  ctx.beginPath();
  ctx.moveTo(x - 4, top + roofHeight);
  ctx.lineTo(x + w / 2, top);
  ctx.lineTo(x + w + 4, top + roofHeight);
  ctx.closePath();
  ctx.fill();

  // Thân tháp
  ctx.fillStyle = c.towerWall;
  ctx.fillRect(x, top + roofHeight, w, ground - top - roofHeight);

  // Cửa sổ
  ctx.fillStyle = c.towerWindow;
  for (let y = top + roofHeight + 14; y < ground - 24; y += 34) {
    ctx.fillRect(x + w / 2 - 6, y, 12, 16);
  }
}

export function drawGround(ctx, level) {
  const L = CONFIG.level;
  const top = groundTop();
  ctx.fillStyle = CONFIG.colors.ground;
  ctx.fillRect(0, top, CONFIG.worldWidth, L.groundHeight);

  // Vạch trên mặt đất trôi cùng tốc độ với chướng ngại → nhìn thấy rõ đang bay tới
  ctx.fillStyle = CONFIG.colors.groundStripe;
  const spacing = 40;
  const shift = level.distance % spacing;
  for (let x = -shift; x < CONFIG.worldWidth; x += spacing) {
    ctx.fillRect(x, top + 8, 20, 4);
  }
}
