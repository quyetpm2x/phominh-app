const VN_PHONE_RE = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export function isValidVietnamesePhone(phone: string): boolean {
  return VN_PHONE_RE.test(phone);
}

export function isValidOtpCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}
