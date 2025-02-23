const {pool} = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  /*1	admin
2	serviceProvider
3	client */
  const { userName, email, password, role } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 7);
  const query = `INSERT INTO users (userName, email, password,role) VALUES ($1,$2,$3,$4) RETURNING*`;
  const data = [userName, email.toLowerCase(), encryptedPassword, role];

  pool
    .query(query, data)

    .then((result) => {
   
      res.status(200).json({
        success: true,
        message: "Account created successfully",
        user: result.rows[0],
        
        
      });
    })
    .catch((err) => {
      res.status(409).json({
        success: false,
        message: "The email already exists",
        err,
      });
    });
};

const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].user_id,
              role: result.rows[0].role,
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId:result.rows[0].user_id,
                role:result.rows[0].role
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};
module.exports = {
  register,
  login
};
