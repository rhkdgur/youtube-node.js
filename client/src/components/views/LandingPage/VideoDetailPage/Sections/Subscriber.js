import {useEffect, useState} from "react";
import axios from "axios";

function Subscriber(props) {
    const userTo = props.userTo;
    const userFrom = props.userFrom;

    const [subscribeNumber, setSubscribeNumber] = useState(0);
    const [subscribed, setSubscribed] = useState(false);

    const onSubscribe = () => {
        let subscribeVariables = {
            userTo : userTo,
            userFrom : userFrom
        }

        if(subscribed){
            axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then( response => {
                    if(response.data.success()){
                        setSubscribeNumber(subscribeNumber - 1);
                        setSubscribed(!subscribed);
                    }else{
                        alert('Failed to unsubscribe');
                    }
                })
        }else {
            axios.post('/api/subscribe/subscribe',subscribeVariables)
                .then(response => {
                    if(response.data.success){
                        setSubscribeNumber(subscribeNumber + 1);
                        setSubscribed(!subscribed);
                    } else {
                        alert('Failed to subscribe');
                    }
                })
        }
    }

    useEffect(() => {
        const subscribeNumberVariables = { userTo : userTo ,userFrom : userFrom}
        
        //구독자 수
        axios.post ('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('Failed to get subscriber Number');
                }
            })

        //구독 여부
        axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if(response.data.success){
                    setSubscribed(response.data.subscribed);
                }else{
                    alert('Failed to get Subscribed Information');
                }
            })
    }, []);

    return (
        <div>
            <button
                onClick={onSubscribe}
                style={{backgroundColor:`${Subscribed ? '#AAAAAA' : '#CC0000'}`,
            boarderRadius : '4px', color : 'white',
            padding : '10px 16px' , fontWeight : '500', fontSize : '1rem', textTransform : 'uppercase' }}
            >
                {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscriber;