const { db, admin } = require("../functions/connection/database");

module.exports = (request, response, next) => {
  let idToken;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("El token no es valido");
    return response.status(400).json({
      code: 400,
      status: "error",
      message: "Sin identificador",
    });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      request.user = decodedToken;
      //return response.status(200).json({ user: request.user.email })
      return db
        .collection("users")
        .where("email", "==", request.user.email)
        .limit(1)
        .get();
    })
    .then((data) => {
      //return response.status(200).json({ data: data });
      request.user.email = data.docs[0].data().email;
      return next();
    })
    .catch((err) => {
      console.error("Error al verificar el token ", err);
      return response.status(403).json(err);
    });
};
