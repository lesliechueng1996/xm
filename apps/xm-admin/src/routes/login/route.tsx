import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
} from '@heroui/react';
import Password from '@repo/ui-component/Password';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { login } from '@/apis/login-api';
import CaptchaImage from './-components/CaptchaImage';

type LoginForm = {
  username: string;
  password: string;
  captcha: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.target as HTMLFormElement),
    ) as LoginForm;
    try {
      setLoading(true);
      const token = await login(data.username, data.password, data.captcha);
      localStorage.setItem('token', token);
      navigate({ to: redirect ?? '/' });
    } catch (error) {
      console.error(error);
      addToast({
        title: '错误',
        description:
          error instanceof Error ? error.message : '登录失败，请重试',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[url(/images/login-bg.jpg)] bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center md:justify-end">
        <Card className="p-4 bg-white/60 backdrop-blur-sm shadow w-96 md:w-[36rem] md:mr-[16.67%]">
          <CardHeader>
            <p className="text-xl font-bold text-primary-800">
              商城后台管理系统
            </p>
          </CardHeader>
          <CardBody className="w-full">
            <Form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                isRequired
                errorMessage="请输入管理员姓名"
                label="管理员姓名"
                labelPlacement="outside"
                name="username"
                placeholder="请输入管理员姓名"
                type="text"
              />
              <Password
                isRequired
                errorMessage="请输入管理员密码"
                label="管理员密码"
                labelPlacement="outside"
                name="password"
                placeholder="请输入管理员密码"
              />
              <div className="flex items-end gap-2">
                <Input
                  className="w-1/2"
                  isRequired
                  errorMessage="请输入验证码"
                  label="验证码"
                  labelPlacement="outside"
                  name="code"
                  placeholder="请输入验证码"
                  type="text"
                />
                <CaptchaImage />
              </div>
              <div>
                <Button color="primary" isLoading={loading} type="submit">
                  进入管理中心
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: loginSearchSchema,
});
