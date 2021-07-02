const { db } = require("../connection/database");

/* Constantes a utilizar */
const Provider = db.collection("provider");

exports.getProviders = (req, res) => {
  Provider.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (data._size > 0) {
        let providers = [];
        data.forEach((doc) => {
          providers.push({
            providerId: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            deleteAt: doc.data().deletedAt,
          });
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          data: providers,
        });
      } else {
        return res.status(200).json({
          code: 400,
          status: "success",
          message: "No hay proveedores para mostrar",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: `Error al obtener los proveedores ${err}` });
    });
};

exports.getProviderById = (req, res) => {
  let providerId = req.params.id;

  Provider.doc(providerId)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro el proveedor",
        });
      }
      let doc = data._fieldsProto;
      let provider = [];
      provider.push({
        providerId: providerId,
        name: doc.name.stringValue,
        description: doc.description.stringValue,
        createdAt: doc.createdAt.stringValue,
        updatedAt: doc.updatedAt.stringValue,
        deletedAt: doc.deletedAt.stringValue,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: provider,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al encontrar el proveedor",
        error: err,
      });
    });
};

exports.creatProvider = (req, res) => {
  if (req.body.name === "" || req.body.name == undefined) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los campos son requeridos",
    });
  } else {
    const newProvider = {
      name: req.body.name,
      description: req.body.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: "",
    };

    Provider.add(newProvider)
      .then((doc) => {
        let provider = [];
        provider.push({
          providerId: doc.id,
          newProvider,
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Proveedor creado correctamente",
          data: provider,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          status: "error",
          message: `No fue creado el proveedor`,
        });
      });
  }
};

exports.updatedProvider = (req, res) => {
  let providerId = req.params.id;
  const editProvider = {
    name: req.body.name,
    description: req.body.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };

  Provider.doc(providerId)
    .update(editProvider)
    .then((data) => {
      let provider = [];
      provider.push({
        providerId: providerId,
        data: editProvider,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: provider,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se actualizo los datos del proveedor",
      });
    });
};

exports.deleteProvider = (req, res) => {
  let providerId = req.params.id;
  const editProvider = [];

  Provider.doc(providerId).delete().then( data => {
      return res.status(200).json({
          code: 200,
          status: 'success',
          message: 'Proveedor eliminado correctamente'
      });
  })
  .catch(err => {
      console.error(err);
      return res.status(500).json({
          code: 500,
          status: 'error',
          message: 'No se elimino al proveedor'
      })
  })
};
