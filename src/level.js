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
    if (sx - 20 > CONFIG.worldWidth || sx + w + 20 < 0) continue; // ở xa, bỏ qua (mây tràn ra 2 bên ~15)

    const gapTop = ob.gapCenter - ob.gapSize / 2;
    const gapBottom = ob.gapCenter + ob.gapSize / 2;
    // Mây đen phía trên: kiểm tra từng cục mây tròn (đúng với hình vẽ)
    for (const puff of stormCloudPuffs(ob, sx, w, gapTop)) {
      if (circleHitsCircle(circle, puff) || circleHitsRect(puff, basket)) {
        return { kind: 'obstacle', index: i };
      }
    }

    // Tháp phía dưới
    const tower = { x: sx, y: gapBottom, w, h: groundTop() - gapBottom };
    if (circleHitsRect(circle, tower) || rectHitsRect(basket, tower)) {
      return { kind: 'obstacle', index: i };
    }
  }
  return null;
}

// Quãng đường (distance) mà tại đó khinh khí cầu chạm tới mép trước của chướng ngại số index.
// Mây đen hơi tràn ra hai bên chướng ngại, nên lấy mép trái của cục mây xa nhất.
export function obstacleContactDistance(level, index) {
  const ob = level.data.obstacles[index];
  const w = CONFIG.level.obstacleWidth;
  const gapTop = ob.gapCenter - ob.gapSize / 2;
  let leftEdge = 0;
  for (const puff of stormCloudPuffs(ob, 0, w, gapTop)) {
    leftEdge = Math.min(leftEdge, puff.x - puff.r);
  }
  return ob.x + leftEdge - CONFIG.balloon.radius;
}

// Đám mây đen gồm nhiều "cục mây" tròn chồng lên nhau, từ mép trên màn hình xuống tới khe.
// Vị trí các cục mây tính bằng công thức cố định theo ob.x (không ngẫu nhiên),
// nên mỗi đám mây trông hơi khác nhau nhưng lần chơi nào cũng giống hệt.
//   sx = mép trái chướng ngại trên màn hình, w = bề ngang, bottom = mép trên của khe bay
function stormCloudPuffs(ob, sx, w, bottom) {
  const puffs = [];
  const big = w * 0.42;

  // Hàng dưới cùng: 3 cục to; cục giữa chạm đúng mép trên của khe
  puffs.push({ x: sx + w * 0.12, y: bottom - big * 0.85 - 6, r: big * 0.85 });
  puffs.push({ x: sx + w * 0.5, y: bottom - big, r: big });
  puffs.push({ x: sx + w * 0.88, y: bottom - big * 0.8 - 4, r: big * 0.8 });

  // Các hàng phía trên: mỗi hàng 2 cục, lệch trái/phải khác nhau để mép mây gồ ghề
  let row = 0;
  for (let y = bottom - big * 1.9; y > -big; y -= 30) {
    const wobble = (((ob.x / 10 + row * 7) % 5) - 2) * 3; // −6..+6, cố định theo vị trí
    const r1 = big * (0.8 + ((row * 3) % 4) * 0.06);
    const r2 = big * (0.75 + ((row * 5) % 4) * 0.06);
    puffs.push({ x: sx + w * 0.28 + wobble, y, r: r1 });
    puffs.push({ x: sx + w * 0.72 - wobble * 0.5, y: y - 10, r: r2 });
    row++;
  }
  return puffs;
}

function circleHitsRect(c, r) {
  // Tìm điểm trong hình chữ nhật gần tâm hình tròn nhất, rồi đo khoảng cách
  const nearestX = Math.max(r.x, Math.min(c.x, r.x + r.w));
  const nearestY = Math.max(r.y, Math.min(c.y, r.y + r.h));
  const dx = c.x - nearestX;
  const dy = c.y - nearestY;
  return dx * dx + dy * dy < c.r * c.r;
}

function circleHitsCircle(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const rr = a.r + b.r;
  return dx * dx + dy * dy < rr * rr;
}

function rectHitsRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ---------- Sân bưu cục (đích) ----------
// Cuối chặng có một sân bưu cục trên mặt đất (dữ liệu: level.data.landing).
//   - Giỏ chạm đất mà NẰM TRỌN trong sân → đáp thành công, giao thư.
//   - Giỏ chạm đất ngoài sân (kể cả lấn một phần ra ngoài) → vỡ như đâm đất bình thường.
//   - Bay vượt qua sân mà không đáp → "bay qua bưu cục": được đi tiếp, nhưng thư chưa giao.

// Vị trí của giỏ tính theo quãng đường trong chặng (không phải trên màn hình)
function basketSpan(level, hitbox) {
  const left = level.distance + (hitbox.basket.x - CONFIG.balloon.startX);
  return { left, right: left + hitbox.basket.w };
}

// Giỏ có đang chạm mặt đất không.
// Dùng đáy giỏ THẬT (không thu nhỏ như vùng va chạm) để khinh khí cầu đang nằm trên đất
// (ví dụ lúc bất tử) vẫn được tính là đã đáp.
export function touchesGround(hitbox) {
  return hitbox.basket.y + CONFIG.balloon.basketHeight >= groundTop() - 0.01;
}

