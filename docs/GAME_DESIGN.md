# Sky Courier — Khinh khí cầu giao thư

> Tài liệu thiết kế gốc. Mỗi mục được gắn nhãn:
> **[ĐÃ CHỐT]** = người làm game đã quyết định · **[PROTOTYPE]** = phạm vi bản chơi thử đầu tiên ·
> **[ĐỊNH HƯỚNG]** = ý tưởng cho sau này, chưa làm · **[CÒN MỞ]** = chưa quyết định.
> Không tự biến đề xuất thành quyết định. Muốn đổi nhãn phải được người làm game đồng ý.

## 1. Tóm tắt

Game mobile đơn giản: người chơi điều khiển một khinh khí cầu chở thư bay qua các chặng có chướng ngại.
Cảm hứng ở mức **thể loại và cảm giác điều khiển** của game "chạm để bay" (kiểu Flappy Bird),
nhưng chủ đề, hình ảnh, âm thanh, luật, màn chơi và mã nguồn đều là của riêng dự án.

Mục tiêu trước mắt: làm **prototype nhỏ** để kiểm chứng điều khiển có vui và luật có dễ hiểu không, rồi mới mở rộng.

## 2. Chặng chơi và độ khó — [ĐÃ CHỐT]

- Mỗi chuyến bay (chặng) có **điểm kết thúc rõ ràng** để người chơi thấy mình đã hoàn thành.
- **5 chặng đầu là huấn luyện**: đơn giản, mỗi chặng giới thiệu một luật/yếu tố mới, hiện hướng dẫn ngắn rồi cho thực hành.
- Độ khó tăng bằng cách **phối hợp thử thách đã biết**, đòi hỏi quan sát, căn nhịp, chọn tuyến — không chỉ tăng tốc độ hay thu hẹp khe bay. Xen kẽ chặng nhẹ để hồi nhịp.
- Mọi chặng **phải vượt được bằng kỹ năng, không cần nâng cấp**. Cân bằng theo mức hỗ trợ tối đa người chơi có thể mang vào.

## 2b. Điều khiển — [ĐÃ CHỐT 2026-11-07]

- **Chạm = phụt lửa**: mỗi lần chạm (hoặc bấm chuột / phím Space), khinh khí cầu được đẩy lên một đoạn; không chạm thì hạ dần.
- Đã chơi so sánh với kiểu "giữ = đốt lửa liên tục". Người làm game chọn kiểu chạm vì khó điều khiển hơn,
  đòi hỏi kỹ năng hơn. Kiểu giữ đã bỏ khỏi code (còn trong lịch sử git nếu cần xem lại).
- Các con số (trọng lực, lực phụt, tốc độ) vẫn **[CÒN MỞ]**, chỉnh trong `src/config.js` sau khi chơi thử.

## 2c. Giao thư ở bưu cục — [ĐÃ CHỐT 2026-11-13]

- Giao thư ở bưu cục cũng là một thử thách: phải **đáp khinh khí cầu xuống đúng sân bưu cục** mới tính là giao thư thành công.
- **Rơi (chạm đất) ngoài sân bưu cục → khinh khí cầu vỡ** (như đâm đất thông thường, có thể dùng hồi sinh).
- **Bay vượt qua bưu cục** mà không đáp → **được đi tiếp**, nhưng thư chưa được giao.
- [ĐỊNH HƯỚNG] Khi có hệ thống điểm: chuyến bay qua bưu cục mà không đáp **không được tính điểm**.
- *Cách làm tạm của prototype (chưa phải quyết định)*: giỏ phải nằm **trọn** trong sân khi chạm đất (lấn mép = vỡ); chưa xét tốc độ đáp (đáp mạnh hay nhẹ đều được); tòa bưu cục chỉ là cảnh nền, không va chạm; vì mới có 1 chặng nên "đi tiếp" hiện chỉ có nút "Chơi lại chặng".

## 3. Hồi sinh

### 3.1 Luật đầy đủ — [ĐÃ CHỐT, làm sau prototype]

- Tài khoản bắt đầu với **1 lượt hồi sinh**, kho tối đa **3 lượt**.
- Kho cạn (0 lượt) → cấp bù 1 lượt khi bắt đầu lại chuyến đang chơi hoặc khi vượt qua chuyến đó. Kho còn ≥ 1 thì không tự cấp thêm.
- Mỗi chuyến có **tối đa 1 vật phẩm hồi sinh** (không bắt buộc chuyến nào cũng có), chỉ xuất hiện khi kho < 3. Đặt trên tuyến mạo hiểm nhưng vượt được bằng kỹ năng. Bỏ lỡ hoặc nhặt khi kho đầy thì không cộng.

