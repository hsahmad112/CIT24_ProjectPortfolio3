import { Card, CardTitle } from 'react-bootstrap';
import { useNavigate } from "react-router"; 
import { DisplayYears } from '../../Helpers/DisplayHelpers';

export default function TitleSearchCard ({title}){
    const navigate = useNavigate();

    return ( //Component used in SearchPreview component, when searching for titles
        <Card className='pointer-on-hover'
            style={{width: '48%', margin: '5px', padding: '10px', height: '200px'}}
            onClick={()=> navigate("/title/" + title.titleId)}>
            <div className="col-md-4" style={{height: '100%', width: '100%'}}>
                <img className='searchCard' src={title.posterUrl !== "" ? title.posterUrl : "./no-image.jpg"} alt="poster" /> {/* Current bug, ternary condition should be !== null. Now if no imaage, only shows alt text*/}
                <CardTitle className='card-text'>{title.primaryTitle} {DisplayYears(title.startYear, title.endYear)}</CardTitle>
                    {title.originalTitle !== title.primaryTitle &&
                <CardTitle className='card-text less-opacity' style={{fontSize: "15px"}}>{title.originalTitle}</CardTitle>}  
            </div>
        </Card>
    );
}