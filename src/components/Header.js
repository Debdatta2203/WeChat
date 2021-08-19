import React from 'react';
import firebase from 'firebase/app';

import { auth } from '../firebase';

const Header = ({user}) => {
    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    const signOut = () => {
        auth.signOut();
    }

    return(
        <div className="ui secondary pointing menu" style={{paddingBottom: '5px', paddingTop: '5px'}}>
            <div className="item">WeChat</div>
            <div className="right menu">
                {user ?
                    <button className="ui google plus button" style={{marginRight: '10px'}} onClick={signOut}>
                        <i className="google plus icon"></i>SignOut
                    </button> : 
                    <button className="ui google plus button" style={{marginRight: '10px'}} onClick={signIn}>
                        <i className="google plus icon"></i>SignIn
                    </button>
                }
            </div>
        </div>
    );
};

export default Header;