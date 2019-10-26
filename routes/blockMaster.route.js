var express = require('express');
var router = express.Router();

const blockMasterController = require('../controller/BlockMaster.controller');

router.post('/create', blockMasterController.create);
router.get('/list', blockMasterController.list);
router.get('/exportCSV', blockMasterController.exportCSV);


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
