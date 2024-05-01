import React, { useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import {
  BookOutlined,
  CalendarOutlined,
  FileOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Icon from 'antd/es/icon';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
};

const items: MenuItem[] = [
  getItem('Календарь', '1', <CalendarOutlined />),
  getItem('Расписание', '2', <UnorderedListOutlined />),
  getItem('Журнал', '3', <BookOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

// Боковое меню
export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const onCollapseSidebar = (flag: boolean) => {
    setCollapsed(flag);
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapseSidebar} theme="light">
      <div className="demo-logo-vertical" />
      <Menu
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
      >
        <Menu.Item key="1" icon={<CalendarOutlined />} title="Календарь">
          <Link to="/main" />
        </Menu.Item>

        <Menu.Item key="2" icon={<UnorderedListOutlined />} title="Журнал">
          <Link to="/main/journal" />
        </Menu.Item>
      </Menu>
    </Sider>
  );
};