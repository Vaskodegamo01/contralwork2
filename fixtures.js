const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const News = require('./models/News');
const Comments = require('./models/Comments');


mongoose.connect(config.db.url + '/' + config.db.name);

const db = mongoose.connection;

db.once('open', async () => {
    try {
        await db.dropCollection('users');
        await db.dropCollection('fotos');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    console.log('collection is dropped');

    const [admin] = await User.create({
        username:'user',
        password: '123',
        role: "user"
},{
        username:'admin',
        password: '123',
        role: "admin"
    });
    console.log('user created');

    const [] = await News.create({});

    console.log("News created");


    const [] = await Comments.create({});

    console.log("Comments created");


    db.close();
});
