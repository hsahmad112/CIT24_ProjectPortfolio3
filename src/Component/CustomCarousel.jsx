import React, { useState } from 'react';
import './../index.css';
import { useNavigate } from "react-router";
import {ArrowLeftSquareFill, ArrowRightSquareFill } from 'react-bootstrap-icons';
import SimpleTitle from './TitleComponents/SimpleTitle';

export default function CustomCarousel ({ items }) { //Component with logic to display SimpleTitle at frontpage
  const [currentIndex, setCurrentIndex] = useState(0); //Currently highlighted title
  const navigate = useNavigate();
  const itemCount = items.length; //Num of titles to be displayed

  // Calculate indices for the 5 visible cards
  const visibleItems = Array.from({ length: 5 }, (_, i) => (currentIndex + i) % itemCount); // parameter "_", is called this to follow JS convention of unused variable
                                                                                  //Use of modolus to make "circular loop", just like how a clock work
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % itemCount);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + itemCount) % itemCount); 
  };

  return (
    <div className="carousel-container" style={{ marginTop:  "50px", height: "100%"}}>  
        <ArrowLeftSquareFill  width={"50px"} height={"50px"} className="carousel-arrow left" onClick={handlePrev}/>
        
        {visibleItems?.map((itemIndex, idx) => (
          <SimpleTitle keyID={idx} key={itemIndex} title={items[itemIndex]} navigate={navigate}/>
        ))}  

        <ArrowRightSquareFill width={"50px"} height={"50px"} className="carousel-arrow right" onClick={handleNext}/>
    </div>
  );
};
