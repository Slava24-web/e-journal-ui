import styled from 'styled-components';
import { Form, Typography } from 'antd';
import { NavLink } from 'react-router-dom';

const { Title } = Typography;

export const SignInForm = styled.div`
  width: 500px;
  margin: auto;
`;

export const SignInTitle = styled(Title)`
  text-align: center;
  margin-top: 50px !important;
  margin-bottom: 35% !important;
`;

export const CreateAccountLink = styled(NavLink)`
  margin-left: 20px;
`;