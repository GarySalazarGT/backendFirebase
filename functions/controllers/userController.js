const { db, admin } = require("../connection/database");
const firebase = require("firebase");

const User = db.collection("users");
var auth = firebase.auth();

exports.userSingup = (req, res) => {
  if (req.body.email == "" || req.body.password == "") {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los campos son requeridos",
    });
  }

  const newUser = {
    name: req.body.name,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };

  const pass = {
    password: req.body.password,
  };

  auth
    .createUserWithEmailAndPassword(newUser.email, pass.password)
    .then((userCredential) => {
      User.add(newUser).then((doc) => {
        return res.status(200).json({
          code: 200,
          status: "success",
          data: newUser,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "El ususario ya tiene acceso",
      });
    });
};

exports.userLoggin = (req, res) => {
  if (req.body.email == "" || req.body.password == "") {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los campos son requeridos",
    });
  }

  const newCredential = {
    email: req.body.email,
    password: req.body.password,
  };

  auth
    .signInWithEmailAndPassword(newCredential.email, newCredential.password)
    .then((userCredential) => {
      User.where("email", "==", newCredential.email)
        .get()
        .then((data) => {
          if (!data.exists) {
            return res.status(200).json({
              code: 200,
              status: "success",
              message: "No se encontro el ususario",
              data: userCredential,
            });
          }

          let doc = data._fieldsProto;
          let user = [];

          user.push({
            userId: data.id,
            name: doc.name.stringValue,
            lastname: doc.lastname.stringValue,
            email: doc.email.stringValue,
            phone: doc.phone.stringValue,
            createdAt: doc.createdAt.stringValue,
            updatedAt: doc.updatedAt.stringValue,
            deletedAt: doc.deletedAt.stringValue,
          });
          return res.status(200).json({
            code: 200,
            status: "success",
            data: user,
            credential: userCredential
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({
            code: 500,
            status: "error",
            message: "No se encontro el ususario",
          });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "success",
        message: "No pudo ingresar, intente de nuevo",
      });
    });
};

exports.userLogout = (req, res) => {
  auth
    .signOut()
    .then(() => {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Cierre de sesion correctamente",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al cerrar sesion",
      });
    });
};

exports.getUsers = (req, res) => {
  User.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (data._size > 0) {
        let users = [];
        data.forEach((doc) => {
          users.push({
            userId: doc.id,
            name: doc.data().name,
            lastname: doc.data().lastname,
            email: doc.data().email,
            phone: doc.data().phone,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            deleteAt: doc.data().deletedAt,
          });
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          data: users,
        });
      } else {
        return res.status(200).json({
          code: 400,
          status: "success",
          message: "No hay ususarios para mostrar",
        });
      }
    });
};
