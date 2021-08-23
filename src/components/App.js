import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';

import { auth } from '../firebase';

import Header from './Header';
import Chat from './Chat';

const App = () => {
    const [ user, setUser ] = useState(() => auth.currentUser);
    const [ intializing, setInitializing ] = useState(true);
    
    useEffect(() => {
        const response = auth.onAuthStateChanged(u => {
            if(u){
                setUser(u);
            }
            else{
                setUser(null);
            }
            if(intializing){
                setInitializing(false);
            }
        });

        return response;
    }, [ intializing ]);
    
    return(
        <div className="main-container">
            <Header user={user}/>
            <Container maxWidth="lg">
                {user?
                    <Chat/>
                    :
                    'Sign In to continue chatting!'
                }
            </Container>
        </div>
    );
};

export default App;