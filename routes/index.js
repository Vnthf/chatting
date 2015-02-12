var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main.html', { title: '익명채팅방' });
});

module.exports = router;



