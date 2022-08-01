const mongoose = require("mongoose");
const passportLocalMongo = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");      // cung cap ham findorcreat vi trong mongoose ko co ham do

const transactionSchema = new mongoose.Schema({
    name: String,
    type: String,
    amount: Number,
    date: Date
});

const Transaction = new mongoose.model('Transaction', transactionSchema);

const statisticSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Transactions of " + new String(new Date().getMonth() + 1) + "-" + new String(new Date().getFullYear())
    },
    outcome: {
        type: Number,
        default: 0
    },
    outcomeTransaction: [transactionSchema],
    income: {
        type: Number,
        default: 0
    },
    incomeTransaction: [transactionSchema],
    balance: Number
});

const Statistic = new mongoose.model('Statistic', statisticSchema);

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Personal Workspace"
    },
    owner: String,
    currency: {
        type: String,
        default: "VND"
    },
    transactions: [transactionSchema],
    wallet: [{
        name: String,
        value: String,
    }]
});

const Workspace = new mongoose.model('Workspace', workspaceSchema);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    displayName: String,
    defaultWorkspace: workspaceSchema
});

userSchema.plugin(passportLocalMongo);   // them plugin nay vo de co the giup salt va hashing ket hop voi cookie
userSchema.plugin(findOrCreate);

module.exports = new mongoose.model("test", userSchema);