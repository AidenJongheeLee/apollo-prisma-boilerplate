import bcrypt from "bcrypt";

export const hashPassword: (password: string) => Promise<string> = password => {
  if (password.length < 8)
    throw new Error("Pssword must be 8 characters or longer");
  return bcrypt.hash(password, process.env.BCRYPT_SALT);
};
