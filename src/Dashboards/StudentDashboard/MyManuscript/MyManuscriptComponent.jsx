import React, { useState, useEffect } from "react";
import Description from './Descriptions'
import NotificationDropdown from '../ViewAnalytics/NotificationDropDown'
// import PdfViewers from './PdfViewer'
import Grading from './Grading'

function MyManuscriptComponent() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Trigger visibility after the component mounts
    setIsVisible(true);
  }, []);
  
  return (
    <div className="">

  <div  className={`absolute top-[40px] left-[1830px] transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-0"
      }`}
    >
    <NotificationDropdown  userId={user._id}  />
    </div>

    <div className="absolute">
      <Grading  />
    
    </div>

    <div className=" absolute mt-[-1440px] ml-[1420px]">
    </div>
      <Description  />
    </div>
  
  )
}

export default MyManuscriptComponent