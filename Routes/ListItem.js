var express = require('express');
var router = express.Router();
let axios = require('axios');


router.post('/listItem', (req, res) => {
  const { id, type } = req.body;
  if (type === 'cinema') {
      axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`).then(data => {
          res.send(data.data)
      })
  }
});

module.exports = router;