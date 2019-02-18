var express = require('express');
var router = express.Router();

// export
module.exports = router;

// Home / index
router.get('/', function(req, res){
    res.send('admin area');
  });
  