// Giỏ có nằm trọn trong sân bưu cục không
export function isOverLandingPad(level, hitbox) {
  const pad = level.data.landing;
  const { left, right } = basketSpan(level, hitbox);
  return left >= pad.x && right <= pad.x + pad.width;
}

// Đã bay vượt qua sân bưu cục chưa
export function passedLandingPad(level, hitbox) {
  const pad = level.data.landing;
  return basketSpan(level, hitbox).left > pad.x + pad.width + CONFIG.level.passMargin;
}

// Tiến độ chặng: 0 = vừa xuất phát, 1 = tới giữa sân bưu cục
export function levelProgress(level) {
  const pad = level.data.landing;
  return Math.min(1, level.distance / (pad.x + pad.width / 2));
}

const MAILBOX_HEIGHT = 48;

// Hòm thư đứng ngay bên phải sân. Trả về vị trí khe bỏ thư (tọa độ màn hình)
function mailboxX(level) {
  const pad = level.data.landing;
  return toScreenX(level, pad.x + pad.width) + 8;
}
export function mailboxSlot(level) {
  return { x: mailboxX(level) + 9, y: groundTop() - MAILBOX_HEIGHT + 8 };
}

// Vẽ tòa bưu cục, sân đáp có vạch, biển "ĐÁP Ở ĐÂY" và hòm thư
export function drawPostOffice(ctx, level) {
  const c = CONFIG.colors;
  const pad = level.data.landing;
  const ground = groundTop();
  const sx = toScreenX(level, pad.x);
  if (sx > CONFIG.worldWidth || sx + pad.width + 40 < 0) return; // ngoài màn hình

  // Tòa bưu cục (phía sau sân; khinh khí cầu bay ngang qua phía trước, không va chạm)
  const bx = sx + 10;
  const bw = pad.width - 20;
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
  ctx.fillRect(bx + 12, by + 15, bw - 24, 26);
  ctx.fillStyle = c.postOfficeSign;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillText('BƯU CỤC', bx + bw / 2, by + 29);
  ctx.fillStyle = c.postOfficeDoor;
  ctx.fillRect(bx + bw / 2 - 18, ground - 56, 36, 56);

  // Sân đáp: dải vàng có vạch chéo trên mặt đất, hai đầu có cọc
  ctx.fillStyle = c.landingPad;
  ctx.fillRect(sx, ground, pad.width, 10);
  ctx.fillStyle = c.landingPadStripe;
  for (let x = sx + 4; x < sx + pad.width - 8; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, ground + 10);
    ctx.lineTo(x + 6, ground);
    ctx.lineTo(x + 10, ground);
    ctx.lineTo(x + 4, ground + 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillRect(sx - 3, ground - 18, 4, 18);
  ctx.fillRect(sx + pad.width - 1, ground - 18, 4, 18);

  // Biển chỉ dẫn phía trên sân
  ctx.fillStyle = c.title;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('ĐÁP Ở ĐÂY', sx + pad.width / 2, 62);
  ctx.beginPath();
  ctx.moveTo(sx + pad.width / 2 - 10, 76);
  ctx.lineTo(sx + pad.width / 2 + 10, 76);
  ctx.lineTo(sx + pad.width / 2, 90);
  ctx.closePath();
  ctx.fill();

  // Hòm thư đỏ bên phải sân
  const mx = mailboxX(level);
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
    if (sx + w + 20 < 0 || sx - 20 > CONFIG.worldWidth) continue; // ngoài màn hình thì không vẽ

    const gapTop = ob.gapCenter - ob.gapSize / 2;
    const gapBottom = ob.gapCenter + ob.gapSize / 2;

    drawStormCloud(ctx, stormCloudPuffs(ob, sx, w, gapTop));
    drawTower(ctx, sx, w, gapBottom, ground);
  }
}

// Phía trên khe: đám mây đen, vẽ từ các cục mây tròn (xem stormCloudPuffs)
function drawStormCloud(ctx, puffs) {
  const c = CONFIG.colors;

  // Lớp bóng tối hơn, lệch xuống dưới một chút → mây có khối
  ctx.fillStyle = c.stormCloudShadow;
  ctx.beginPath();
  for (const p of puffs) {
    ctx.moveTo(p.x + p.r, p.y + 3);
    ctx.arc(p.x, p.y + 3, p.r, 0, Math.PI * 2);
  }
  ctx.fill();

  // Lớp mây chính
  ctx.fillStyle = c.stormCloud;
  ctx.beginPath();
  for (const p of puffs) {
    ctx.moveTo(p.x + p.r, p.y);
    ctx.arc(p.x, p.y, p.r * 0.94, 0, Math.PI * 2);
  }
  ctx.fill();

  // Vệt sáng nhỏ trên đỉnh mỗi cục mây
  ctx.fillStyle = c.stormCloudLight;
  ctx.beginPath();
  for (const p of puffs) {
    ctx.moveTo(p.x - p.r * 0.15 + p.r * 0.35, p.y - p.r * 0.35);
    ctx.arc(p.x - p.r * 0.15, p.y - p.r * 0.35, p.r * 0.35, 0, Math.PI * 2);
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
