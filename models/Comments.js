const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({

    idNews: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    comments: {
        type: String,
        required: true,
        unique: true
    }
});

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;