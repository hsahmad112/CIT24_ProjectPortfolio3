import { useEffect, useState } from 'react';
import { Card, CardTitle } from 'react-bootstrap';
import { GetPersonBackdrop } from '../../Service/PersonService';
import { useNavigate } from "react-router"; 
import { DisplayYears } from '../../Helpers/DisplayHelpers';

export default function PersonSearchCard ({person}){ 
    const [backdropUrl, setBackdropUrl] = useState("./no-image.jpg");
    const imageUrl = process.env.REACT_APP_TMDB_API_IMAGE_LINK;  
    const navigate = useNavigate();

    useEffect(()=>{
        async function getBackdrop(){
            const res = (await GetPersonBackdrop(person.personId));
            if(res?.profile_path) { //Needs to be nullable, otherwise res might be undefined (because we await from GetPersonBackdrop)
                setBackdropUrl(res.profile_path); //Could be ternary, BUT then it introduces unneccesary "else statement"
            }
        } 
        getBackdrop();
    }, [person]);

    return (//Component used in SearchPreview component, when searching for persons
        <div>
            <Card className='pointer-on-hover' style={{ width: '100%', padding: '10px', margin: "2px", height: '200px'}}
                onClick={() => navigate("../person/"  + person.personId)}>
                <div className="col-md-4" style={{width: '100%', height: '100%'}}>
                    <img className='searchCard' src={backdropUrl === "./no-image.jpg" ? backdropUrl : imageUrl + backdropUrl}></img>
                    <CardTitle className='card-text'>{person.primaryName} {DisplayYears(person.birthYear, person?.deathYear)}</CardTitle>
                </div>
            </Card>
        </div>  
    );
}