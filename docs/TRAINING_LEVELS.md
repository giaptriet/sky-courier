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
| 1 | Điều khiển cơ bản + đáp xuống bưu cục | ~20 giây | Rất dễ |
| 2 | Né chướng ngại, va chạm là vỡ | ~26 giây | Dễ |
| 3 | Căn nhịp: khe bay đổi độ cao liên tục | ~39 giây | Dễ – vừa |
| 4 | Hồi sinh tua lùi | ~33 giây | Vừa |
| 5 | Chọn tuyến + tổng hợp | ~34 giây | Vừa |

*Độ dài thực tế (2026-11-13) ngắn hơn bản nháp ban đầu (40/45/45/60 giây), theo hướng người dùng đã chọn ở chặng 1: đoạn trống ngắn, chặng gọn.*

### Giới hạn vật lý cần nhớ khi thiết kế chặng (rút ra khi chạy thử tự động)
- Mỗi cú chạm đẩy khinh khí cầu lên ~56 đơn vị, và nó **còn bay lên ~0,9 giây** sau cú chạm. Không thể nhích lên một chút nhỏ hơn.
- Vì vậy mọi lối đi phải chừa cho khinh khí cầu (~85) **cộng thêm khoảng lên xuống** ≥ ~60 → khe/lối đi nên ≥ ~160 (lối đi dài) hoặc ≥ ~175 (khe ngắn, phải căn chuẩn).
- Khe cao → khe thấp: sau khi qua tháp cần đủ chỗ để rơi xuống trước đám mây kế tiếp. Với độ lệch ~100, chướng ngại nên cách nhau **≥ ~220–230**.
- Sân bưu cục hẹp quá (< ~140) thì rất khó canh lúc hạ.

## Chi tiết

### Chặng 1 — "Chuyến thư đầu tiên"
- **Dạy**: chạm/giữ để làm nóng khí → bay lên; thả ra → hạ xuống; đừng chạm đất hoặc bay quá cao.
- **Bố cục**:
  1. 0–4 s: trời trống ngắn, chỉ có mặt đất và giới hạn trần. Hướng dẫn: *"Chạm để bắt đầu · mỗi lần chạm = phụt lửa"*.
  2. 4–15 s: 4 chướng ngại **khe rộng, xen kẽ cao – thấp** → bay theo đường lượn sóng *(người dùng yêu cầu 2026-11-13, thay cho "cùng một độ cao")*.
     Chướng ngại = mây đen lơ lửng phía trên khe (cùng kiểu dáng mây trắng) + tháp phía dưới. Phía trên mây vẫn là trời trống,
     nhưng mây ở khe cao nằm sát trần nên **bay vượt lên trên rất khó qua**.
  3. 15–19 s: khoảng trống (người dùng thêm 1 s, 2026-11-13) → **hạ xuống đáp vào sân bưu cục** (đích). Có biển "ĐÁP Ở ĐÂY".
- **2026-11-13**: người dùng yêu cầu thu ngắn đoạn trống ở đầu (10 s → 5 s) và trước bưu cục (7 s → 3 s). Chạy thử tự động: cả chặng ~20 s; sau chướng ngại cuối có khoảng 1,4 s để bắt đầu hạ mà vẫn đáp trúng sân. Sau đó thu ngắn thêm đoạn đầu 5 s → 4 s (đoạn trước bưu cục giữ nguyên).
- **Lưu ý (2026-11-13)**: luật đáp ở bưu cục khiến chặng 1 dạy **2 điều** (điều khiển + đáp). Cần xem khi chơi thử người mới có bị quá tải không; nếu có, cân nhắc nới sân rộng hơn ở chặng 1.
- **Mục tiêu kiểm chứng**: người chưa chơi bao giờ có tự hiểu cách điều khiển (chạm = phụt lửa) không, và có thấy quá khó không.

### Chặng 2 — "Phố mái nhà" *(đã làm: `src/levels/level2.js`)*
- **Dạy**: va vào mây đen hay mái tháp = vỡ.
- **Bố cục**: cụm 1 khe hạ dần (250 → 300 → 350), nghỉ ~4 s, cụm 2 khe nâng dần (360 → 300 → 250), cách nhau 250, khe 220. Sân bưu cục rộng 160.
- **Hướng dẫn**: *"Va vào mây đen hay mái tháp là vỡ!"*.

