//EJS dung de tao trang web dong gui tep dong (nhung code html vao de tao file html khi dua len web)
const express = require('express');
const path = require('path');
const app = express();

app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use('/js', express.static(path.join(__dirname, 'static/js')));

// dung de gan hoac dat ten cai dat thanh gia tri (nhung co mot so ten nhat dung de cau hinh cho phuong thuc nay)
//https://www.tutorialspoint.com/express-js-app-set-method
app.set('view engine', 'ejs');

app.get('/:userQuery', (request, respond) => {
    //https://viblo.asia/p/nodejs-bai-3template-engines-voi-ham-render-va-viet-ma-html-voi-pug-WAyK8dj9KxX
    //https://expressjs.com/en/api.html#res.render
    respond.render('index.ejs', {
        data: {
            userQuery: request.params.userQuery
        }
    });

});



app.listen(3000);