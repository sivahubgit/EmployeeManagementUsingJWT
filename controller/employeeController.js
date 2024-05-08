const { employeeModel } = require("../model/employeeModel");
const {uid} = require('uid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

let collection;

async function collectionInstance(){
    collection = await employeeModel();
}

async function createEmployee(req, res){
    if(!collection){
        console.log("employee collection instance failed");
        return res.status(500).send("Internal server error")
    }
    try{
        const {name, userName, age, position, password, yearsOfExperience, mobileNumber} = req.body;
        if(!name || !userName || !age || !position || !password || !yearsOfExperience || !mobileNumber){
            return res.status(400).send({
                result: "Invalid arguments",
                message: "Should give name, userName, password, age, position, yearsOfExperience and mobileNmber"
            })
        }
        if(password.length < 5 ){
            return res.status(400).send({
                result: "Invalid arguments",
                message: "Password should be above 5 characters"
            })
        }
        const employeeData = await collection.findOne({userName});
        if(employeeData){
            return res.status(400).send({
                result: "Invalid arguments",
                message: "Username already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 7);
        await collection.insertOne({_id: uid(), name, userName, password: hashedPassword, age, position, yearsOfExperience, mobileNumber})
        res.status(201).send("Employee created successfully")
    }
    catch(err){
        console.log("createEmployee error:", err);
        res.status(500).send("Internal server error");
    }
}

async function login(req, res){
    if(!collection){
        console.log("employee collection instance failed");
        return res.status(500).send("Internal server error")
    }
    try{
        const {userName, password} = req.query;
        if(!userName || !password)
        {
            return res.status(400).send("Invalid username or password")
        }
        const employee = await collection.findOne({userName});
        if(!employee){
            return res.status(404).send("User not found")
        }
        if(await bcrypt.compare(password, employee.password)){
            const accessToken = jwt.sign( { id:employee._id }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "1m"});
            return res.status(200).send({
                accessToken,
                id: employee._id
            })
        }
        else{
            return res.status(401).send("Incorrect password")
        }
    }
    catch(err){
        console.log("login error:", err);
        res.status(500).send("Internal server error");
    }
}

async function getDetails(req, res){
    if(!collection){
        console.log("employee collection instance failed");
        return res.status(500).send("Internal server error")
    }
    try{
        const employee = await collection.findOne({_id: req.employee.id})
        if(!employee){
            return res.status(404).send("User not found")
        }
        return res.status(200).send(employee)
    }
    catch(err){
        console.log("getDetails error:", err);
        res.status(500).send("Internal server error");
    }
}

async function editDetails(req, res){
    if(!collection){
        console.log("employee collection instance failed");
        return res.status(500).send("Internal server error")
    }
    try{
        const {name, userName, age, position, yearsOfExperience, mobileNumber} = req.body;
        if(!name || !userName || !age || !position || !yearsOfExperience || !mobileNumber){
            return res.status(400).send({
                result: "Invalid arguments",
                message: "Should give name, userName, password, age, position, yearsOfExperience and mobileNmber"
            })
        }
        const employee = await collection.findOne({_id: req.employee.id });
        if(!employee){
            return res.status(404).send({
                result: "Employee not found"
            })
        }
        const employeeData = await collection.findOne({_id: { $ne: req.employee.id }, userName});
        if(employeeData){
            return res.status(400).send({
                result: "Invalid arguments",
                message: "Username already exists"
            })
        }
        await collection.findOneAndUpdate({_id: req.employee.id},{
            $set:{
                name,
                userName,
                age,
                position,
                yearsOfExperience,
                mobileNumber
            }
        })
        return res.status(200).send("Employee updated successfully")
    }
    catch(err){
        console.log("editDetails error:", err);
        res.status(500).send("Internal server error");
    }
}

async function deleteEmployee(req, res){
    if(!collection){
        console.log("employee collection instance failed");
        return res.status(500).send("Internal server error")
    }
    try{
        await collection.deleteOne({_id:req.employee.id});
        return res.status(200).send("Employee deleted successfully")
    }
    catch(err){
        console.log("deleteDetails error:", err);
        res.status(500).send("Internal server error");
    }
}

module.exports = { collectionInstance, createEmployee, login, getDetails, editDetails, deleteEmployee }