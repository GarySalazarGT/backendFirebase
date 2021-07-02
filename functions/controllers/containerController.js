const { db } = require("../connection/database");

/* Constantes a utilizar */
const Containers = db.collection("containers");

exports.getContainers = (req, res) => {
  Containers.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro ningun contenedor",
        });
      }

      let container = [];
      data.forEach((doc) => {
        container.push({
          containerId: doc.id,
          name: doc.data().name,
          airoport: doc.data().airoport,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
          deletedAt: doc.data().deletedAt,
        });
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: container,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al mostrar los contenedores",
      });
    });
};

exports.getContainersById = (req, res) => {
  let containerId = req.params.id;
  Containers.doc(containerId)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro la relacion",
        });
      }
      let doc = data._fieldsProto;
      let container = [];
      container.push({
        containerId: containerId,
        name: doc.name.stringValue,
        airoport: doc.airoport.mapValue.fields,
        createdAt: doc.createdAt.stringValue,
        updatedAt: doc.updatedAt.stringValue,
        deletedAt: doc.deletedAt.stringValue,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: container,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al encontrar el contenedor",
        error: err,
      });
    });
};

exports.createContainers = (req, res) => {
  //return res.status(200).json({ data: req.body });
  if (
    req.body.name == "" ||
    req.body.airoport == ""
  ) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los datos son requeridos",
    });
  }

  const newContainer = {
    name: req.body.name,
    airoport: req.body.airoport,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: '',
  };

  Containers.add(newContainer)
    .then((doc) => {
      let container = [];
      container.push({
        containerId: doc.id,
        newContainer,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Contenedor creado correctamente",
        data: container,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: `Error al crear el contenedor`,
      });
    });
};

exports.updateContainers = (req, res) => {
  let containerId = req.params.id;
  if (
    req.body.name == "" ||
    req.body.airoport == "" 
  ) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los datos no estan completos",
    });
  }
  const editContainer = {
    name: req.body.name,
    airoport: req.body.airoport,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };
  Containers.doc(containerId)
    .update(editContainer)
    .then((data) => {
      let container = [];
      container.push({
        containerId: containerId,
        data: editContainer,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: container,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se actualizo el contenedor",
      });
    });
};

exports.deleteContainers = (req, res) => {
  let containerId = req.params.id;
  Containers.doc(containerId)
    .delete()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Se elimino el contenedor correctamente",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se elimino el contenedor",
      });
    });
};

