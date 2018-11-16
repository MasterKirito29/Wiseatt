let jwt = require('jsonwebtoken');
const Config = require('config');
var bcrypt = require('bcrypt');
const { connectMongo, insertOne, findOne, count, find, updateOne, deleteOne } = require('./mongoConnector');
const configSecret = Config.get("secret").secret;
const myPythonScriptPath = 'script.py';

const { PythonShell } = require('python-shell');

const pyt = (req, res) => {
  const pyshell = new PythonShell(myPythonScriptPath);
  pyshell.on('message', (message) => {
    res.json({
      success: true,
      message: "script python exec successfull",
      python: message
    })
  });
}

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

     if (username && password) {
       return connectMongo().then(client => {
        const db = client.db('wisebatt');
        return findOne(db.collection('users'), {
          username
        })
        .then(value => {
          return bcrypt.compare(password, value.password)
          .then(result => {
            if (result === false) {
              res.sendStatus(400)
            }
            else {
              const token = jwt.sign({username: username},
                configSecret,
                { 
                  expiresIn: '1h'
                }
              );
              res.json({
                success: true,
                message: 'Authentication successful!',
                token: token,
                username: username
              });
            }
          })
        })
       })
      }
  }

  const remove = (req, res) => {
    const username = req.body.username;
    return connectMongo().then(client => {
      const db = client.db('wisebatt');
      return deleteOne(db.collection('users'), {
        username
      })
      .then(() => {
        res.json({
          success: true,
          message: 'remove successfull',
          profil
        })
      })
     })
  }

const profil = (req, res) => {
  const username = req.body.username;
  return connectMongo().then(client => {
    const db = client.db('wisebatt');
    return findOne(db.collection('users'), {
      username
    })
    .then(profil => {
      res.json({
        success: true,
        message: 'get profil successfull',
        profil
      })
    })
   })
}

const signin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
      return connectMongo()
      .then(client => {
        const db = client.db('wisebatt');
        return insertOne(db.collection('users'), {
          username,
          password: hashedPassword
        })
        .then(() => {
          return res.sendStatus(200).json({
            success: true,
            message: 'Signin successfull'
          })
        })
        .catch((err) => {
          if (err)
            res.sendStatus(400)
        });
      })
    })
  }
}

const update = (req, res) => {
  const username = req.body.username;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email

  return connectMongo()
  .then(client => {
    const db = client.db('wisebatt');
    return updateOne(db.collection('users'), {
      username
    }, { $set: { first_name, last_name, email } })
    .then(() => {
      return res.sendStatus(200).json({
        success: true,
        message: 'Update successfull'
      })
    })
    .catch((err) => {
      if (err)
        res.sendStatus(400)
    });
  })
}

const data = (req, res) => {
  const payload = req.body;
  const next = 10 * req.params.page;
  const sort = {};
  const obj = {};
  if (payload.sort && payload.order)
      sort[payload.sort] = Number(payload.order);
  if (payload.params && payload.search) {
      const p = payload.params;
      const s = payload.search;
      if (p === 'id')
        obj[p] = Number(s);
      else
        obj[p] = s;
  }
  return connectMongo()
  .then(client => {
      const db = client.db("wisebatt");
      return find(db.collection('data'), obj, {}, 10, next, sort)
          .then(result => {
            return res.json({
              success : true,
              message: "Data !",
              data: result
            })
          });
  })
}

const countData = (req, res) => {
  return connectMongo().then(client => {
    const payload = req.body;
    const obj = {};
    if (payload.params && payload.search) {
      const p = payload.params;
      const s = payload.search;
      obj[p] = s;
    }
    const db = client.db("wisebatt");
    return count(db.collection('data'), obj, {})
        .then(count => {
            return res.json({
              success: true,
              message: 'Count !',
              count: count
            })
        });
})
}


module.exports = {
  login: login,
  data: data,
  signin: signin,
  countData: countData,
  profil: profil,
  update: update,
  remove: remove,
  pyt: pyt
}