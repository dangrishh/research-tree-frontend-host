import React from 'react'
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { Cards } from './Cards'


const Chart = () => {
  return (
   <div className="">
    
   <div className="flex ml-[300px]">
   < Cards />
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