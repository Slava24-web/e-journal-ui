import React, { useEffect } from 'react';
import { theme } from 'antd';
import { Route, Routes, NavLink } from 'react-router-dom';

import { Calendar } from '../../Pages/Calendar';
import { Journal } from '../../Pages/Journal';
import EventSlice from '../../store/events/slice';

// Рабочая область (контент)
export const Workspace = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
      EventSlice.fetchAllEvents()
  }, []);

  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Routes>
        <Route path="" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </div>
  );
}