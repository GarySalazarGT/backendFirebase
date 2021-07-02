const { db } = require("../connection/database");

/* Constantes a utilizar */
const SendProduct = db.collection("send_products");

exports.getSends = (req, res) => {
  SendProduct.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro ningun envio",
        });
      }

      let send = [];
      data.forEach((doc) => {
        send.push({
          snedId: doc.id,
          container: doc.data().container,
          productProvider: doc.data().productProvider,
          guessDate: doc.data().guessDate,
          realDate: doc.data().realDate,
          amount: doc.data().amount,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
          deletedAt: doc.data().deletedAt,
        });
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: send,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al mostrar los envios",
      });
    });
};

exports.getSendById = (req, res) => {
  let sendId = req.params.id;
  SendProduct.doc(sendId)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro el envio",
        });
      }
      let doc = data._fieldsProto;
      let send = [];
      send.push({
        sendId: sendId,
        container: doc.container.mapValue.fields,
        productProvider: doc.productProvider.mapValue.fields,
        guessDate: doc.guessDate.stringValue,
        realDate: doc.realDate.stringValue,
        amount: doc.amount.stringValue,
        createdAt: doc.createdAt.stringValue,
        updatedAt: doc.updatedAt.stringValue,
        deletedAt: doc.deletedAt.stringValue,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: send,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al encontrar el envio",
        error: err,
      });
    });
};

exports.createSend = (req, res) => {
  //return res.status(200).json({ data: req.body });
  if (
    req.body.container == "" ||
    req.body.productProvider == "" ||
    req.body.guessDate == "" ||
    req.body.amount == ""
  ) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los datos son requeridos",
    });
  }

  const newSend = {
    container: req.body.container,
    productProvider: req.body.productProvider,
    guessDate: req.body.guessDate,
    realDate: req.body.realDate,
    amount: req.body.amount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };

  SendProduct.add(newSend)
    .then((doc) => {
      let send = [];
      send.push({
        sendId: doc.id,
        newSend,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Envio creado correctamente",
        data: send,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: `Error al crear el envio`,
      });
    });
};

exports.updateSend = (req, res) => {
  let sendId = req.params.id;
  if (
    req.body.container == "" ||
    req.body.productProvider == "" ||
    req.body.guessDate == "" ||
    req.body.amount == ""
  ) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los datos no estan completos",
    });
  }
  const editSend = {
    container: req.body.container,
    productProvider: req.body.productProvider,
    guessDate: req.body.guessDate,
    realDate: req.body.realDate,
    amount: req.body.amount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };
  SendProduct.doc(sendId)
    .update(editSend)
    .then((data) => {
      let send = [];
      send.push({
        sendId: sendId,
        data: editSend,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: send,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se actualizo el envio",
      });
    });
};

exports.deleteSend = (req, res) => {
  let sendId = req.params.id;
  SendProduct.doc(sendId)
    .delete()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Se elimino el envio correctamente",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se elimino el envio",
      });
    });
};
