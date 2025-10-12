import md5 from 'md5';

export const encryptPassword = (password: string, username: string) => {
  return md5(`${password}@${username}`);
};
