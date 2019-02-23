const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({

    idNews: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
    Author: {
        type: String,
        default: 'Anonymous',
        enum: ['user', 'admin', 'Anonymous']
    },
    comments: {
        type: String,
        required: true,
        unique: true
    }
});

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;