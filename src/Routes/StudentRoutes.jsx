import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import MyManuscript from '../Dashboards/StudentDashboard/MyManuscript/MyManuscriptComponent';
import ExploreManuscript from '../Dashboards/StudentDashboard/ExploreManuscript/SearchArticles';
import ViewAnalytics from '../Dashboards/StudentDashboard/ViewAnalytics/ViewAnalyticsComponent';

import TitleProposal from '../Components/Sidebar/TitleProposals'
import Sidebar from '../Components/Sidebar/sidebar';
import UnauthorizedAccess from './UnauthorizedAccess'; // Import the UnauthorizedAccess component
import Grading from '../Dashboards/StudentDashboard/MyManuscript/Grading'
// import NotificationDropdown from '../Dashboards/StudentDashboard/ViewAnalytics/NotificationDropDown'

function StudentRoutes() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user.role !== 'student') {
    // Display a more polished unauthorized access component
    return <UnauthorizedAccess />;
  }

  // const [isVisible, setIsVisible] = useState(false);
  // useEffect(() => {
  //   // Trigger visibility after the component mounts
  //   setIsVisible(true);
  // }, []);


  return (
    <>
    {/* simplifiend routes instead /StudentDashboard/MyManuscript mas ok kapag eto /MyManuscript  */}
      <Sidebar />
      {/* <div  className={`absolute top-[40px] left-[1830px] transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      }`}
    >
          <NotificationDropdown  userId={user._id}  />
    </div> */}
      <Routes>
        <Route path="/" element={<ViewAnalytics />} />
        <Route path="/MyManuscript" element={<MyManuscript />} />
        <Route path="StudentDashboard/Grading" element={<Grading />} />


        <Route path="/TitleProposal" element={<TitleProposal />} />

        <Route path="/ExploreManuscript" element={<ExploreManuscript />} />
        <Route path="/ViewAnalytics" element={<ViewAnalytics />} />
     
      </Routes>
    </>
  );
}

export default StudentRoutes;
