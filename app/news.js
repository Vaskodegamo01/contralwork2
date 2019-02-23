const express = require("express");
const multer = require("multer");
const path = require("path");
const nanoid = require("nanoid");

const config = require("../config");
const News = require("../models/News");
const User = require("../models/User");

const Comments = require("../models/Comments");
const auth = require("../middlewares/middleware");
const permit = require("../middlewares/permit");

const storage = multer.diskStorage({
    destination(req, file, cd){
        cd(null, config.uploadPath)
    },
    filename(req, file, cd){
        cd(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});


const router = express.Router();

router.get("/", async (req, res)=>{
    let rr=[];
    const token =req.get("Token");
    const user = await User.findOne({token});
    let tmp = await News.find({}, {data: 0});

    for(let i=0; i<tmp.length; i++){
        rr.push(JSON.parse(JSON.stringify(tmp[i])));
        rr[i].button='0';
        if(user){
            if(user.role === 'admin'){
                rr[i].button='1';
            }else{
                rr[i].button='0';
            }
        }

    }
    res.send(rr);
});

router.get("/:id", (req, res)=>{
    News.findOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch((e)=>res.send(e).status(500))
});

router.post("/", [auth, upload.single("image")], (req, res) => {
    const newsData = req.body;
    if (req.file) newsData.image = req.file.filename;
    const news = new News(newsData);
    news.time = new Data();
    news.save()
        .then( () => res.send(newsData))
        .catch(e => res.send(e).status(500))

});

router.delete('/:id', [auth, permit('admin')],(req, res)=>{
    News.deleteOne({_id: req.params.id})
        .then(()=>{
            Comments.deleteMany({_id: req.params.id})
                .then(result => res.send(result))
                .catch((e)=>res.send(e).status(500))
        })
        .catch((e)=>res.send(e).status(500))
});

module.exports = router;
