const {databaseConnection} = require('../db');

async function employeeModel(){
    try{
        const db = await databaseConnection();
        const collection = db.collection("employee_details", {
            validator:{
            $jsonSchema:{
                bsonType: "object",
                title: "employee_details",
                properties:{
                    _id: {
                        bsonType: "string",
                    },
                    name:{
                        bsonType: "string"
                    },
                    userName:{
                        bsonType: "string"
                    },
                    password:{
                        bsonType: "string"
                    },
                    age: {
                        bsonType: "int"
                    },
                    position:{
                        bsonType: "string"
                    },
                    yearsOfExperience:{
                        bsonType: "double"
                    },
                    mobileNumber:{
                        bsonType: "string"
                    }
                },
                required: [
                    "_id","name", "userName", "password", "age", "position", "yearsOfExperience","mobileNumber"
                ]
            }
            }
        })
        return collection
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {employeeModel}