const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NewsSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    data:{
        type: String,
        required: true,
        unique: true
    },
    image: String,
    time: String
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;