### Chặng 3 — "Nhịp bay" *(đã làm: `src/levels/level3.js`)*
- **Dạy**: căn nhịp — khe bay đổi độ cao **nhanh hơn** và gần nhau hơn, phải chuẩn bị trước.
- **Bố cục**: 3 đoạn zigzag, xen khoảng nghỉ ~3 s: đoạn 1 cách 240 lệch 80 → đoạn 2 cách 240 lệch 100 → đoạn 3 cách 230 lệch 90. Khe 220–230 (**không hẹp hơn** chặng 2). Sân rộng 150.
- **Hướng dẫn**: *"Nhìn trước chướng ngại tiếp theo!"*.
- *Bản đầu (cách 200–220, lệch 120) chạy thử không qua được → đã giãn ra.*

### Chặng 4 — "Thêm một cơ hội" *(đã làm: `src/levels/level4.js`)*
- **Dạy**: hồi sinh tua lùi.
- **Bố cục thực tế**: 3 chướng ngại ôn tập (khe 230), nghỉ ~5 s có lời nhắc *"Đoạn khó! Nếu vỡ, bạn được hồi sinh 1 lần."*, rồi đoạn khó 5 chướng ngại **khe hẹp 180**, cách 230, lệch ~95. Sân rộng 140.
- **Bố cục (thiết kế gốc)**: nửa đầu dễ (ôn tập), rồi **một đoạn khó rõ ràng** mà nhiều người sẽ đâm lần đầu. Khi đâm:
  hiện giải thích *"Hồi sinh: quay lại 5 giây trước. Bạn bất tử cho tới khi gặp lại chướng ngại vừa đâm — lúc đó phải tự vượt qua"*.
- Nếu người chơi vượt qua mà không đâm: hiện một dòng nhắc ngắn về hồi sinh ở màn hoàn thành (không ép phải chết). *(Chưa làm riêng; màn hoàn thành hiện "Không cần hồi sinh!".)*

### Chặng 5 — "Hai đường bay" *(đã làm: `src/levels/level5.js`)*
- **Bố cục thực tế**: 4 chướng ngại ôn tập, rồi **ngã rẽ**: một dãy 3 đám mây đen lơ lửng (đáy ở 320) chia trời làm hai — **đường trên** rộng (~245), **đường dưới** hẹp (khe 320–480, giữa dãy mây và dãy tháp). Hai đường nhập lại, 2 chướng ngại dễ, sân rộng 130. Chạy thử tự động: **cả hai đường đều qua được**.
- *Bản đầu đường dưới chỉ rộng 130 → không thể bay qua (mỗi cú chạm đẩy lên ~56) → đã nới ra 160.*
- **Dạy**: chọn tuyến — có đoạn chia **đường trên an toàn** và **đường dưới hẹp hơn nhưng ngắn hơn** *(sau này đặt vật phẩm hồi sinh ở tuyến mạo hiểm; prototype chưa có vật phẩm nên tuyến mạo hiểm chưa có phần thưởng)*.
- **Bố cục**: ôn lại chặng 2–3, một ngã rẽ, đoạn kết dễ → đích. Là "bài thi tốt nghiệp".
- **Hướng dẫn**: *"Chọn đường bạn tự tin nhất"*.

## Câu hỏi còn mở (người dùng duyệt "ok", tạm giữ như bản nháp)

Tạm hiểu: giữ chướng ngại tĩnh, giữ ngã rẽ ở chặng 5, bối cảnh quyết sau. Hỏi lại khi chơi thử xong.

1. 5 chặng chỉ dùng chướng ngại tĩnh có đủ hấp dẫn không, hay bạn muốn thêm **một yếu tố mới** (ví dụ gió đẩy, chướng ngại di chuyển)? Nếu thêm, đó là quyết định của bạn — sẽ ghi vào `GAME_DESIGN.md`.
2. Chặng 5 có tuyến mạo hiểm mà **chưa có phần thưởng** (vì prototype chưa có vật phẩm) — chấp nhận, hay bỏ ngã rẽ cho tới khi có vật phẩm?
3. Bối cảnh 5 chặng huấn luyện là gì (thị trấn, đồng quê...)? Prototype vẽ khối đơn giản nên chưa gấp.
