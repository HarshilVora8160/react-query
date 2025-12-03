const { UserSignupController, userLogin, userFindAndUpdate, getAllUsersData, userFindAndDelete } = require("../controllers/UserController");
const express = require("express");
const userLoginMiddleware = require("../middleware/userMiddleware");

const router = express.Router();

router.get("/users", getAllUsersData);
router.post("/user-signup", UserSignupController);
// router.post("/user-login", userLoginMiddleware, userLogin);
router.post("/user-login", userLogin);
router.put("/user-update/:id", userFindAndUpdate);
router.delete("/user-delete/:id", userFindAndDelete);

module.exports = router;
