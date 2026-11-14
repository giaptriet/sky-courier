# Kế hoạch bản chơi thử (MVP)

Mục tiêu MVP: **chơi được chặng 1 trên điện thoại qua một đường link**, đủ để trả lời 2 câu hỏi:
1. Điều khiển khinh khí cầu có vui không?
2. Luật (bay đến đích, va chạm, hồi sinh tua lùi) có dễ hiểu không?

Phạm vi theo `docs/GAME_DESIGN.md` mục 4. Không làm kho hồi sinh, vật phẩm, bưu thiếp, nâng cấp, khu vực mới, thử thách ngày.

Trạng thái: ⬜ chưa làm · 🟨 đang làm · ✅ xong (đã kiểm tra)

---

## Giai đoạn 0 — Chuẩn bị (không code)

| # | Việc | Trạng thái |
|---|------|-----------|
| 0.1 | Viết gọn thiết kế (`docs/GAME_DESIGN.md`), quy tắc (`CLAUDE.md`), kế hoạch này | ✅ |
| 0.2 | Người dùng xác nhận công nghệ + câu hỏi mở (xem cuối file) | ✅ |
| 0.3 | **Thiết kế trên giấy 5 chặng huấn luyện**: mỗi chặng dạy gì, chướng ngại nào, độ dài, lời hướng dẫn. Người dùng duyệt trước khi code → bản nháp `docs/TRAINING_LEVELS.md` | ✅ |

## Giai đoạn 1 — Khinh khí cầu bay được

| # | Việc | Người dùng kiểm tra bằng mắt |
|---|------|------------------------------|
| 1.1 | ✅ Trang có khung hình dọc + bầu trời + chữ "Sky Courier" | Mở link → thấy nền trời, không lỗi |
| 1.2 | ✅ Vẽ khinh khí cầu, rơi xuống chậm khi không chạm | Khinh khí cầu từ từ hạ xuống |
| 1.3 | ✅ Làm **2 kiểu điều khiển** để so sánh: *chạm = phụt lửa* và *giữ = đốt liên tục*; có nút chuyển kiểu trên màn hình | Thử cả hai kiểu, giữ được độ cao với mỗi kiểu |
| 1.4 | ✅ Đưa mọi con số vào `src/config.js`; người dùng tự sửa trên GitHub: `gravity` 120→150, `maxFallSpeed` 120→140 | Đổi lực nâng → bay lên mạnh/yếu hơn |

👉 **Điểm dừng kiểm chứng #1**: cảm giác bay đã dễ chịu chưa? **Chọn 1 trong 2 kiểu điều khiển** → ✅ đã chọn **Chạm** (2026-11-07). Chỉnh số trong config cho tới khi thấy ổn.

## Giai đoạn 2 — Chặng có đầu có cuối

| # | Việc | Người dùng kiểm tra bằng mắt |
|---|------|------------------------------|
| 2.1 | ✅ Màn hình cuộn ngang, xuất hiện chướng ngại tĩnh (mây đen lơ lửng phía trên khe, cùng kiểu dáng mây trắng + tháp phía dưới); có màn hình chờ "chạm để bắt đầu" | Chướng ngại trôi từ phải sang trái |
| 2.2 | ✅ Va chạm với chướng ngại / mặt đất → **khinh khí cầu vỡ** (chạm trần chỉ bị chặn lại, không vỡ — đổi 2026-11-14), hiện "Chơi lại" *(làm cùng Giai đoạn 3 theo yêu cầu người dùng)* | Đâm vào → dừng, có nút chơi lại |
| 2.3 | Chặng đọc từ file dữ liệu `src/levels/level1.js` (*file đã tạo ở 2.1; còn lại: người dùng tự sửa thử*) | Sửa vị trí 1 chướng ngại trong file → thấy thay đổi |
| 2.4 | ✅ Sân bưu cục cuối chặng: **phải đáp đúng sân** mới giao được thư (chạm đất ngoài sân = vỡ; bay qua = "Bay qua bưu cục rồi!", thư chưa giao) + thanh tiến độ + lá thư bay vào hòm + màn "Đã giao thư!" | Bay hết chặng → thấy màn hoàn thành |

## Giai đoạn 3 — Hồi sinh tua lùi (phiên bản prototype)

