import { useNavigate, Outlet } from 'react-router';
import { useUser } from "../Store/Store";
import { Navbar, Button, Dropdown, Container, Nav } from 'react-bootstrap';
import SearchField from './SearchField';

export default function NavigationBar(){ //Navbar component
  const {userName, token, logout } = useUser(); //States from Context, from parent UserProvider

  let navigate = useNavigate();

    return(
      <div>
        <Navbar expand="lg" className="bg-body-tertiary" bg="primary" data-bs-theme="dark">  
          <Container>
            <Navbar.Brand className='pointer-on-hover' onClick ={() => navigate("/")}>Movie DB</Navbar.Brand>
            <SearchField/>
            {token !== null && 
            <div className='user-menu'>
              <Nav.Item>
                <Navbar.Text>
                  <p className='user-menu' style={{color:"white", display: "inline !important", width: "100px"}}>Hello {userName} </p> {/* display and width overrided by user-menu in index.css*/}
                  <Dropdown style={{display: "inline-block"}}>
                      <Dropdown.Toggle className='advanced-dropdown' variant="success" id="dropdown-basic">
                        <i className="bi bi-list" style={{color: "white"}}></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick = { () => navigate("/profile")}> Profile</Dropdown.Item>
                        <Dropdown.Item onClick = { () => navigate("/watchlist")}>Watchlist</Dropdown.Item>
                        <Dropdown.Item onClick = { () => navigate("/rating")}>Rating</Dropdown.Item>
                        <Dropdown.Item onClick = { () => navigate("/settings")}>Settings</Dropdown.Item>
                        <Dropdown.Item onClick = { () => logout()}>Sign out</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </Navbar.Text>
              </Nav.Item>
            </div>}

            {token === null && //If user not logged in, thus no JWT token in cookie, display btn below:
            <div> 
              <Button onClick ={() => navigate("/login")}>Login</Button> 
              <Button onClick ={() => navigate("/signup")} variant="success">Signup</Button>
            </div>}
          </Container>
         
        </Navbar>    
        <Outlet/>       
      </div>
  );
}
