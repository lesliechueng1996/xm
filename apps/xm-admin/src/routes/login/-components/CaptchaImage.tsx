import { addToast, Image } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCaptcha } from '@/apis/login-api';

const CaptchaImage = () => {
  const [captcha, setCaptcha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef<string | undefined>(undefined);

  const releaseCaptcha = useCallback(() => {
    if (captchaRef.current) {
      URL.revokeObjectURL(captchaRef.current);
      captchaRef.current = undefined;
    }
  }, []);

  const createCaptcha = useCallback(async () => {
    try {
      setLoading(true);

      const svg = await getCaptcha();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      releaseCaptcha();

      captchaRef.current = svgUrl;
      setCaptcha(svgUrl);
    } catch (err) {
      addToast({
        title: '错误',
        description: '加载验证码失败，请点击重试',
        color: 'danger',
      });
      console.error('Failed to load captcha:', err);
    } finally {
      setLoading(false);
    }
  }, [releaseCaptcha]);

  const handleImageClick = () => {
    if (!loading) {
      createCaptcha();
    }
  };

  useEffect(() => {
    createCaptcha();

    // 组件卸载时清理
    return () => {
      releaseCaptcha();
    };
  }, [createCaptcha, releaseCaptcha]);

  return (
    <Image
      alt="verify code"
      height={40}
      onClick={handleImageClick}
      src={captcha}
      width={100}
      style={{
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    />
  );
};

export default CaptchaImage;
