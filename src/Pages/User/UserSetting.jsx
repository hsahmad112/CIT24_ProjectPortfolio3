import {Button, Modal,Row, Form, Col, Container, Alert} from 'react-bootstrap';
import Toaster from '../../Component/Toaster';
import {useEffect, useState} from 'react';
import {useUser} from "../../Store/Store";
import {comparePasswords, validateEmail, validatePassword} from '../../Helpers/FormValidation';
import {PutPassword, PutEmail, DeleteUser} from '../../Service/UserService';
import { useNavigate } from 'react-router';

export default function UserSetting(){ 
    const {logout, token, checkToken} = useUser();
    const [timer, setTimer] = useState(5);

    const navigate = useNavigate();

    const [showAccountDeletionModal, setShowAccountDeletionModal] = useState(false);
    
    //Toaster Component could have been used instead of this 
    const [toastInfo, setToastInfo] = useState({
        header: "",
        body: "",
        color: ""
    });
    
    const [errorMessage, setErrorMessage] = useState({
        passwordMismatch: '',
        invalidEmailFormat: '',
        genericError: '',
        invalidPasswordFormat: '',
        invalidFirstNameFormat: ''
    });     
    const [isValidFormat, setIsValidFormat] = useState(false);


    const [formValues, setFormValues] = useState({
        "email": "",
        "password": "",
        "confirmPassword": ""
    });

 
    useEffect(() => {
        validateEmail(formValues.email, setErrorMessage, setIsValidFormat);
        validatePassword(formValues.password, setErrorMessage, setIsValidFormat)
        comparePasswords(formValues.password, formValues.confirmPassword, setErrorMessage, setIsValidFormat);        
    }, [formValues]);

    //if user is not logged in, displays warning for 5 seconds and redirects.
    useEffect(() => {
        let countDown;
        if (checkToken() === null) {
            const cookieExpired = true; 
            countDown = setInterval(() => {
                setTimer((t) => {
                    if(t <=0){
                        clearInterval(countDown); //Stops countDown timer from continously running
                        logout(cookieExpired); //passes true to logout function from Store.js - redirection happens here
                        return 0; //timer state is set to 0
                    }
                    return t - 1; 
                })
            }, 1000);  
        }    
        return () => clearInterval(countDown); //Stops timer from continuing to run, after useEffect has executed   
    
      }, [token]);

    function handleChange(e){
        const {name, value} = e.target;
        setFormValues((prevData) => ({
            ...prevData, 
            [name]:value,
        }));
    }

    async function handleSubmitEmail(e){ //you'd want a user to input their password to confirm their identitiy, no?
        e.preventDefault();

        const newEmailBody =({ 
            email: formValues.email,
            firstName: '',  
            password: '', 
        });

        
        try {            
            const response = await PutEmail(newEmailBody);
            console.log("updating email");
            if(response.status === 200){  
                setToastInfo({header: "Success", body: "Your email was updated", color: "success"});
                SetUpdatedCredentials(true);
                setTimeout(() => {
                    SetUpdatedCredentials(false);
                }, 2500);
                console.log("updated! Status code: ", response.status);
            }
            else{
                console.warn("Update did not happen. Status code: ", response.status);
            }   
        } catch (error) {
            console.warn("Could not update email, it problably already exist");
        }

    }
    const [UpdatedCredentials, SetUpdatedCredentials] = useState();

    async function handlePasswordSubmit(e){
        e.preventDefault();

        const newPasswordBody = {
            password: formValues.password,
        };
  
        const response = await PutPassword(newPasswordBody);

        if(response.status === 200){ 
            setToastInfo({header: "Success", body: "Your password was updated", color: "success"});
            SetUpdatedCredentials(true);
            setTimeout(() => {
                SetUpdatedCredentials(false);
            }, 2500);
        }
        else{
            console.warn("Update did not happen. Status code: ", response.status);
        }  
    }

        //logout function could have a warning modal popping up with a password field (to confirm identity) a Proceed button and Cancel button to opt out.
    async function handleDeleteAccount(e){ 
        e.preventDefault();

        const response = await DeleteUser();
        if(response.status === 204){ // can't get response.ok to work
            console.log("deleting user");
            logout();
        }
        else{
            console.warn("Delete did not happen. Status code: ", response.status);
        }    
    }

    return(
        <>
            {token !== null && 
                <>
                    <h3> Settings </h3>
                    <Container className="mt-5"> 
                        <Form onSubmit={handleSubmitEmail}>
                            <h5>Change Email</h5>
                            <Row className="align-items-end">
                                <Col md= {3}>
                                    <Form.Group controlId="ChangeEmailForm">
                                        <Form.Control
                                            type = "email"
                                            placeholder = "Insert new email"
                                            name = "email"
                                            value={formValues.email}
                                            onChange ={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Button variant="primary" type="submit"> 
                                        Change email
                                    </Button>
                                </Col>
                                <Form.Group className='mb-1' controlId='SignupFormEmailFormat'>
                                    <Form.Text className ='mt-3 text-danger'
                                    disabled = {isValidFormat}> {errorMessage.invalidEmailFormat}</Form.Text>
                                </Form.Group>
                            </Row>
                        </Form >
                    </Container>

                    <Form onSubmit={handlePasswordSubmit} className='= mt-5'>
                        <h5>Change Password</h5>
                        <Form.Group className="mb-1" controlId="ChangePasswordForm">
                            <Form.Control 
                                type="password"
                                placeholder="New password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    
                        <Form.Group className="mb-1" controlId="ConfirmChangePasswordForm">
                            <Form.Control 
                                type="password"
                                placeholder="Confirm new password"
                                name="confirmPassword"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                            />   
                        </Form.Group>

                        <Col>
                            <Button variant="primary" type="submit" disabled ={isValidFormat}> 
                                Change Password
                            </Button>
                        </Col>

                        <Form.Group className='mb-1' controlId='PwdIncorrectFormat'>
                            <Form.Text className ='mt-3 text-danger' disabled = {isValidFormat}> 
                                {errorMessage.invalidPasswordFormat}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className='mb-1' controlId='PwdNotMatching'>
                            <Form.Text className ='mt-3 text-danger' disabled = {isValidFormat}>
                                {errorMessage.passwordMismatch}
                            </Form.Text>
                        </Form.Group>
                    </Form>

                    <Form>
                        <Form.Group className="mt-5">
                            <Button variant="danger" onClick={() => setShowAccountDeletionModal(true)}> 
                                Delete Account
                            </Button>
                        </Form.Group>

                        {showAccountDeletionModal &&      
                            <div className="modal show" style={{ display: 'block', position: 'fixed', marginTop: "300px" }}>
                                <Modal.Dialog >
                                    <Modal.Header>
                                        <Modal.Title>Delete Account</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                        Pressing "Proceed" will permanently delete your account together with bookmarks, rating and search history.
                                        <br></br>
                                        Are you certain you wish to proceed?
                                    </Modal.Body>
                            
                                    <Modal.Footer>
                                        <Button onClick={() => setShowAccountDeletionModal(false)}> Cancel </Button>
                                        <Button type= 'submit' variant='danger' onClick={handleDeleteAccount}> Proceed </Button>
                                    </Modal.Footer>
                                </Modal.Dialog>
                            </div>
                        }

                    </Form>
                    </>
                    }
            <Toaster header={toastInfo.header} body={toastInfo.body} show={UpdatedCredentials} color={toastInfo.color}></Toaster>
            {token === null &&
                <Alert key={"danger"} variant={"danger"}>
                    Warning!! You are not logged in! {" " /* Adds a space between text and "Click here"*/}
                    <Alert.Link onClick={() => navigate("/login")}>{"Click here"}</Alert.Link>. if not redirected within {timer === 1 ? `${timer} second` : `${timer} seconds` }
                </Alert> 
            }
        </>     
    );
}