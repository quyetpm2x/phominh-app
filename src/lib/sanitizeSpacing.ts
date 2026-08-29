// Chặn dấu cách đầu chuỗi + gộp nhiều dấu cách liên tiếp thành 1 — chạy live lúc gõ (onChangeText)
// cho các field "Họ và tên"/"Biệt danh hiển thị". KHÔNG chặn dấu cách cuối chuỗi ở đây (cần giữ tạm
// thời lúc đang gõ từ tiếp theo, vd "Nguyễn " trước khi gõ tiếp "Văn") — dấu cách cuối được dọn bằng
// .trim() lúc blur/submit như các field khác trong màn này.
export function sanitizeSpacing(text: string): string {
  return text.replace(/^\s+/, '').replace(/ {2,}/g, ' ');
}
