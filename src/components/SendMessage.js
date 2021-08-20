import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import { auth, db } from '../firebase';


const SendMessage = () => {
    const [ msg, setMsg ] = useState('');
    const [ showEmoji, setShowEmoji ] = useState(false);

    const setValue = e => {
        setMsg(e.target.value);
    };

    const addEmoji = e => {
        let emoji = e.native;
        setMsg(msg + emoji);
    };

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
    };

    const openEmoji = e => {
        e.preventDefault();
        setShowEmoji(true);
        
    };

    

    return(
        <div className="ui comments">
            {/* */}
            <form onSubmit={formSubmit} className="ui reply form">
                <div className="action input field">
                    {showEmoji === false? 
                        <p onClick={openEmoji} className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px'}}>{String.fromCodePoint(0x1f60a)}</p>  
                        : 
                        <p onClick={openEmoji} className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px', position: 'absolute'}}>{String.fromCodePoint(0x1f60a)}
                            <span>
                                <Picker onSelect={addEmoji} emojiTooltip={true} />
                            </span> 
                        </p>  
                    }
                    <input value={msg} onChange={setValue} type="text" placeholder="Type Message" autoComplete="off" style={{width: '84%'}} />
                    <button type="submit" className="ui button" style={{height: '39px'}}>Send</button>
                </div>
            </form>
        </div>
    );
};

export default SendMessage;