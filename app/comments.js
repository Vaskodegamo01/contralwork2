const express = require("express");
const multer = require("multer");
const path = require("path");
const nanoid = require("nanoid");

const Comments = require("../models/Comments");
const auth = require("../middlewares/middleware");
const permit = require("../middlewares/permit");

const upload = multer();


const router = express.Router();

router.get("/", async (req, res)=>{
    if(req.query.news_id){
        Comments.find({idNews: req.query.news_id})
            .then(result => res.send(result))
            .catch((e)=>res.send(e).status(500))
    }else{
        Comments.find()
            .then(result => res.send(result))
            .catch((e)=>res.send(e).status(500))
    }
});

router.post("/", [auth, upload.none()], (req, res) => {
    const commentsData = req.body;
    const comments = new Comments(commentsData);
    comments.author = req.user._id;
    comments.save()
        .then( () => res.send(commentsData))
        .catch(e => res.send(e).status(500))

});

router.delete('/:id', [auth, permit('admin')],(req, res)=>{
    Comments.deleteOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch((e)=>res.send(e).status(500))
});

module.exports = router;