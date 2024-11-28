import React from 'react'
import { Route, Routes, Link } from 'react-router-dom';


import TitleProposal from '../Dashboards/AdviserDashboard/Sidebar/TitleProposals'
import Grading from '../Dashboards/AdviserDashboard/MyAdvisee/Grading'
import MyAdvisee from '../Dashboards/AdviserDashboard/MyAdvisee/Tables'
import Publishing from '../Dashboards/AdviserDashboard/Publishing/Tables'
import ExploreManuscript from '../Dashboards/AdviserDashboard/ExploreManuscript/SearchArticles'
import ViewAnalytics from '../Dashboards/AdviserDashboard/AdviserAnalytics/Chart'
import PanelistAnalytics from '../Dashboards/AdviserDashboard/PanelistAnalytics/PanelistMain'
import UnauthorizedAccess from './UnauthorizedAccess'; // Import the UnauthorizedAccess component
import GradingModal from '../Dashboards/AdviserDashboard/Publishing/GradingAdvicer'
import Sidebar from '../Dashboards/AdviserDashboard/Sidebar/sidebar'


function AdviserRoutes() {

  const user = JSON.parse(localStorage.getItem('user'));

  if (user.role !== 'adviser') {
    // Redirect to a non-authorized page or display an error message
    return <UnauthorizedAccess />;
  }

  return (
    <>
     
      <Sidebar />
              <Routes>

              <Route path="/TitleProposal" element={<TitleProposal/>} />
              <Route path="/GradingModal" element={<GradingModal/>} />

                <Route path="/" element={<ViewAnalytics/>} />
                <Route path="/MyAdvisee" element={<MyAdvisee/>} />
                <Route path="/Publishing" element={<Publishing/>} />
                <Route path="/ExploreManuscript" element={<ExploreManuscript/>} />
                <Route path="/ViewAnalytics" element={<ViewAnalytics/>} />

                <Route path="AdviserDashboard/PanelistAnalytics" element={<PanelistAnalytics/>} />
              </Routes>
          
    </>
  )
}

export default AdviserRoutes