import React, { useState, useEffect } from 'react';
import { formatRelative } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { auth, db } from '../firebase';
import SendMessage from './SendMessage';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    messageArea: {
        height: '77vh',
        overflowY: 'auto'
    }
}));

const Chat = () => {
    const classes = useStyles();

    const [ messages, setMessages ] = useState([]);
    let msgContainer = null;

    useEffect(() => {
        console.log("Container", msgContainer);
        if (msgContainer) {
            window.scrollTo({
              behavior: "smooth",
              bottom: msgContainer.offsetBottom
            });
          }
        // msgContainer.scrollToBottom();
        db.collection('messages').orderBy('createdOn').limit(50).onSnapshot(snapShot => {
            setMessages(snapShot.docs.map(doc => ({...doc.data(), id: doc.id})));
        });
    }, [])

    const formatDate = date => {
        let formattedDate = '';
        if(date){
            //date in words relative to current date
            formattedDate = formatRelative(date, new Date());
            //first letter as uppercase
            // formattedDate = formattedDate.chatAt(0).toUpperCase() + formattedDate.slice(1);
        }

        return formattedDate;
    }

    //show the list of messages
    const renderlist = messages.map(message => {
        return(
            <>
                {message.uid === auth.currentUser.uid?
                    <ListItem key={message.id}>
                        <Grid container>
                            <Grid xs={12}>
                                {message?.fileName?.length > 0? 
                                    <a target="__blank" href={message.downloadLink}>
                                        <img src={message.downloadLink} alt="file" style={{height: '80px', objectFit: 'contain', float: 'right'}} />
                                    </a>
                                    :
                                    <ListItemText align="right" primary={message.text}></ListItemText>
                                }
                            </Grid>
                            <Grid xs={12}>
                                <ListItemText align="right" secondary={message.createdOn?.seconds? formatDate(new Date(message.createdOn.seconds * 1000)) : null}></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    :
                    <ListItem key={message.id}>
                        <Grid container>
                            <Grid xs={1} sm={1}>
                                <ListItemIcon>
                                    <Avatar alt="User" src={message.photoURL? message.photoURL: "https://www.w3schools.com/howto/img_avatar2.png"} />
                                </ListItemIcon>
                            </Grid>
                            <Grid xs={11} sm={11}>
                                {message.displayName? 
                                    <ListItemText primary={message.displayName}>{message.displayName}</ListItemText>
                                    : 
                                    <ListItemText primary="Anonymous">Anonymous</ListItemText>
                                }
                            </Grid>
                            <Grid xs={12}>
                                {message?.fileName?.length > 0? 
                                    <a target="__blank" href={message.downloadLink}>
                                        <img src={message.downloadLink} alt="file" style={{height: '80px', objectFit: 'contain'}} />
                                    </a>
                                    :
                                    <ListItemText align="left" primary={message.text}></ListItemText>
                                }
                            </Grid>
                            <Grid xs={12}>
                                <ListItemText align="left" secondary={message.createdOn?.seconds? formatDate(new Date(message.createdOn.seconds * 1000)) : null}></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                }
            </>
        );
    });

    return(
        // <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3} key="1">
                    Users
                </Grid>
                <Grid item xs={12} sm={9} key="2">
                    <Grid container component={Paper} className={classes.messageArea} ref={el => {msgContainer = el}}>
                        <Grid item xs={12} sm={12} key="3">
                            <List className={classes.messageArea}>
                                {renderlist}
                            </List>
                        </Grid>
                    </Grid>
                    <SendMessage/>
                </Grid>
            </Grid>
        // </div>
    );
};

export default Chat;
