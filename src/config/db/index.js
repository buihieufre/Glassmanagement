
const {Sequelize, DataTypes}  = require('sequelize')
const mysql = require('mysql2')
const fs = require("fs");
const dotenv = require('dotenv')
const path = require('path');
const { rejects } = require('assert');
const caPath = path.resolve(__dirname, '../../../ca.pem');
dotenv.config()

const sequelize = new Sequelize('defaultdb', 'avnadmin', process.env.DB_PASSWORD,{
    host: 'glassesmanagement-buidinhhieu9b-80c1.e.aivencloud.com',
    port: 24627,
    dialect: 'mysql',
    // ssl: {
    //     ca: fs.readFileSync(caPath),
    // },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
            ca: fs.readFileSync(caPath)
        },
        connectTimeout: 60000,
        
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    connectTimeout: 60000,
})

// const connection = mysql.createConnection({
//     host: "glassesmanagement-buidinhhieu9b-80c1.e.aivencloud.com",
//     user: "avnadmin",
//     password: process.env.DB_PASSWORD,
//     database: "defaultdb",
//     ssl: {
//         ca: fs.readFileSync(caPath),
//     },
//     port: 24627,
// });

// connection.connect();


sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch((error) => {
    console.log('Unable to connect to the database:', error);
})
module.exports = sequelize