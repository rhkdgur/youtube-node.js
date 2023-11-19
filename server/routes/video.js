const express = require('express');
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    description : (req , file, db) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter : (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only jpg, png, mp4 is allowed '), false);
        }
    }
})

var upload = multer({ storage: storage }).single("file");

//=========================
//          user
//=========================

//파일 등록
router.post("/uploadFiles", (req,res) => {
   upload(req,res, err => {
       if(err){
           return res.json({success : false, err})
       }
       return res.json({success: true, filePath : res.req.file.path, fileName : res.req.file.filename })
   })
});

/**
 * 업로드 정보 등록
 */
router.post("/uploadVideo",(req,res) => {
   const video = new Video(req.body);

   video.save((err,video) => {
       if(err) return res.status(400).json({success: false, err})
       return res.status(200).json({
           success : true
       })
   })
});

//섬네일 등록
router.post("/thumbnail", (req,res) => {
   let thumbsFilePath = "";
   let fileDuration = "";

   ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
      fileDuration = metadata.format.duration;
   });

   ffmpeg(req.body.filePath)
       .on('filenames',function(filenames){
            thumbsFilePath = "uploads/thumbnails/"+filenames[0];
       })
       .on('end', function(){
          return res.json({ success : true, thumbsFilePath:thumbsFilePath, fileDuration : fileDuration})
       }).screenshots({
        count : 3,
        folder : 'uploads/thumbnails',
        size : '320x240',
        filename : 'thumbnail-%b.png'
       });
});

/**
 * 비디오 목록 조회
 */
router.get("/getVideos",(req,res) => {
    Video.find()
        .populate('writer')
        .exec((err,videos) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, videos})
        })
});

/**
 * 상세 비디오 정보 가져오기
 */
router.post('/getVideo' , (res, req) =>{

    Video.findOne({"_id" : req.body.videoId})
        .populate('writer')
        .exec((err,video)=>{
            if(err) return res.status(400).send (err);
            res.status(200).json({success : true, video})
        })
});


module.exports = router;