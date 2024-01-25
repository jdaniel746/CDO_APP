import App from './app/index';
import React from 'react';
import { getAuth, signInAnonymously} from 'firebase/auth';
import { getToken, onMessage} from 'firebase/messaging';
import { messaging} from './firebase';
import { ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App () { 
    const loguearse = () => { 
        signInAnonymously(getAuth()).then(usuario =>
            console.log(usuario));
    }
    const activarMensajes = async () => {
        const token = await getToken(messaging, { 
            vapidKey:
            "BHWLnOejbIG0uXxOv9X9gpCQjqsVZ-Y_5z2IrNg4yi8utf4z4o04XehR9oyXmfzTTslh7-SHjK60yNU6dV-_wAs"
        }).catch(error => console.log("error al generar token"))

        if (token) console.log("tu token:", token);
        if (!token) console.log("no tienes token");
    }

    React.useEffect(() => {
        onMessage(messaging, message =>{
            console.log("tu mensaje:", message);
            toast(message.notification.title)
        })

    }, []);


}

export default App;
