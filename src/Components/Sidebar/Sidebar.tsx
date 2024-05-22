import React, { useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import {
  BookOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  FileOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined
} from '@ant-design/icons';
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

        <Menu.Item key="3" icon={<ExperimentOutlined />} title="Подбор заданий">
          <Link to="/main/generator" />
        </Menu.Item>

        {/*<Menu.Item key="4" icon={<TeamOutlined />} title="Курсовые работы">*/}
        {/*  <Link to="/main/coursework" />*/}
        {/*</Menu.Item>*/}
      </Menu>
    </Sider>
  );
};