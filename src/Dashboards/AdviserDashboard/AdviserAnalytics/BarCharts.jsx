import React, { useEffect, useState } from 'react';
import { Chart, Interval, Tooltip, Axis, Legend } from 'bizcharts';
import axios from 'axios';

export const BarChart = () => {
  // State to store the fetched data and the highest value
  const [data, setData] = useState([]);
  const [highest, setHighest] = useState(null);

  // Fetch data from the backend API
  useEffect(() => {
    const fetchPdfDetailsCount = async () => {
      try {
        const response = await axios.get(
          'https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/PdfKeywordsCount'
        );
  
        if (response.data.length > 0) {
          // Find the absolute highest value across all keywords
          const absoluteHighest = response.data.reduce(
            (max, item) => (item.value > max.value ? item : max),
            response.data[0]
          );
          setHighest(absoluteHighest);
  
          // Sort data by value in descending order and limit to top 10
          let top10Data = response.data.sort((a, b) => b.value - a.value).slice(0, 10);
  
          // Ensure the highest value is in the top 10
          if (!top10Data.some((item) => item.category === absoluteHighest.category)) {
            top10Data = [...top10Data, absoluteHighest];  // Add highest value if it's not already in the top 10
          }
  
          // Sort the data again to make sure it's in descending order
          top10Data.sort((a, b) => b.value - a.value);  // Re-sort to maintain the correct order
          setData(top10Data);
        }
      } catch (error) {
        console.error('Error fetching PDF details count:', error);
      }
    };
  
    fetchPdfDetailsCount();
  }, []);
  
  return (
    <div className="p-10 mr-5 ml-[20px] mt-[120px] rounded-lg shadow-custom-shadow bg-[#1E1E1E] border border-[#4B4B4B] w-[955px]">
      <h2 className="text-[#0BF677] text-xl mb-4">Top 10 Most Upload Manuscript</h2>
    
      <Chart height={300} width={900} autoFit data={data} interactions={['active-region']}>
        <Axis name="value" visible={true} />
        <Axis name="category" visible={true} />
        <Legend
          position="right"
          offsetY={-20}
          offsetX={10}
          marker={{
            symbol: 'circle',
            style: { fill: '#0BF677', r: 5 },
          }}
          itemName={{
            style: { fill: '#FFFFFF', fontSize: 14 },
          }}
        />
        <Tooltip shared />
        <Interval
          position="category*value"
          size={50}
          color={[
            'category',
            (category) => {
              // Highlight the bar with the highest value
              if (highest && highest.category === category) {
                return 'l(270) 0:#FF5733 1:#FFC300'; // Different gradient for the highest value
              }
              return 'l(270) 0:#00FFC2 1:#0BF677'; // Default gradient
            },
          ]}
        />
      </Chart>
    </div>
  );
};

export default BarChart;
