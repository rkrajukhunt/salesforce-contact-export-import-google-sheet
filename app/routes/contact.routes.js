module.exports = function (app) {
  const contact = require("../controllers/contact.controller.js");

  app.get("/contacts-export", contact.exportFile);

  app.get("/", contact.hello);
};
