import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {GetAllTitles } from '../../Service/TitleService';
import {Carousel, Container, Row} from 'react-bootstrap';
import SimpleTitle from '../../Component/TitleComponents/SimpleTitle';
import { useNavigate } from "react-router";
import TitleCard from '../../Component/TitleComponents/TitleCard';
import CustomCarousel from '../../Component/CustomCarousel';
import { useUser } from "../../Store/store";

export default function Homepage(){
  const {token, checkToken } = useUser();
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate();

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
    checkToken(); //Calls checkToken, which sets token state to null if it is expired or not present. When null, login/signup appear on navbar     
  }, [token]);
    
  return(
    <div>
      {titles?.length > 0 ? <CustomCarousel items={titles}/> :
        <b>could not find any titles</b>}   
    </div>
  );
      
}