const express = require('express');
const router = express.Router();


const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//===============================
//          Subscribe
//===============================


//구독자 수
router.get("/subscribeNumber", (req,res) => {
    Subscriber.find({ "userTo" : req.body.userTo })
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({success : true, subscribeNumber : subscribe.length});
        })
})

//자체 구독 여부
router.get("/subscribed", (req,res) => {
    Subscriber.find({"userTo" : req.body.userTo , "userFrom" : req.body.userFrom})
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);

            let result = false;
            if(subscribe.length > 0){
                result = true;
            }
            res.status(200).json({ success : true, subscribed : result });
        })
})

//구독 등록
router.post("/subscribe", (req,res) => {
    const subscribe = new Subscriber(req.body);

    subscribe.save((err,doc) => {
        if(err) return res.json({success : false, err});
        return res.status(200).json({success: true});
    })
})

//구독 삭제
router.post("/unSubscribe", (req,res) => {
    Subscriber.findOneAndDelete({ userTo : req.body.userTo , userFrom : req.body.userFrom })
        .exec((err, doc) => {
            if(err) return res.status(400).json({success : false , err});
            res.status(200).json({success:true, doc});
        })
});

module.exports = router;