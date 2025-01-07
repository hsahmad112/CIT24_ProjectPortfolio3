import { useEffect, useState } from "react";
import { Toast } from 'react-bootstrap';


export default function Toaster({header, body, show, color}){ //Custom Toaster - displays notifications, based on need
    const [showPop, setShowPop] = useState(show); 

    useEffect(() =>{
        setShowPop(show); // show is a boolean
    },[show]);

    if(!showPop) return;

    return (
        <Toast style={{position: "fixed"}} className="to-front" bg={color}
         onClose={() => setShowPop(false)} show={show} delay={3000} autohide>
            <Toast.Header>
                <strong className="me-auto">{header}</strong>
            </Toast.Header>
            <Toast.Body style={{color: "white"}}>
                {body} 
            </Toast.Body>
        </Toast>
    );
}

