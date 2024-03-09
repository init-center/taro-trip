import crypto from "crypto";

export const SECRET_KEY = "y8jB5t$k9sZ!p2Qa";

//  使用 PBKDF2 算法生成密码哈希值
export function hashPassword(
  password: string,
  salt: string,
  iterations = 10000,
  keyLength = 64,
  digest = "sha512",
) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
}

// 验证密码
export async function verifyPassword(
  storedPassword: string,
  storedSalt: string,
  inputPassword: string,
) {
  const hashedInputPassword = await hashPassword(inputPassword, storedSalt);
  return storedPassword === hashedInputPassword;
}
