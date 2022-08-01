const mongoose = require("mongoose");
require('dotenv').config({
    path: './src/.env'
})

async function connect() {
    try {
        await mongoose.connect(process.env.MONGOATLAS, {
            useNewUrlParser: true
        });
        console.log("ServerDB has started successfully")
    } catch (err) {
        console.log({ err });
    }
}

module.exports = {
    connect
}