import React, { useState } from 'react';
import firebase from 'firebase/app';

import { auth, db } from '../firebase';


const SendMessage = () => {
    const [ msg, setMsg ] = useState('');

    const setValue = e => {
        setMsg(e.target.value);
    }

    const formSubmit = async e => {
        e.preventDefault();
        const { uid, displayName, photoURL } = auth.currentUser;
        await db.collection('messages').add({
            text: msg,
            photoURL,
            uid,
            displayName,
            createdOn: firebase.firestore.FieldValue.serverTimestamp()
        });  
        //empty message
        setMsg('');
    }

    return(
        <form onSubmit={formSubmit} className="ui reply form">
            <div className="action input field">
                <input value={msg} onChange={setValue} type="text" placeholder="Type Message" autoComplete="off" style={{width: '85%'}} />
                <button type="submit" className="ui button" style={{height: '39px'}}>Send</button>
            </div>
        </form>
    );
};

export default SendMessage;