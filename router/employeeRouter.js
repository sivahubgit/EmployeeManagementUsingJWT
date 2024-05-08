const express = require("express");
const { createEmployee, login, getDetails, editDetails, deleteEmployee } = require("../controller/employeeController");
const { authenticationCheck } = require("../middleware/middleware");

const employeeRouter = express.Router();

employeeRouter.post("/create", createEmployee);
employeeRouter.get("/login", login);
employeeRouter.get("/detail", authenticationCheck, getDetails);
employeeRouter.put("/edit", authenticationCheck, editDetails);
employeeRouter.put("/delete", authenticationCheck, deleteEmployee)

module.exports = {employeeRouter}