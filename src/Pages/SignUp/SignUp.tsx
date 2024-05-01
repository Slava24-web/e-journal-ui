import React from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { HasAccountLink, SignUpForm, SignUpTitle } from './SignUp.styled';
import AuthSlice from '../../store/auth/slice';
import { observer } from 'mobx-react-lite';

type FormData = {
    email: string
    password: string
    confirm: string
    username: string
}

export const SignUp: React.FC = observer(() => {
    const [form] = Form.useForm();

    const onFinish = async ({ email, password, confirm, username }: FormData) => {
        if (password === confirm) {
            await AuthSlice.fetchSignUp({ email, password, username });
        }
    };

    return (
        <SignUpForm>
            <SignUpTitle level={2}>Регистрация</SignUpTitle>

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
                            message: 'Пожалуйста, введите правильный email'
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

                <Form.Item
                    name='confirm'
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, подтвердите пароль'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            }
                        })
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className='site-form-item-icon' />}
                        placeholder='Повторите пароль'
                    />
                </Form.Item>

                <Form.Item
                    name='username'
                    rules={[{ required: true, message: 'Пожалуйста, введите полное имя', whitespace: true }]}
                >
                    <Input
                        prefix={<UserOutlined className='site-form-item-icon' />}
                        placeholder='Полное имя (ФИО)'
                    />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit'>Зарегистрироваться</Button>
                    <HasAccountLink to='/sign-in'>Уже есть аккаунт</HasAccountLink>
                </Form.Item>
            </Form>
        </SignUpForm>
    );
});