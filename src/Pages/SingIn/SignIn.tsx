import React from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { CreateAccountLink, SignInForm, SignInTitle } from './SignIn.styled';
import { observer } from 'mobx-react-lite';
import AuthSlice from '../../store/auth/slice';

type FormData = {
    email: string
    password: string
}

export const SignIn: React.FC = observer(() => {
    const [form] = Form.useForm();

    const onFinish = async ({ email, password }: FormData) => {
        await AuthSlice.fetchSignIn({ email, password });
    };

    return (
        <SignInForm>
            <SignInTitle level={2}>Авторизация</SignInTitle>

            <Form
                form={form}
                name='register'
                onFinish={onFinish}
                size='large'
                scrollToFirstError
            >
                <Form.Item
                    name='email'
                    rules={[
                        {
                            type: 'email',
                            message: 'email введён некорректно'
                        },
                        {
                            required: true,
                            message: 'Пожалуйста, введите email'
                        }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder='email' />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, введите пароль'
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className='site-form-item-icon' />}
                        placeholder='Пароль'
                    />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Войти
                    </Button>
                    <CreateAccountLink to='/sign-up'>Создать аккаунт</CreateAccountLink>
                </Form.Item>
            </Form>
        </SignInForm>
    );
});