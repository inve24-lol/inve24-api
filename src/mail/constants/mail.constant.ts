export const EMAIL_CERT_CODE_RANGE = {
  MIN: 100000,
  MAX: 1000000,
} as const;

export const EMAIL_CERT_CODE_REGEXP = /^[0-9]{6}$/;
