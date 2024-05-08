const express = require("express");
const dotenv = require('dotenv');
const {databaseConnection} = require('./db');
const { collectionInstance } = require("./controller/employeeController");
const { employeeRouter } = require("./router/employeeRouter");

dotenv.config()

const app = express();

databaseConnection()
.then(async ()=>
{
    console.log("database connected")
    await collectionInstance()
}
)
.catch(()=>console.log("database not connected"))

app.use(express.json());
app.use("/api/employee", employeeRouter);

const {PORT} = process.env

app.listen(PORT, ()=>{
    console.log("server running")
})