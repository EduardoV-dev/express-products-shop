const express = require('express');
const { AUTH } = require('../config/views');
const controller = require('../controllers/auth');

const router = express.Router();

router.get(AUTH.LOGIN.PATH, controller.getLoginPage);
router.post(AUTH.LOGIN.PATH, controller.postLogin);
router.post('/auth/logout', controller.postLogout);

module.exports = router;
