const User = require("../models/user.model");
const Department = require("../models/department.model");
const Faculty = require("../models/faculty.model");
const AppError = require("../utils/AppError.utils");
const mongoose = require("mongoose");
const { uniqueCheck } = require("../utils/valueChecker");

const addDepartment = async (userId, data) => {

}

module.exports = {
    addDepartment
}