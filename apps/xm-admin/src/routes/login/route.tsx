import { Button, Card, CardBody, CardHeader, Form, Input } from '@heroui/react';
import Password from '@repo/ui-component/Password';
import { createFileRoute } from '@tanstack/react-router';
import CaptchaImage from './-components/CaptchaImage';

const LoginPage = () => {
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
            <Form className="w-full flex flex-col gap-4">
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
                <Button color="primary" type="submit">
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

export const Route = createFileRoute('/login')({ component: LoginPage });
