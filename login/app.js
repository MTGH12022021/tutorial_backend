// xu ly bieu mau
const express = require('express');
const { request } = require('http');
// module xu ly bieu mau phan tich cu phap  
const bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions

const path = require('path');
const app = express();


// su dung phan mem trung gian
app.use('/css', express.static(__dirname + '/html/css'));
// app.use('/w3_band', express.static(__dirname + '/w3_band'));
// app.use('/assets', express.static(__dirname + '/w3_band/assets'));

// su dung phan mem trung gian theo kieu mo trong va phan tich tai khoan mat khau duoi dang chuoi nen la false
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (request, respond) => {
    respond.sendFile(path.join(__dirname, './html', 'index.html'));
});

// app.get('/logout', (request, respond) => {
//     respond.sendFile(path.join(__dirname, './w3_band', 'index.html'));
// });

// cho phep nguoi dung dua thong tin len server
app.post('/logout', (request, respond) => {
    //https://www.w3schools.com/js/js_json_parse.asp
    // const obj = JSON.parse(JSON.stringify(request.body)); // req.body = [Object: null prototype] { title: 'product' }
    // console.log(typeof (request.body));

    console.log(request.body);

    //database word here
    respond.send('sucessfully posted data');
});

app.listen(3000); 