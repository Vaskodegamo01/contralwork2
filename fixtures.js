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
        role: "user",
        token: "7aerDD0mh"
},{
        username:'admin',
        password: '123',
        role: "admin",
        token: "7terDD0mh"
    });
    console.log('user created');

    const [news1, news2, news3] = await News.create({
        title: "Большая головоломка: кто будет собирать осколки — доклад Мюнхенской конференции по безопасности1",
        data: "В начале 2019 года возникает все более устойчивое ощущение, что мир сталкивается не с бесконечной чередой больших и маленьких кризисов, а с более фундаментальной проблемой. Как сказал Роберт Каган, «ничего хорошего не будет». Многие сегодня считают, что либеральный мировой порядок настолько нарушен, что вернуться к прежнему положению вещей будет трудно1.",
        image: "3ayvCLb9jkq9gEWFe7pue.jpeg",
        time: new Date()
    },{
        title: "Большая головоломка: кто будет собирать осколки — доклад Мюнхенской конференции по безопасности2",
        data: "В начале 2019 года возникает все более устойчивое ощущение, что мир сталкивается не с бесконечной чередой больших и маленьких кризисов, а с более фундаментальной проблемой. Как сказал Роберт Каган, «ничего хорошего не будет». Многие сегодня считают, что либеральный мировой порядок настолько нарушен, что вернуться к прежнему положению вещей будет трудно2.",
        image: "3ayvCLb9jkq9gEWFe7pue.jpeg",
        time: new Date()
    },{
        title: "Большая головоломка: кто будет собирать осколки — доклад Мюнхенской конференции по безопасности3",
        data: "В начале 2019 года возникает все более устойчивое ощущение, что мир сталкивается не с бесконечной чередой больших и маленьких кризисов, а с более фундаментальной проблемой. Как сказал Роберт Каган, «ничего хорошего не будет». Многие сегодня считают, что либеральный мировой порядок настолько нарушен, что вернуться к прежнему положению вещей будет трудно3.",
        image: "3ayvCLb9jkq9gEWFe7pue.jpeg",
        time: new Date()
    });

    console.log("News created");


    const [] = await Comments.create({
        idNews: news1._id,
        author: "Anonymous",
        comments: "всякая лабуда1"
    },{
        idNews: news1._id,
        author: "Anonymous",
        comments: "всякая лабуда2"
    },{
        idNews: news2._id,
        author: "Anonymous",
        comments: "всякая лабуда3"
    },{
        idNews: news2._id,
        author: "Anonymous",
        comments: "всякая лабуда4"
    },{
        idNews: news3._id,
        author: "Anonymous",
        comments: "всякая лабуда5"
    },{
        idNews: news3._id,
        author: "Anonymous",
        comments: "всякая лабуда6"
    });

    console.log("Comments created");


    db.close();
});
