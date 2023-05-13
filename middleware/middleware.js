const jwt = require("jsonwebtoken");
 //importer jsonwebtoken//
require('dotenv').config();

//next()nous permet si utilisateur est authentifée pour executer//
// Middleware pour vérifier si l'utilisateur est authentifié
let verifyToken = (req, res, next) => {
   //recupration de header et diviser autour de espace //
  let token = req.headers?.authorization && req.headers?.authorization?.split(' ')[1]; //req.headers["authorization"].split(" ")[1];
 
  if (!token) {
    return res.status(403).send({ message: "Veillez ajouter un token..!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
 // console.log(token);   
    if (err) {
      return res.status(401).send({ message: "Accès non authorisé!" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;