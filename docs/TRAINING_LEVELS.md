# 5 chặng huấn luyện — ĐÃ DUYỆT (bản nháp, 2026-11-07)

> Trạng thái: người dùng **đã duyệt hướng chung** (trả lời "ok" ngày 2026-11-07). Chi tiết vẫn có thể chỉnh sau khi chơi thử. Mọi con số (độ dài, khoảng cách) là giá trị tạm,
> sẽ đặt trong file dữ liệu chặng và chỉnh sau khi chơi thử.
> Chỉ dùng các yếu tố có trong phạm vi prototype (`docs/GAME_DESIGN.md` mục 4): bay, chướng ngại tĩnh,
> đích, hồi sinh tua lùi 1 lượt/chặng. Không có vật phẩm, kho hồi sinh, nâng cấp, gió.

## Nguyên tắc chung

- Mỗi chặng dạy **đúng 1 điều mới**, hiện **1 câu hướng dẫn ngắn** ngay trước chỗ áp dụng, rồi cho thực hành.
- Chặng ngắn (tạm **30–60 giây**) để thua không nản, thắng thấy thành tựu sớm.
- Kết thúc mỗi chặng: bay tới **bưu điện/hộp thư** → màn "Đã giao thư!".
- Chướng ngại prototype: hình khối đơn giản (cột, tháp, mái nhà, đám mây đen...). Hình vẽ thật để sau.
- Có nhịp **căng – nghỉ**: sau đoạn khó luôn có khoảng trống để thở.

## Bảng tổng quan

| Chặng | Dạy điều gì | Độ dài tạm | Độ khó |
|---|---|---|---|
| 1 | Điều khiển cơ bản + bay tới đích | ~30 giây | Rất dễ |
| 2 | Né chướng ngại, va chạm là thua | ~40 giây | Dễ |
| 3 | Căn nhịp: khe bay đổi độ cao liên tục | ~45 giây | Dễ – vừa |
| 4 | Hồi sinh tua lùi | ~45 giây | Vừa |
| 5 | Chọn tuyến + tổng hợp | ~60 giây | Vừa |

## Chi tiết

### Chặng 1 — "Chuyến thư đầu tiên"
- **Dạy**: chạm/giữ để làm nóng khí → bay lên; thả ra → hạ xuống; đừng chạm đất hoặc bay quá cao.
- **Bố cục**:
  1. 0–10 s: trời trống, chỉ có mặt đất và giới hạn trần. Hướng dẫn: *"Chạm để làm nóng khí, bay lên"*.
  2. 10–20 s: vài cột thấp/cao **khe rất rộng**, cùng một độ cao → làm quen việc giữ độ cao.
  3. 20–30 s: khoảng trống → bưu điện (đích).
- **Mục tiêu kiểm chứng**: người chưa chơi bao giờ có tự hiểu cách điều khiển (chạm = phụt lửa) không, và có thấy quá khó không.

### Chặng 2 — "Phố mái nhà"
- **Dạy**: chạm chướng ngại = thua (hiện "Chơi lại").
- **Bố cục**: cụm chướng ngại khe rộng, độ cao đổi **từ từ** (cao → thấp → cao). Giữa các cụm có khoảng nghỉ.
- **Hướng dẫn**: *"Tránh va vào mái nhà và cột"*.

### Chặng 3 — "Nhịp gió nhẹ" *(tên tạm, không có cơ chế gió)*
- **Dạy**: căn nhịp — khe bay đổi độ cao **nhanh hơn** và gần nhau hơn, phải chuẩn bị trước.
- **Bố cục**: 3 đoạn zigzag ngắn, mỗi đoạn khó hơn một chút, xen khoảng nghỉ. Khe **không hẹp hơn** chặng 2 (độ khó đến từ nhịp, không phải từ khe hẹp).
- **Hướng dẫn**: *"Nhìn trước chướng ngại tiếp theo"*.

### Chặng 4 — "Thêm một cơ hội"
- **Dạy**: hồi sinh tua lùi.
- **Bố cục**: nửa đầu dễ (ôn tập), rồi **một đoạn khó rõ ràng** mà nhiều người sẽ đâm lần đầu. Khi đâm:
  hiện giải thích *"Hồi sinh: quay lại 3 giây trước. Bạn bất tử cho tới khi gặp lại chướng ngại vừa đâm — lúc đó phải tự vượt qua"*.
- Nếu người chơi vượt qua mà không đâm: hiện một dòng nhắc ngắn về hồi sinh ở màn hoàn thành (không ép phải chết).

### Chặng 5 — "Hai đường bay"
- **Dạy**: chọn tuyến — có đoạn chia **đường trên an toàn** và **đường dưới hẹp hơn nhưng ngắn hơn** *(sau này đặt vật phẩm hồi sinh ở tuyến mạo hiểm; prototype chưa có vật phẩm nên tuyến mạo hiểm chưa có phần thưởng)*.
- **Bố cục**: ôn lại chặng 2–3, một ngã rẽ, đoạn kết dễ → đích. Là "bài thi tốt nghiệp".
- **Hướng dẫn**: *"Chọn đường bạn tự tin nhất"*.

## Câu hỏi còn mở (người dùng duyệt "ok", tạm giữ như bản nháp)

Tạm hiểu: giữ chướng ngại tĩnh, giữ ngã rẽ ở chặng 5, bối cảnh quyết sau. Hỏi lại khi chơi thử xong.

1. 5 chặng chỉ dùng chướng ngại tĩnh có đủ hấp dẫn không, hay bạn muốn thêm **một yếu tố mới** (ví dụ gió đẩy, chướng ngại di chuyển)? Nếu thêm, đó là quyết định của bạn — sẽ ghi vào `GAME_DESIGN.md`.
2. Chặng 5 có tuyến mạo hiểm mà **chưa có phần thưởng** (vì prototype chưa có vật phẩm) — chấp nhận, hay bỏ ngã rẽ cho tới khi có vật phẩm?
3. Bối cảnh 5 chặng huấn luyện là gì (thị trấn, đồng quê...)? Prototype vẽ khối đơn giản nên chưa gấp.
