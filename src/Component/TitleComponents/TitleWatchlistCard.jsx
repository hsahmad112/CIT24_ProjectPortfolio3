import { useEffect, useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { GetTitleBackdrop } from '../../Service/TitleService';
import { DeleteTitleBookmarksById} from '../../Service/BookmarkService'; //Not used anymore
import { GetHeader } from '../../Store/Store';
import { Trash } from 'react-bootstrap-icons';

export default function TitleWatchlistCard({data, onDelete}){ 
    const [titleBookmark, setTitleBookmark] = useState(null); //Title photo state, name is unclear.        
    const imageUrl = process.env.REACT_APP_TMDB_API_IMAGE_LINK;    
    const navigate = useNavigate();
    let headers = GetHeader(); //Not used anymore

    useEffect(() =>{
        const getTitleBookmark = async () => {
            try {
                setTitleBookmark(await GetTitleBackdrop(data.titleId, true));
            } catch (error) {
                console.error("Error in TitleCard: " + error);
            }

        }
        getTitleBookmark();
    }, [data]);

    return( //Returns TitleCard containing annotation, name and photo. Used for watchlist
        <Card style={{ width: '16rem', margin: '10px', padding: '0px'}}>
            <Card.Img 
                variant="top" 
                src={titleBookmark !== null && titleBookmark !== undefined ? imageUrl + titleBookmark : "/no-image-2.jpg" } //no-image-2 is broad format
                onClick={()=> navigate("/title/" + data.titleId)}/>
            <Card.Body>
                <Card.Title>{data.titlePrimaryTitle} </Card.Title>
                <Card.Text>
                    {data.annotation !== "" ? data.annotation : <p style={{color: "lightgrey"}}>No annotation!</p>}
                </Card.Text>
                <ButtonGroup aria-label="Basic example">
                    <Button onClick={()=> navigate("/title/" + data.titleId)} variant="primary">Go to title</Button>
                    <Button onClick={() => onDelete(data.titleId)} variant="danger">
                        <Trash />
                    </Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    ); 
}