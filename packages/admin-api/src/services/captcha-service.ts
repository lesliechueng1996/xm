import createCaptcha from 'svg-captcha';

export const generateCaptcha = () => {
  const captcha = createCaptcha.create({
    size: 4,
    ignoreChars: '0o1i',
    noise: 2,
    color: true,
    background: '#fff',
    width: 100,
    height: 40,
  });
  return captcha;
};
