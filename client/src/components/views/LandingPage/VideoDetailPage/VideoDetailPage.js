import React, {useEffect, useState} from 'react';
import { List, Avatar, Row ,Col} from 'antd';
import axios from "axios";
import SideVideo from "./Sections/SideVideo";


function VideoDetailPage (props) {

    const videoId = props.match.params.videoId;
    const [Video , setVideo] = useState([]);
    const [CommentLists, setCommentLists] = useState([]);

    const videoVariable = {
        videoId : videoId
    }

    useEffect(() => {

        //비디오 상세 정보 가져오기
        axios.post('/api/video/getVideo', videoVariable)
            .then( response => {
                if(response.data.success){
                    setVideo(response.data.video);
                } else{
                    alert('Failed to get video Info');
                }
            })

    }, []);

    if(Video.writer){
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{width: '100%', padding:'3rem 4em'}}>
                        <video style={{width : '100%'}} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer && Video.writer.image}/>}
                                title={<a href="https://ant.desing">{Video.title}</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    {SideVideo}
                </Col>
            </Row>
        )
    }else {
        return (
            <div>Loading...</div>
        )
    }
}


export default VideoDetailPage

