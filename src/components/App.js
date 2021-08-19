import React, { useState, useEffect } from 'react';

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
        <div>
            {user ? 
                <div>
                    <Header user={user}/>
                    <Chat/>
                </div>
                : 
                <div>
                    <Header user={user}/>
                    Log In to continue chatting!
                </div>
            }
        </div>
    );
};

export default App;



// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase';
// import { auth } from '../firebase';

// import Header from './Header';
// import Chat from './Chat';

// const App = () => {
//     const [ user, setUser ] = useState(() => auth.currentUser);
//     const [ intializing, setInitializing ] = useState(true);
//     // console.log("Db", db);

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(user => {
//             if(user){
//                 setUser(user);
//             }
//             else{
//                 setUser(null);
//             }
//             if(intializing){
//                 setInitializing(false);
//             }
//         });

//         return unsubscribe;
//     }, [ intializing ]);

//     //signIn
//     const signIn = async () => {
//         //Google provider object
//         const provider = new firebase.auth.GoogleAuthProvider();
//         //language set to default browser preference
//         // auth.useDeviceLanguage();
//         auth.languageCode = 'en';
//         console.log(auth.languageCode);
//         try{
//             await auth.signInWithPopup(provider);
//         }
//         catch(error){
//             console.log(error.message);
//         }
//     };

//     //signOut
//     const signOut = async () => {
//         try{
//             await auth.signOut();
//         }
//         catch(error){
//             console.log(error.message);
//         }
//     }
//     console.log('user',user);

//     return(
//         <div>
//             {
//                 user ? 
//                     <Header onClick={signOut} >SignOut</Header>
//                 :
//                     <Header onClick={signIn} >SignIn</Header>
//             }
//             <Chat user={user}/>
//         </div>
//     );
// };

// export default App;