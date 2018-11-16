const express = require('express');
const bodyParser = require('body-parser');
const Config = require('config');
const { checkToken } = require('./middleware');
const { login, data, signin, countData, profil, update, remove, pyt } = require('./functions')

const configApi = Config.get("api");


function main () {
  let app = express();
  const port = configApi.port;

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next();
  });
  
  app.post('/login', login);
  app.post('/data/:page', checkToken, data);
  app.post('/count', checkToken, countData)
  app.post('/signin', signin)
  app.post('/profil',checkToken, profil)
  app.put('/update', checkToken, update)
  app.delete('/delete',checkToken, remove)
  app.get('/pyt', pyt)

  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();