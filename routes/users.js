var express = require('express');
var router = express.Router();

const userController = require('./../controller/user.controller');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.get('/list', userController.list);

module.exports = router;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/register', (req, res) => {
//   res.status(200).send({ access_token:  'register' });
// });

// router.get('/login', (req, res) => {
//   res.status(200).send({ access_token:  'login' });
// });
