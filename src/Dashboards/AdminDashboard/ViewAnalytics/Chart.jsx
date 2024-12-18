import React, { useState, useEffect } from "react";
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { LineChart } from './LineChart'
import { Cards } from './Cards'
import NotificationDropdown from './NotificationDropDown'


// import NotificationDropdown from './NotificationDropDown'

import "./ViewAnalytics.css";

const admin = JSON.parse(localStorage.getItem("user"));

const Chart = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Trigger visibility after the component mounts
    setIsVisible(true);
  }, []);
  
  return (
   <div >
    
    {/* Notification Icon */}
    {/* <div style={{ position: "absolute", top: "50px", right: "50px" }}>
    
      <NotificationDropdown adminId={admin.id} />
    </div> */}

    <div  className={`absolute top-[65px] left-[1800px] transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      }`}
    >
          <NotificationDropdown  userId={admin._id}  />
    </div>

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