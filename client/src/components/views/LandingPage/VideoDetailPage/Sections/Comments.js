import {useSelector} from "react-redux";
import React, {useState} from "react";
import axios from "axios";

import {Button, Input} from 'antd';
const {TextArea} = Input;
const {Button} = Button;

function Comments(props) {

    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.currentTarget.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variable = {
            content : Comment,
            writer : user.userData._id,
            postId : props.postId
        }

        axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if(response.data.success){
                    setComment("");
                    props.refreshFunction(response.data.result);
                }else {
                    alert('Failed to save Comment')
                }
            });

    }

    return (
        <div>
            <br/>
            <p>replies</p>
            <hr/>
            {props.CommentLists && props.CommentLists.map((comment,index)=> (
                (!comment.responseTo &&
                        <React.Fragment>
                            {/**singlecomment*/}
                            {/**replycomment*/}
                        </React.Fragment>

                )
            ))}

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <TextArea
                    style={{width : '100%', borderRadius:'5px'}}
                    onChange={handleChange}
                    value{Comment}
                    placeholder="writer some comments"/>
                <br/>
                <Button style={{width:'20%', height:'52px'}} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comments;