| # | Việc | Người dùng kiểm tra bằng mắt |
|---|------|------------------------------|
| 3.1 | ✅ Ghi lại vị trí khinh khí cầu vài giây gần nhất | (bên trong, chưa thấy gì) |
| 3.2 | ✅ Va chạm → hỏi "Hồi sinh? (còn 1)" hoặc "Chơi lại" | Thấy lựa chọn sau khi đâm |
| 3.3 | ✅ Hồi sinh → tua lùi **5 giây** (giá trị tạm trong config), bất tử (nhấp nháy) | Thấy tua lại, khinh khí cầu nhấp nháy |
| 3.4 | ✅ Bất tử tắt khi tới đúng chướng ngại đã đâm | Đến chướng ngại đó thì hết nhấp nháy, đâm lần nữa là thua |
| 3.5 | ✅ 1 lượt/chặng, cấp lại khi chơi lại hoặc sang chặng mới | Hồi sinh lần 2 trong cùng chặng không được |

👉 **Điểm dừng kiểm chứng #2**: tua lùi có dễ hiểu không? Chọn số giây tua lùi chính thức.

## Giai đoạn 3b — Chặng 2–5 *(người dùng yêu cầu làm trước khi chơi thử)*

| # | Việc | Người dùng kiểm tra bằng mắt |
|---|------|------------------------------|
| 3b.1 | ✅ Danh sách chặng, nút "Chặng tiếp theo" / "Đi tiếp", hết chặng 5 → "Về chặng 1"; lượt hồi sinh cấp lại mỗi chặng | Giao thư xong bấm "Chặng tiếp theo" → thấy "Chặng 2/5" |
| 3b.2 | ✅ Lời hướng dẫn ngắn trong chặng (dải tối ở đáy màn hình) | Thấy câu nhắc khi bay tới chỗ có yếu tố mới |
| 3b.3 | ✅ Kiểu chướng ngại mới: chỉ mây / chỉ tháp (dùng cho ngã rẽ chặng 5) | Chặng 5 thấy dãy mây đen chia 2 đường |
| 3b.4 | ✅ Dữ liệu chặng 2–5; chạy thử tự động: mọi chặng đều qua được bằng kỹ năng | Chơi lần lượt 5 chặng |
| 3b.5 | ✅ Thử nhanh 1 chặng bằng đường link: thêm `?chang=3` | Mở link có `?chang=3` → vào thẳng chặng 3 |

## Giai đoạn 4 — Chơi thử thật trên điện thoại

| # | Việc | Người dùng kiểm tra bằng mắt |
|---|------|------------------------------|
| 4.1 | Hướng dẫn ngắn đầu chặng 1 ("Chạm để làm nóng khí, bay lên") | Thấy chữ hướng dẫn, biến mất khi bắt đầu |
| 4.2 | Đưa lên GitHub Pages — *làm sớm từ sau bước 1.1 (người dùng yêu cầu)*: kho chuyển Công khai, Pages lấy từ nhánh đang làm | Mở https://giaptriet.github.io/sky-courier/ trên điện thoại chơi được |
| 4.3 | Nhờ 2–3 người chơi thử, ghi lại: có hiểu luật không, chết ở đâu, có muốn chơi lại không | Bảng ghi chú phản hồi |

👉 **Điểm dừng quyết định**: vui → làm tiếp chặng 2–5 (mỗi chặng 1 bước nhỏ). Chưa vui → chỉnh điều khiển trước, chưa mở rộng.

## Sau MVP (chưa lên lịch)

Chặng 2–5 · kho hồi sinh 3 lượt + vật phẩm · hình vẽ/âm thanh thật · rồi mới tới các mục [ĐỊNH HƯỚNG].

---

## Quyết định đã nhận (2026-11-07)

1. **Nền tảng prototype**: game web mở bằng trình duyệt điện thoại (chưa phải app).
2. **Điều khiển**: làm cả 2 kiểu để chơi so sánh → người dùng chọn **Chạm** (khó hơn, đòi hỏi kỹ năng hơn). Đã bỏ kiểu Giữ và nút đổi kiểu.
3. **Tua lùi**: tạm 3 giây → người dùng đổi thành **5 giây**; khi va chạm khinh khí cầu vỡ; giữ 1 lượt/chặng và luật bất tử đã chốt.
4. **Đăng game**: chuyển kho sang Công khai, bật GitHub Pages ngay từ bây giờ để thử từng bước trên điện thoại.
