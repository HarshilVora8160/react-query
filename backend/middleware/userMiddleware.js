// without cookie-parser get token

// const userLoginMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized access!" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("token-----------------",token)

//   req.token = token;

//   next();
// };

// module.exports = userLoginMiddleware;

// with cookie-parser get token
const jwt = require("jsonwebtoken");

const userLoginMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token-----------------",token)

  if (!token) {
    return res.status(401).json({ errorMessage: "Unauthorized access!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    console.log("decoded------------------------",decoded)
    res.status(200).json(`Welcome to ${decoded.username}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = userLoginMiddleware;
