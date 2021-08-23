import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import { auth, db, storage } from '../firebase';


const SendMessage = () => {
    const [ msg, setMsg ] = useState('');
    const [ file, setFile ] = useState(null);
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
        if(file){
            const uploadTask = storage.ref('file').child(file.name).put(file);
            uploadTask.on("state_changed",
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                error => {
                    console.log("Error", error);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(
                        async downloadURL => {
                            console.log("File URL", downloadURL);
                            await db.collection('messages').add({
                                fileName: file.name.toString(),
                                downloadLink: downloadURL.toString(),
                                text: msg,
                                photoURL,
                                uid,
                                displayName,
                                createdOn: firebase.firestore.FieldValue.serverTimestamp()
                            }); 
                        }
                    )
                }
            );
        }
        else{
            await db.collection('messages').add({
                text: msg,
                photoURL,
                uid,
                displayName,
                createdOn: firebase.firestore.FieldValue.serverTimestamp()
            });  
        }
        //empty message
        setMsg('');
        //empty file
        setFile(null);
    };

    const openEmoji = e => {
        e.preventDefault();
        setShowEmoji(true);
        
    };

    const hendleChange = e => {
        if(e.target.files[0]){
            setFile(e.target.files[0]);
        }
    };

    return(
        <div className="ui comments">
            {/* */}
            <form onSubmit={formSubmit} className="ui reply form">
                <div className="action input field">
                    {showEmoji === false? 
                        <>
                            <p onClick={openEmoji} className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px'}}>{String.fromCodePoint(0x1f60a)}</p>  
                            <p className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px'}}>
                                u
                            </p> 
                        </> 
                        : 
                        <p onClick={openEmoji} className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px', position: 'absolute'}}>{String.fromCodePoint(0x1f60a)}
                            <span>
                                <Picker onSelect={addEmoji} emojiTooltip={true} />
                            </span> 
                        </p>  
                    }
                    <input value={msg} onChange={setValue} type="text" placeholder="Type Message" autoComplete="off" style={{width: '75%'}} />
                    <input onChange={hendleChange} type="file" multiple={false} id="file-upload" />
                    <button type="submit" className="ui button" style={{height: '39px'}}>Send</button>
                </div>
            </form>
        </div>
    );
};

export default SendMessage;