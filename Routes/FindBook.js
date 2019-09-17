var express = require('express');
var router = express.Router();
let axios = require('axios');


router.post('/books', (req, res) => {
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.title}`).then(response => {
      let array2 = []
      console.log(response.data)



      for (var i = 0; i < response.data.items.length; i++) {
          if (response.data.items[i].volumeInfo.imageLinks) {

              let emptyO = { name: '', image: '', id: i }
              emptyO.name = response.data.items[i].volumeInfo.title;
              emptyO.image = response.data.items[i].volumeInfo.imageLinks.thumbnail;
              emptyO.Search = response.data.items[i].id;

              array2.push(emptyO)

          }
      } res.send(array2)


  })
});

module.exports = router;