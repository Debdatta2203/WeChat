import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { auth, db, storage } from '../firebase';


const useStyles = makeStyles((theme) => ({
    emojiDropdown: {
        position: 'absolute',
        marginTop: '1px',
        font: '10px',
        bottom: '100%' /* added this attribute */
    }
}));

const SendMessage = () => {
    const classes = useStyles();

    const [ msg, setMsg ] = useState('');
    const [ file, setFile ] = useState(null);
    const [ showEmoji, setShowEmoji ] = useState(false);
    let fileInput = null;
    let emojiPicker = null;

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
        console.log("Message", emojiPicker);
        if(emojiPicker){
            console.log("Menu open");
            emojiPicker.addEventListener("click", closeEmoji);
        }
    };

    const closeEmoji = e => {
        setShowEmoji(false);
        if(emojiPicker){
            console.log("Menu Closed");
            emojiPicker.removeEventListener("click", closeEmoji);
        }
    }

    const hendleChange = e => {
        if(e.target.files[0]){
            setFile(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        console.log("Message", fileInput);
        fileInput.click();
    }

    return(
        <form onSubmit={formSubmit}>  
            <Grid container style={{padding: '20px'}} spacing={2}>
                <Grid xs={11} key="1">
                    <TextField value={msg} 
                        onChange={setValue} 
                        id="outlined-basic-email" 
                        label="Type Something"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                              <InputAdornment>
                                {showEmoji === false?
                                    <>
                                        <span onClick={openEmoji} style={{cursor: 'pointer'}}>
                                            {String.fromCodePoint(0x1f60a)}
                                        </span>
                                        <span ref={menu => {emojiPicker = menu}} style={{display: 'none'}}>
                                            <Picker onSelect={addEmoji} emojiTooltip={true} />
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span onClick={openEmoji} style={{cursor: 'pointer'}}>
                                            {String.fromCodePoint(0x1f60a)}
                                        </span>
                                        <span ref={menu => {emojiPicker = menu}}>
                                            <Picker onSelect={addEmoji} emojiTooltip={true} />
                                        </span>
                                    </>
                                }
                                <IconButton onClick={triggerFileInput}>
                                  <AttachFileIcon />
                                </IconButton>
                              </InputAdornment>
                            )
                    }} />
                    <input ref={input => {fileInput = input}} onChange={hendleChange} type="file" multiple={false} id="file-upload" style={{display: 'none'}} />
                </Grid>
                <Grid xs={1} align="right" key="2">
                    <Fab type="submit" color="primary" aria-label="add"><SendIcon /></Fab>
                </Grid>
            </Grid>
        </form>
    );

};

export default SendMessage;

//     return(
//         <div className="ui comments">
//             {/* */}
//             <form onSubmit={formSubmit} className="ui reply form">
//                 <div className="action input field">
//                     {showEmoji === false? 
//                         <>
//                             <p onClick={openEmoji} className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px'}}>{String.fromCodePoint(0x1f60a)}</p>  
//                             {/* <p className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px'}}>
//                                 u
//                             </p>  */}
//                         </> 
//                         : 
//                         <p onClick={openEmoji} className="ui button" style={{backgroundColor: 'transparent', fontSize: '18px', padding: '2px', position: 'absolute'}}>{String.fromCodePoint(0x1f60a)}
//                             <span>
//                                 <Picker onSelect={addEmoji} emojiTooltip={true} />
//                             </span> 
//                         </p>  
//                     }
//                     <input value={msg} onChange={setValue} type="text" placeholder="Type Message" autoComplete="off" style={{width: '75%'}} />
//                     <input onChange={hendleChange} type="file" multiple={false} id="file-upload" />
//                     <button type="submit" className="ui button" style={{height: '39px'}}>Send</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default SendMessage;