import React, { useState, useEffect } from 'react';
import { formatRelative } from 'date-fns'

import { auth, db } from '../firebase';
import SendMessage from './SendMessage';

const Chat = () => {
    const [ messages, setMessages ] = useState([]);

    useEffect(() => {
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

    const renderlist = messages.map(message => {
        // console.log("Message", message);
        return(
            <div className={"comment " + (message.uid === auth.currentUser.uid? 'sent': 'received')} key={message.id}>
                {message.uid === auth.currentUser.uid? null :
                    <a className="avatar">
                        {message.photoURL? 
                            <img src={message.photoURL} alt="image" />
                        :
                            <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="image" />
                        }
                    </a>
                }
                <div className="content">
                    <a className="author">
                        {message.displayName? message.displayName : 'Anonymous'}, 
                    </a>
                    <div className="metadata">
                        <div className="date">
                            {message.createdOn?.seconds? formatDate(new Date(message.createdOn.seconds * 1000)) : null}
                        </div>
                    </div>
                    <div className="text">
                        {message.text}
                    </div>
                </div>
            </div>
        );
    });

    return(
        <div className="ui container" style={{height: '300px'}}>
            <div className="ui comments" style={{height: '78vh !important'}}>
                {renderlist}
            </div>
            <SendMessage/>
        </div>
    );
};

export default Chat;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';

// const Chat = ({user}) => {
//     const [ messages, setMessages ] = useState([]);

//     useEffect(() => {
//         db.collection('messages').orderBy('createdOn').limit(50).onSnapshot(snapShot => {
//             setMessages(snapShot.docs.map(doc => doc.data()))
//         });
//         console.log('message', messages);
//     }, []);

//     if(user){
//         return(
//             <div>
//                 {messages.map(message => {
//                     <div>
//                         {message.text}
//                     </div>
//                 })}
//             </div>
//         );
//     }
//     return(
//         <div>Login to continue conversation on WeChat.</div>
//     );
// };

// export default Chat;