import { Card } from 'react-bootstrap';

export default function SimpleTitle({title, navigate, keyID}) { //Title component used in homepage 
  
  function DisplayGenre(genres){ //Helper function
    let genresString = "";
    let total = genres.length;

    for (let index = 0; index < genres.length; index++) {

      if(total === 1){
        genresString += genres[index];
        break;
      }
      if(index === total - 1){
        genresString += " and " + genres[index];
        break;
      }
      genresString += genres[index] + ", "; 
    }
      //If no Oxford Comma is wanted, these could also do:
      
      //genresString = genresString.replace(/,(?=[^,]*$)/, ''); //Match comma, negate positive lookahead (that is comma followed by another comma), replace last comma with empty string  
      
      // OR:

      //   if (index === total - 1 && total > 1) { // For the last genre in the list when there are multiple genres
      //     genresString += " and " + genres[index];
      // } else if (total > 1 && index < total - 2) { // For all genres except the last two in the list
      //     genresString += genres[index] + ", ";
      // } else if (index === total - 2) { // For the second last genre in the list
      //     genresString += genres[index];
      // } else { // For a single genre or the only genre in the list
      //     genresString += genres[index];
      // }

    return genresString;
  }

  return(
    <Card
      className='carousel-card'
      border={keyID === 2 ? '2px solid yellow' : null} //keyID refers to highlighted Card
      style={{
        height: keyID === 2 ? '60vh' : "50vh", // Height set relative to viewport
        width:  keyID === 2 ?'90vh' : '70vh', 
        margin: '10px',
        marginLeft: keyID == 2 ? '40px' : '10px', //Margin specified for keyID 2
        marginRight: keyID == 2 ? '40px' : '10px',
        padding: '0px',
        border: keyID === 2 ? '0.5vh solid #d8c303' : '4px solid transparent',
        backgroundColor: keyID === 2 ? "#d8c303" : "white",
        color: keyID === 2 ? "white" : "black" }}>
      <Card.Img
        variant="top"
        style={{
          height: '100%',
          minHeight: '70%',
          objectFit: 'cover', // Ensures image covers and crops
        }}
        src={title?.posterUrl ? title.posterUrl : "./no-image.jpg"}
        onClick={() => navigate("/title/" + title.id)} />
      
      <Card.Body style={{ fontSize: "8px", height: '100%' }}>  
        { title.primaryTitle && (<p style={{ fontSize: "15px", margin: '0px' }}>{title.primaryTitle }</p>)}
        { title.startYear && (<p style={{ fontSize: "10px", margin: '0px' }}>Release year: {title.startYear}</p>) }
      <p style={{ fontSize: "10px" }}>Genres: {DisplayGenre(title.genresList)}</p>
      </Card.Body>

    </Card>
  );

}
