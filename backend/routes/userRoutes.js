const express = require("express");
const { getUserInfo } = require("../controllers/userController"); // Adjust the path as needed
const router = express.Router();

router.get("/user-info", getUserInfo);

module.exports = router;
