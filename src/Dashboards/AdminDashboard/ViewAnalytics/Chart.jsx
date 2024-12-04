import React from 'react'
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { LineChart } from './LineChart'
import { Cards } from './Cards'


// import NotificationDropdown from './NotificationDropDown'

import "./ViewAnalytics.css";

const admin = JSON.parse(localStorage.getItem("user"));

const Chart = () => {
  return (
   <div >
    
    {/* Notification Icon */}
    {/* <div style={{ position: "absolute", top: "50px", right: "50px" }}>
    
      <NotificationDropdown adminId={admin.id} />
    </div> */}
   <div className="chart-1">
 
   < Cards/>

   <div className="bar-charts">
   <BarChart />
   </div>

  <div className="chart-2">
     
  <PieChart/>

  </div> 
   </div>
   </div>
  )
}

export default Chart;