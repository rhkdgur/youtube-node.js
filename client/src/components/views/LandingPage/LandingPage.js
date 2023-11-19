import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";

function LandingPage() {

    const [Videos, setVideos] = useState([]);

    useEffect(() => {
        
        //비디오 목록 조회
        axios.get('/api/video/getVideos')
            .then(response => {
                if(response.data.success){
                    setVideos(response.data.videos);
                }else {
                    alert('Failed to get Videos');
                }
            })
    }, []);

    return (
        <>
            <div className="app">
                <FaCode style={{ fontSize: '4rem' }} /><br />
                <span style={{ fontSize: '2rem' }}>Let's Start Coding!</span>
            </div>
            <div style={{ float: 'right' }}>Thanks For Using This Boiler Plate by John Ahn</div>
        </>
    )
}

export default LandingPage
