const express = require("express");
const multer = require("multer");
const path = require("path");
const nanoid = require("nanoid");

const config = require("../config");
const News = require("../models/News");
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
router.get("/", auth, (req, res)=>{
    News.find({}, {data: 0})
        .then(result => res.send(result))
        .catch((e)=>res.send(e).status(500))
});

router.get("/:id",  (req, res)=>{
    News.findOne(req.params.id)
        .then(result => res.send(result))
        .catch((e)=>res.send(e).status(500))
});

router.post("/", [auth, upload.single("image")], (req, res) => {
    const newsData = req.body;
    if (req.file) newsData.image = req.file.filename;
    const news = new News(newsData);
    news.save()
        .then( () => res.send(newsData))
        .catch(e => res.send(e).status(500))

});

router.delete('/:id', [auth, permit('admin')],(req, res)=>{
    News.deleteOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch((e)=>res.send(e).status(500))
});

module.exports = router;