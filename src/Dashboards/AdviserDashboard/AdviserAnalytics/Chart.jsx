import React, { useState, useEffect } from "react";
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { Cards } from './Cards'

// import NotificationDropdown from './NotificationDropDown'
import NotificationDropdown from './NotificationDropDown'
const user = JSON.parse(localStorage.getItem("user"));
console.log("user", user);


const Chart = () => {

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Trigger visibility after the component mounts
    setIsVisible(true);
  }, []);

  return (
   <div className="">
    {/* Notification Icon */}
    {/* <div style={{ position: "absolute", top: "50px", right: "50px" }}>
      <NotificationDropdown userId={user._id} />
    </div> */}

    <div  className={`absolute top-[65px] left-[1800px] transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      }`}>
    <NotificationDropdown  userId={user._id}  />
    </div>
    <div className="flex ml-[300px]">
        <Cards />
    <div className="w-[68.3%] mt-[290px] ml-[35px]">
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