const MIN_YEAR = 1900;

export interface DateOfBirthParts {
  day: string;
  month: string;
  year: string;
}

// Ghép 3 ô Ngày/Tháng/Năm thành chuỗi ISO YYYY-MM-DD, trả về null nếu không hợp lệ — dùng
// Date.UTC rồi đối chiếu ngược lại để bắt các ngày không tồn tại (vd 31/02) mà Date tự "tràn"
// sang tháng sau thay vì báo lỗi.
export function toIsoDate({ day, month, year }: DateOfBirthParts): string | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return null;
  if (d < 1 || d > 31 || m < 1 || m > 12) return null;
  if (y < MIN_YEAR || y > new Date().getFullYear()) return null;

  const date = new Date(Date.UTC(y, m - 1, d));
  const isRealDate =
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  if (!isRealDate) return null;

  return `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
}
