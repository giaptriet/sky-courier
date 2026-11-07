# CLAUDE.md — hướng dẫn cho Claude khi làm dự án Sky Courier

## Đọc trước khi làm bất cứ việc gì

1. **`docs/GAME_DESIGN.md`** — thiết kế game. Tôn trọng nhãn [ĐÃ CHỐT] / [PROTOTYPE] / [ĐỊNH HƯỚNG] / [CÒN MỞ].
2. **`docs/MVP_PLAN.md`** — kế hoạch bản chơi thử, đang ở bước nào.
3. **`docs/TRAINING_LEVELS.md`** — thiết kế 5 chặng huấn luyện (khi làm phần chặng).

Không làm tính năng ngoài bước hiện tại. Không tự quyết các mục [CÒN MỞ]: nếu cần một con số để chạy được,
dùng giá trị tạm, đặt trong file cấu hình, và báo lại cho người dùng.

## Người dùng

- Chưa biết lập trình. Trả lời bằng **tiếng Việt**, ngôn ngữ phổ thông, giải thích từ chuyên môn khi dùng lần đầu.
- Mỗi bước: nói rõ **file nào tạo/sửa**, **người dùng cần làm gì**, **kết quả mong đợi**, **cách kiểm tra bằng mắt**.
- Không tuyên bố "đã chạy được / đã kiểm thử" nếu chưa thực sự chạy và có bằng chứng (ví dụ ảnh chụp màn hình từ trình duyệt tự động). Nói rõ phần nào chưa xác minh.

## Công nghệ (người dùng đã xác nhận 2026-11-07)

- **Game web chạy trên trình duyệt điện thoại**: HTML5 Canvas + JavaScript thuần (ES modules).
- **Không dùng framework game, không có bước build** ở giai đoạn prototype: mở `index.html` qua một máy chủ tĩnh là chơi được.
- Chạy thử trên máy: `npx serve .` hoặc `python3 -m http.server 8000` rồi mở `http://localhost:8000`.
- Xuất bản bản chơi thử: GitHub Pages (để chơi bằng điện thoại qua đường link).
- Hình ảnh prototype: vẽ bằng hình khối đơn giản trong code (chưa cần file ảnh/âm thanh).
- Nếu sau này cần đóng gói thành app (Android/iOS) hoặc chuyển sang engine khác, đó là quyết định riêng — hỏi người dùng trước.

## Cấu trúc thư mục dự kiến

```
index.html          trang chứa game
src/main.js         khởi động, vòng lặp game
src/config.js       MỌI con số tinh chỉnh (trọng lực, lực nâng, tốc độ, số giây tua lùi...)
src/balloon.js      khinh khí cầu: chuyển động, va chạm
src/level.js        nạp và vẽ chặng từ dữ liệu
src/levels/*.js     dữ liệu từng chặng (vị trí chướng ngại, đích, lời hướng dẫn)
src/rewind.js       ghi lại trạng thái và tua lùi khi hồi sinh
src/input.js        chạm màn hình / chuột / phím Space (kiểu điều khiển đã chốt: chạm = phụt lửa)
src/ui.js           chữ hướng dẫn và nút trên màn hình
docs/               tài liệu thiết kế và kế hoạch
```

## Quy tắc code

- Code đơn giản, dễ đọc hơn là "thông minh". Mỗi file một việc, tên rõ nghĩa (tiếng Anh cho tên biến/hàm).
- **Chú thích bằng tiếng Việt** ở đầu mỗi file và trước các đoạn khó hiểu.
- **Không hard-code con số tinh chỉnh** trong logic — đặt hết vào `src/config.js` để người dùng tự chỉnh thử.
- **Chặng là dữ liệu**, không viết logic riêng cho từng chặng.
- **Vòng lặp cập nhật theo bước thời gian cố định** (fixed timestep) để chuyển động giống nhau trên mọi máy và để tua lùi/hồi sinh chính xác. Không dùng `Math.random()` trực tiếp trong logic chặng (sau này cần sinh màn từ mã chuyến bay).
- Hỗ trợ cả chạm (điện thoại), chuột và phím Space (máy tính) để dễ thử.
- Khung hình dọc kiểu điện thoại, tự co giãn theo màn hình.
- Không thêm thư viện ngoài khi chưa hỏi người dùng.
- Tài sản sáng tạo phải nguyên bản: không sao chép tên, hình, âm thanh, màn chơi, giao diện hay mã nguồn của game khác.

## Git

- Commit nhỏ, mỗi commit một bước, thông điệp ghi rõ đã làm gì.
- Sau mỗi bước: tóm tắt file đã tạo/sửa, cách chạy, việc tiếp theo; cập nhật trạng thái trong `docs/MVP_PLAN.md`.
