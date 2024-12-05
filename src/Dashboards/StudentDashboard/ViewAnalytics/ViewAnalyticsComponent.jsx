import React, { useState, useEffect } from "react";
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { Cards } from './Statistics'

import NotificationDropdown from './NotificationDropDown'


const Chart = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Trigger visibility after the component mounts
    setIsVisible(true);
  }, []);

  return (
       <div className="h-[800px]">
     <div className="flex ml-[380px] w-[80%]">
        {/* Notification Icon */}
        {/* <div style={{ position: "absolute", top: "50px", right: "50px" }}>
          <NotificationDropdown userId={user._id} />
        </div> */}

    <div  className={`absolute top-[65px] left-[1800px] transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      }`}
    >
          <NotificationDropdown  userId={user._id}  />
    </div>

      <div className="w-[68.3%] ml-[10px]"> 
            <Cards/>    
      </div>

      <div className='mt-[190px]'>
          <PieChart/>    
      </div> 

      <div className='absolute mt-[317px] ml-[10px]'>
          <BarChart/>
      </div>
     </div>
       </div>
  )
}

export default Chart;