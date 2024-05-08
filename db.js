const {MongoClient} = require('mongodb');

let data;

async function databaseConnection(){
    if(data) return data

    try {        
        const MONGODB_URI ="mongodb://127.0.0.1:27017"
                   
        const client =await new MongoClient(MONGODB_URI);       
        data = client.db("employee_management");
        if(data)
        {
            return data;
        }
        else{
            throw "error"
        }
        
    } catch (err) {
        console.log('Internal server error');
    }

}

module.exports = {databaseConnection}