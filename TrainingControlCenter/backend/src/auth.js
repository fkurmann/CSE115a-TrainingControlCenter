const jwt = require('jsonwebtoken');

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ
lbWFpbCI6ImFubmFAYm9va3MuY29tIiwicm9sZSI6ImFkbWluIiwiaW
F0IjoxNjA2Mjc3MDAxLCJleHAiOjE2MDYyNzcwNjF9.1nwY0lDMGrb7
AUFFgSaYd4Q7Tzr-BjABclmoKZOqmr4`;

exports.login = async (req, res) => {
  const {email, password} = req.body;
  const returnValue = await db.checkCred(email, password);
  if (returnValue == undefined) {
    res.status(401).send('Invalid credentials');
  } else {
    const accessToken = jwt.sign(
      {email: email},
      token, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    res.status(200).json({
      fullname: returnValue, email: email, accessToken: accessToken,
    });
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userToken = authHeader.split(' ')[1];
  jwt.verify(userToken, token, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
