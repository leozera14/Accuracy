// import Query from '../config/oracledb';
import knexPg from '../database/postgres';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  async index (req, res) {
    const users = await knexPg('users').select('*');

    return res.json(users);
  }

  async create (req, res) {
    const {name, login, password, store} = req.body;

    const verify = await knexPg('users')
          .where('login', login)
          .select('*');

    if(verify == '') {
      const hash = await bcrypt.hash(password, 10);

      await knexPg('users').insert({
        name,
        login,
        password: hash,
        store
      })
      return res.status(200).json({name}); 
    } else {
      return res.status(400).json({error: 'E-mail já cadastrado.'});
    }
  } 

  async login(req, res) {
    const { login, password } = req.body;

    const userLogin = await knexPg('users')
        .where({
            'login': login,
        })
        .select('name', 'login', 'store', 'password')
        .first();

    if (!userLogin) {
        return res.status(400).json({ error: 'Dados incorretos, tente novamente!'});
    }

    bcrypt.compare(password, userLogin.password, (err, result) => {
      if(err) {
        return res.status(400).send(`${err}`);
      }

      if(result) {
        const token = jwt.sign({
          login: userLogin.login
        }, process.env.JWT_KEY, 
        {
          expiresIn: "24h"
        })
        return res.status(200).json({name: userLogin.name, login: userLogin.login, store: userLogin.store, token});
      }

      return res.status(400).send('Falha na autenticação');
    })
  }
}

export default new UserController();
