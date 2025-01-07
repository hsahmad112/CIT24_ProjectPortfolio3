import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {GetAllTitles } from '../../Service/TitleService';
import CustomCarousel from '../../Component/CustomCarousel';
import { useUser } from "../../Store/Store";

export default function Homepage(){
  const {token, checkToken } = useUser();
  const [titles, setTitles] = useState([]); //array of titles to be set for Homepage Carousel

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTitles((await GetAllTitles()).entities); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[]);

  useEffect(() => {
    checkToken(); //Calls checkToken, which sets token state to null if it is expired or not present. 
                  //When null, login/signup appear on navbar     
  }, [token]);
    
  if(titles){
    return(
      <div>
        {titles?.length > 0 && <CustomCarousel items={titles}/>}   
      </div>
    );
  }
  else{
    return <b>could not find any titles</b>; // we might likely never arrive to this, as titles is instantiated as an empty array, which always is true. 
  }
      
}
