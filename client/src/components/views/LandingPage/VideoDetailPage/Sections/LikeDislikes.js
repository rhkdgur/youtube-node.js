import {Icon, Tooltip} from "antd";
import {useState} from "react";


function LikeDislike(props) {

    const [Likes, setLikes] = useState(0);
    const [Dislikes , setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction , setDislikeAction] = useState(null);

    let variable = {};

    if(props.video){
        variable = { videoId : props.videoId, userId : props.userId}
    } else {
        variable = { commentId : props.commentId , userId : props.userId}
    }

    return (
        <React.Fragment >
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"/>
                </Tooltip>
                <span style={{paddingLeft : '8px' , cursor : 'auto'}}>{/**like*/}</span>
            </span>
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"/>
                </Tooltip>
                <span style={{paddingLeft: '8px', cursor : 'auto'}}>{/**dislike*/}</span>
            </span>
        </React.Fragment>
    )
}

export  default  LikeDislike;