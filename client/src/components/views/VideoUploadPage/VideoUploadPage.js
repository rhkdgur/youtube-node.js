import React, {useState} from 'react';
import { Typography,Button,Form, message,Input,Icon} from "antd";
import {useSelector} from "react-redux";
import axios from "axios";
import Dropzone from 'react-dropzone';

const {Title} = Typography;
const {TextArea} = Input;


const Private = [
    {   value : 0 , label : 'Private'},
    {   value : 1 , label : 'Public'}
]

const Category = [
    { value : 0, label : "File & Animation"},
    { value : 1, label : "Autos & Vehicles"},
    { value : 2, label : "Music"},
    { value : 3, label : "Pets & Animals"},
    { value : 4, label : "Sports"}
]

function VideoUploadPage(props) {

    const user = useSelector(state => state.user);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState("File & Animation");
    const [categories, setCategories] = useState("");
    const [filePath, setFilePath] = useState("");
    const [duration, setDuration] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const handleChangeTitle = (event) => {
        setTitle(event.currentTarget.value);
    }

    const handleChangeDescription = (event) => {
        setDescription(event.currentTarget.value);
    }

    const handleChangeOne = (event) => {
        setPrivacy(event.currentTarget.value);
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if(user.userData && !user.userData.isAuth){
            return alert('Please Log int First');
        }

        // validator 체크
        if(title === "" || description === ""
            || categories === "" || filePath === "" ||
        duration === "" || thumbnail === ""){
            return alert('Please first fill all the fields')
        }

        const variable = {
            writer : user.userData._id,
            title : title,
            description : description,
            privacy : privacy,
            filePath : filePath,
            category : categories,
            duration : duration,
            thumbnail : thumbnail
        }

        //업로드 정보 등록
        axios.post('/api/video/uploadVideo', variable)
            .then(response => {
                if(response.data.success){
                    alert('video upload success');
                    props.history.push('/')
                }else{
                    alert('Failed to upload video')
                }
            });
    }

    //파일 드롭 처리
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header : {'content-type' : 'multipart/form-data'}
        }

        formData.append("file",files[0]);

        //파일 처리
        axios.post('/api/video/uploadFiles',formData, config)
            .then(response => {
                if(response.data.success){
                    let variable = {
                        filePath : response.data.filePath,
                        fileName : response.data.fileName
                    }

                    setFilePath(response.data.filePath)

                    //thumnail 등록
                    axios.post('/api/video/thumbnail',variable)
                        .then(response=>{
                            if(response.data.success){
                                setDuration(response.data.fileDuration)
                                setThumbnail(response.data.thumbsFilePath)
                            }else{
                                alert('Failed to make the thumbnails');
                            }
                        })
                } else {
                    alert('failed to save the video in server');
                }
            })
    }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{ textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}>

                        {({getRootProps, getInputProps}) => (
                            <div style={{width:'300px',height:'240px',border:'1px solid lightgray', display:'flex',alignItems:'center'
                                ,justifyContent:'center'}}
                                 {...getRootProps()}
                            >
                                <input {...getInputProps()}/>
                                <Icon type="plus" style={{fontSize:'3rem'}}/>
                            </div>
                        )}

                    </Dropzone>

                    {thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${thumbnail}`} alt="haha" />
                        </div>
                    }
                </div>

            <br/><br/>
            <label>Title</label>
            <Input onChange={handleChangeTitle} value={title} />

            <br/><br/>
            <label>Description</label>
            <TextArea onChange={handleChangeDescription} value={description}/>

            <br/><br/>

            <select onChange={handleChangeOne}>
                {Private.map((item,index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br/><br/>

            <select onChange={handleChangeTwo}>
                {Category.map((item,index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br/><br/>

            <Button type="primary" size="large" onClick={onSubmit}>Submit</Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage