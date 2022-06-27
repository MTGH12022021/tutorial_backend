// xu ly bieu mau
const https = require('https');
const path = require('path');
const express = require('express');
// module xu ly bieu mau phan tich cu phap  
const bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions


//module xu ly coi la cau truc file json co dung nhu la ta mong muon khong
//https://viblo.asia/p/verify-json-request-nodejs-voi-joi-V3m5WLpgKO7
const Joi = require('joi');





const app = express();
const POST = 3000;

// su dung phan mem trung gian
app.use('/css', express.static(__dirname + '/html/css'));
// app.use('/w3_band', express.static(__dirname + '/w3_band'));
// app.use('/assets', express.static(__dirname + '/w3_band/assets'));

// su dung phan mem trung gian theo kieu mo trong va phan tich tai khoan mat khau duoi dang chuoi nen la false
app.use(bodyParser.urlencoded({ extended: true }));
// su dung phan mem trung gian de doc file json
app.use(bodyParser.json());

app.get('/login', (request, respond) => {
    respond.sendFile(path.join(__dirname, './html', 'index.html'));
});

// app.get('/logout', (request, respond) => {
//     respond.sendFile(path.join(__dirname, './w3_band', 'index.html'));
// });

// app.get('/logout', (request, respond) => {
//     respond.send("oke chien");
// });

// cho phep nguoi dung dua thong tin len server
app.post('/logout', (req, res) => {
    //https://www.w3schools.com/js/js_json_parse.asp
    // const obj = JSON.parse(JSON.stringify(request.body)); // req.body = [Object: null prototype] { title: 'product' }
    // console.log(typeof (request.body));

    console.log(req.body);

    // xac thuc lai coi mail pass co dung cau truc khong
    var schema = Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(5).max(20).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        res.send(error.details[0].message);
        console.log(error.details[0].message);
        return;
    }

    // dua thong tin ve mail qua trang web mailchimp.com
    var mail = req.body.email;
    var pass = req.body.password;
    // chuyen data ve dang json
    var data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: pass
                }
            }
        ]
    }
    var jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/871dc6f37b";

    const options = {
        method: "POST",
        auth: "angele1:8bb34019ba210bf17463c1885c887885-us14"
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.send("sucessfully");
        }
        else {
            res.send("error")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});

app.listen(POST, () => {
    console.log("listen sucessful")
});


// API key 8bb34019ba210bf17463c1885c887885-us14

// listID 871dc6f37b