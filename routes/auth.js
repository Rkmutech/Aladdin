const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/auth');


router.post('/register', authcontroller.register)
router.post('/signin', authcontroller.signin)
router.post('/add', authcontroller.add)
router.post('/editproduct', authcontroller.editproduct)
router.post('/editinventory', authcontroller.editinventory)
router.post('/addtoinventory', authcontroller.addtoinventory)

module.exports = router;