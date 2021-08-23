import React from 'react';
import firebase from 'firebase/app';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import { auth } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
}));

const Header = ({user}) => {
    const classes = useStyles();

    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    const signOut = () => {
        auth.signOut();
    }

    return(
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        WeChat
                    </Typography>
                    {user?
                        <Button color="inherit" onClick={signOut}>Sign Out</Button>
                        :
                        <Button color="inherit" onClick={signIn}>Sign In</Button>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;