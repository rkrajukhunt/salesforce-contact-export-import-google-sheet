var express = require('express');
require('dotenv').config()

var app = express();

require("./app/routes/contact.routes")(app);

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});

