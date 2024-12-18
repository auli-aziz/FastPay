const express = require("express");
const router = express.Router();

const { getUserInfo, getAdminDashboard } = require("../controllers/userController"); // Adjust the path as needed
const { verifyJwt } = require("../middleware/jwtMiddleware");

router.get("/user-info", getUserInfo);
router.use(verifyJwt);
router.get("/admin-dashboard", getAdminDashboard);

module.exports = router;
