import React from 'react';
import { Avatar, Layout, Popover, theme, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LogoutButton, UserBlock } from './Header.style';
import AuthSlice from '../../store/auth/slice';

const { Header } = Layout;
const { Text } = Typography;

export const AppHeader = () => {
    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const { username } = AuthSlice.getUserData

    const handleLogoutButton = async () => {
        await AuthSlice.fetchLogOut()
    }

    return (
        <Header style={{
            padding: '0 15px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center'
        }}
        >
            <UserBlock>
                <Text type="secondary">{username}</Text>
                <Popover placement="bottomRight" content={<LogoutButton onClick={handleLogoutButton}>Выйти</LogoutButton>}>
                    <Avatar size="large" icon={<UserOutlined />} style={{ marginLeft: 10, cursor: 'pointer' }} />
                </Popover>
            </UserBlock>
        </Header>
    );
};