import React from 'react'
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { Cards } from './Statistics'

// import NotificationDropdown from './NotificationDropDown'

const user = JSON.parse(localStorage.getItem("user"));

const Chart = () => {
  return (
       <div className="h-[800px]">
     <div className="flex ml-[380px] w-[80%]">
        {/* Notification Icon */}
        {/* <div style={{ position: "absolute", top: "50px", right: "50px" }}>
          <NotificationDropdown userId={user._id} />
        </div> */}
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