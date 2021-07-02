const { db } = require("../connection/database");
const credential = require('../connection/credential');
var firebase = require('firebase');
firebase.initializeApp(credential);

/* Constantes a utilizar */
const Airoport = db.collection("airports");

exports.getAiroports = (req, res) => {
  Airoport.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (data._size > 0) {
        let airoport = [];
        data.forEach((doc) => {
            console.log(doc);
            
          airoport.push({
            airoportId: doc.id,
            name: doc.data().name,
            country: doc.data().country,
            arrivalPlace: doc.data().arrivalPlace,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            deletedAt: "",
          });
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          data: airoport,
        });
      } else {
        return res.status(200).json({
          code: 400,
          status: "success",
          message: "No hay aeropuertos para mostrar",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: `Error al obtener los aeropuertos ${err}` });
    });
};

exports.getAiroportById = (req, res) => {
  let airoportId = req.params.id;

  Airoport.doc(airoportId)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro el aeropuerto",
        });
      }
      let doc = data._fieldsProto;
      let airoport = [];
      airoport.push({
        airoportId: airoportId,
        name: doc.name.stringValue,
        country: doc.country.stringValue,
        arrivalPlace: doc.arrivalPlace.stringValue,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
        deletedAt: "",
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: airoport,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al encontrar el aeropuerto",
        error: err,
      });
    });
};

exports.creatAiroport = (req, res) => {
  if (req.body.name === "" || req.body.name == undefined) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los campos son requeridos",
    });
  } else {
    const newAiroport = {
      name: req.body.name,
      country: req.body.country,
      arrivalPlace: req.body.arrivalPlace,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: "",
    };

    Airoport.add(newAiroport)
      .then((doc) => {
        let airoport = [];
        airoport.push({
          airoportId: doc.id,
          newAiroport,
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Aeropuerto creado correctamente",
          data: airoport,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          status: "error",
          message: `No fue creado el aeropuerto`,
        });
      });
  }
};

exports.updatedAiroport = (req, res) => {
  let airoportId = req.params.id;
  if (req.body.name == "" || req.body.name == undefined) {
      return res.status(400).json({
          code: 400,
          status: 'error',
          message: "Los campos son requeridos"
      })
  }
  const editAiroport = {
    name: req.body.name,
    country: req.body.country,
    arrivalPlace: req.body.arrivalPlace,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };

  Airoport.doc(airoportId)
    .update(editAiroport)
    .then((data) => {
      let airoport = [];
      airoport.push({
        airoportId: airoportId,
        data: editAiroport,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: airoport,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se actualizo los datos del aeropuerto",
      });
    });
};

exports.deleteAiroport = (req, res) => {
  let airoportId = req.params.id;

  Airoport.doc(airoportId)
    .delete()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Aeropuerto eliminado correctamente",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se elimino al aeropuerto",
      });
    });
};