### 3.2 Cách hồi sinh hoạt động — [ĐÃ CHỐT]

- Khi dùng hồi sinh: **tua lại vài giây trước va chạm**.
- Trong đoạn bay lại người chơi **bất tử** để chuẩn bị; bất tử **kết thúc khi gặp lại đúng chướng ngại đã gây va chạm** — lúc đó phải tự vượt qua.
- Số giây tua lùi: **[CÒN MỞ]** — giá trị tạm cho prototype: **5 giây** (người dùng đổi từ 3 → 5 ngày 2026-11-07), chốt sau khi chơi thử.
- **Chạm trần (mép trên màn hình) KHÔNG vỡ**: khinh khí cầu chỉ bị chặn lại *(người dùng yêu cầu 2026-11-14)*.
- Va chạm (chướng ngại, mặt đất) → **khinh khí cầu vỡ** (hiệu ứng vỡ), rồi hỏi "Hồi sinh" hoặc "Chơi lại từ đầu". Hết lượt → chỉ còn "Chơi lại từ đầu" *(người dùng xác nhận 2026-11-07)*.
- *Cách hiểu tạm của prototype, chưa phải quyết định*: nếu vỡ do đâm **đất** (không có chướng ngại cụ thể), bất tử kết thúc khi bay tới **đúng chỗ đã vỡ**. Sau khi tua xong, game chờ người chơi chạm mới bay tiếp.

## 4. Phạm vi prototype đầu tiên — [PROTOTYPE]

Làm:
- Điều khiển, cảm giác bay, vòng chơi theo chặng (bắt đầu → bay → về đích / va chạm).
- **1 lượt hồi sinh cho mỗi chặng**; cấp lại khi chơi lại chặng hoặc sang chặng mới.
- Thiết kế chi tiết 5 chặng huấn luyện; làm chơi được **chặng 1** trước.

Chưa làm (để giai đoạn sau):
- Kho hồi sinh tích trữ, vật phẩm hồi sinh nhặt thêm, bưu thiếp.
- Nâng cấp/trang trí, khu vực mới, thử thách hằng ngày, bảng xếp hạng.

Chỉ mở rộng khi prototype cho thấy trải nghiệm cốt lõi thực sự vui.

## 5. Định hướng mở rộng — [ĐỊNH HƯỚNG]

- **Khu vực**: công viên khủng long, biển, rừng, vùng có chiến sự, thành phố. Mỗi khu có chướng ngại riêng, dùng chung hệ điều khiển.
  - Vùng chiến sự: tiết chế — khói, công trình hư hại, dây cáp, mảnh vỡ; tránh bạo lực trực diện.
- **Trang trí kiêm nâng cấp**: hỗ trợ trước gió/va chạm, hao mòn khi phát huy tác dụng; hỗ trợ có giới hạn, không tự vượt chướng ngại.
- **Thử thách hằng ngày** tạo từ *mã chuyến bay*: cùng mã → cùng bố cục, để chia sẻ và so thành tích. Mã gắn ngày thử thách + phiên bản bộ sinh màn.

## 6. Còn mở — [CÒN MỞ]

1. Xuất bản chính thức (app trên kho ứng dụng hay chỉ web). *Prototype đã chốt: game web, chơi bằng trình duyệt điện thoại, đăng qua GitHub Pages.*
2. Cơ chế điều khiển chính xác, tốc độ, va chạm, độ dài chặng, điều kiện hoàn thành. *Kiểu điều khiển đã chốt: chạm (mục 2b); các con số vẫn đang chỉnh. Điều kiện hoàn thành: đáp đúng sân bưu cục (mục 2c). Có xét tốc độ đáp hay không: chưa quyết.*
3. Số giây tua lùi khi hồi sinh *(tạm 5 giây)*.
4. Thiết kế cụ thể 5 chặng huấn luyện và nội dung chặng 1 *(bản nháp: `docs/TRAINING_LEVELS.md`, chờ duyệt)*.
5. Thời điểm đưa kho hồi sinh, vật phẩm, bưu thiếp, nâng cấp, khu vực mới, thử thách ngày vào game.
6. Cân bằng nâng cấp; cách giữ bảng xếp hạng thử thách ngày công bằng.

## 7. Ngoài phạm vi

- Có ghi chú riêng về một game kiểu "Daily Flow" (puzzle). **Không** gộp cơ chế puzzle đó vào dự án này.
