import React from 'react'
import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ExploreManuscript from '../Dashboards/AdminDashboard/ExploreManuscript/SearchArticles'
import ViewAnalytics from '../Dashboards/AdminDashboard/ViewAnalytics/Chart'

import StudentManuscript from '../Dashboards/AdminDashboard/Publishing/TablesStudent'
import AdviserManuscript from '../Dashboards/AdminDashboard/Publishing/Advisers'
import PanelistManuscript from '../Dashboards/AdminDashboard/Publishing/Panelist'

import AdviserRegistered from '../Dashboards/AdminDashboard/ProfileManagement/AdviserRegistered'
import AdviserPending from '../Dashboards/AdminDashboard/ProfileManagement/AdviserPending'
import StudentRegistered from '../Dashboards/AdminDashboard/ProfileManagement/StudentRegistered'
import StudentPending from '../Dashboards/AdminDashboard/ProfileManagement/StudentPending'

import Sidebar from '../Dashboards/AdminDashboard/Sidebar/sidebar'
import UnauthorizedAccess from './UnauthorizedAccess'; // Import the UnauthorizedAccess component


function AdviserRoutes() {

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Fetch stored user data from localStorage and set it to the admin state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  // If no admin is found, render UnauthorizedAccess
  if (!admin) {
    console.log('Admin already Login: ', admin)
  }

  return (
    <>
    
      <Sidebar />
              <Routes>
                <Route path="/" element={<ViewAnalytics/>} />
                <Route path="/ViewAnalytics" element={<ViewAnalytics/>} />
                <Route path="/ExploreManuscript" element={<ExploreManuscript/>} />
                <Route path="/StudentManuscript" element={<StudentManuscript/>} />
                <Route path="/AdviserManuscript" element={<AdviserManuscript/>} />
                <Route path="/PanelistManuscript" element={<PanelistManuscript/>} />
                <Route path="/AdviserRegistered" element={<AdviserRegistered/>} />
                <Route path="/AdviserPending" element={<AdviserPending/>} />
                <Route path="/StudentRegistered" element={<StudentRegistered/>} />
                <Route path="/StudentPending" element={<StudentPending/>} />

           

              </Routes>
          
    </>
  )
}

export default AdviserRoutes