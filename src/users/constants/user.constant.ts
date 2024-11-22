export const USER_EMAIL_LENGTH = {
  MIN: 6,
  MAX: 50,
} as const;

export const USER_NICKNAME_LENGTH = {
  MIN: 2,
  MAX: 10,
} as const;

export const USER_PASSWORD_REGEXP =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
