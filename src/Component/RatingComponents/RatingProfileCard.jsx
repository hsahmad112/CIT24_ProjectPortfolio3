import {Card, CardTitle} from 'react-bootstrap' //CardTitle not used.

export default function RatingProfileCard({title, navigate}){

    return ( //Rating component used for displaying a titles rating in users' profile page
        <Card className='pointer-on-hover' bg="transparent" style={{height: "500px"}}
            onClick={() => navigate("../title/"  + title.titleId)}>
            <div className="col-xs-1" style={{width: '100%', height: '100%'}}>
                <img className='titleRatingCard' src={title.posterUrl !== "" ? title.posterUrl : "./no-image.jpg"} />
                <Card.Title className='card-text'>{title.primaryTitle}</Card.Title>
                <Card.Text> {`Rating: ${title.rating}` || "Rating is loading.."} </Card.Text>
            </div>
        </Card>
    );
}