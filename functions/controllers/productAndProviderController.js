const { db } = require("../connection/database");

/* Constantes a utilizar */
const ProductsAndProvider = db.collection("pivote_products_providers");

exports.getPrivoteProductsAndProviders = (req, res) => {
  ProductsAndProvider.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro ningun registro de proveedor y productos",
        });
      }

      let pivoteProductoAndProvider = [];
      data.forEach((doc) => {
        pivoteProductoAndProvider.push({
          pivoteId: doc.id,
          provider: doc.data().provider,
          product: doc.data().product,
          price: doc.data().price,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
          deletedAt: doc.data().deletedAt,
        });
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: pivoteProductoAndProvider,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al mostrar los datos",
      });
    });
};

exports.getPivoteById = (req, res) => {
  let pivoteId = req.params.id;
  ProductsAndProvider.doc(pivoteId)
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
      let pivoteProductoAndProvider = [];
      pivoteProductoAndProvider.push({
        pivoteId: pivoteId,
        provider: doc.provider.mapValue.fields,
        product: doc.product.mapValue.fields,
        price: doc.price.stringValue,
        createdAt: doc.createdAt.stringValue,
        updatedAt: doc.updatedAt.stringValue,
        deletedAt: doc.deletedAt.stringValue,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: pivoteProductoAndProvider,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al encontrar la relacion de producto y proveedor",
        error: err,
      });
    });
};

exports.createPivote = (req, res) => {
  //return res.status(200).json({ data: req.body });
  if (
    req.body.provider == "" ||
    req.body.product == "" ||
    req.body.price == ""
  ) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los datos son requeridos",
    });
  }

  const newPivote = {
    provider: req.body.provider,
    product: req.body.product,
    price: req.body.price,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };

  ProductsAndProvider.add(newPivote)
    .then((doc) => {
      let pivote = [];
      pivote.push({
        pivoteId: doc.id,
        newPivote,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Producto asociado correctamente",
        data: pivote,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: `No fue asociado el producto correctamente`,
      });
    });
};

exports.updatePricePivote = (req, res) => {
  let pivoteId = req.params.id;
  if (
    req.body.price == "" ||
    req.body.product == "" ||
    req.body.provider == ""
  ) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los datos no estan completos",
    });
  }
  const provider = req.body.provider;
  const product = req.body.product;
  const editPivote = {
    provider: provider,
    product: product,
    price: req.body.price,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };
  ProductsAndProvider.doc(pivoteId)
    .update(editPivote)
    .then((data) => {
      let pivote = [];
      pivote.push({
        pivoteId: pivoteId,
        data: editPivote,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: pivote,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se actualizo los datos del producto",
      });
    });
};

exports.deletePivote = (req, res) => {
    let pivoteId = req.params.id;
    ProductsAndProvider.doc(pivoteId)
    .delete()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Se elimino el proveedor correctamente",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se elimino el proveedor",
      });
    });
}
