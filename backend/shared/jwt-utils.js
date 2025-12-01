const { verify } = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");

const secret = process.env.TOKEN_SECRET;
const expiresIn = "6h";

const decodeToken = (token) => {
  if (!token) return;
  token = token.split(" ")[1];
  if (!token) return;
  return verify(token, secret);
};

const encodeToken = (payload) => {
  return sign(payload, secret, { expiresIn });
};

module.exports = { decodeToken, encodeToken };
