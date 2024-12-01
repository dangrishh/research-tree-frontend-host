import React, { useState, useEffect } from "react";
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { Cards } from './Cards'

import NotificationDropdown from './NotificationDropDown'

const user = JSON.parse(localStorage.getItem("user"));

console.log("user", user);

const Chart = () => {
  return (
   <div className="">
    {/* Notification Icon */}
    <div style={{ position: "absolute", top: "50px", right: "50px" }}>
      <NotificationDropdown userId={user._id} />
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