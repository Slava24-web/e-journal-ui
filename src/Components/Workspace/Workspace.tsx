import React, { useEffect } from 'react';
import { theme } from 'antd';
import { Route, Routes, NavLink } from 'react-router-dom';

import { Calendar } from '../../Pages/Calendar';
import { Journal } from '../../Pages/Journal';
import EventSlice from '../../store/events/slice';
import JournalSlice from '../../store/journal/slice';
import { observer } from 'mobx-react-lite';

// Рабочая область (контент)
export const Workspace = observer(() => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
      EventSlice.fetchAllEvents()
      JournalSlice.fetchAllSpecs()
      JournalSlice.fetchAllLevels()
      JournalSlice.fetchAllGroups()
      JournalSlice.fetchAllLessonTypes()
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
})