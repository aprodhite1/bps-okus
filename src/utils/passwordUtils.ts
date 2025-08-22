// utils/passwordUtils.ts
import bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  const saltRounds = 12;
  return bcrypt.hashSync(password, saltRounds);
};

export const verifyPassword = (inputPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(inputPassword, hashedPassword);
};