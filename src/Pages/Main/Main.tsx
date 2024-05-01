import React from 'react';
import { Layout } from 'antd';
import { Sidebar } from '../../Components/Sidebar';
import { AppHeader as Header } from '../../Components/Header';
import { Breadcrumbs } from '../../Components/Breadcrumbs';
import { Workspace } from '../../Components/Workspace';

const { Content } = Layout

export const Main: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout>
            <Header />
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumbs />
              <Workspace />
            </Content>
          </Layout>
        </Layout>
    );
};