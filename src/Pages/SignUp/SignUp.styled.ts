import styled from 'styled-components';
import { Form, Typography } from 'antd';
import { NavLink } from 'react-router-dom';

const { Title } = Typography;

export const SignUpForm = styled.div`
  width: 500px;
  margin: auto;
`;

export const SignUpTitle = styled(Title)`
  text-align: center;
  margin-top: 50px !important;
  margin-bottom: 30% !important;
`;

export const HasAccountLink = styled(NavLink)`
  margin-left: 20px;
`;