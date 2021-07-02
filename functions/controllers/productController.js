const { db, admin } = require("../connection/database");
const { regex } = require("uuidv4");
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
/* const credential = require("../connection/credential");
var serviceAccount = require("../../pro-insight-76261-firebase-adminsdk-3p09h-e4e75907ff.json"); */
/* const { firebase } = require('firebase');
firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://pro-insight-76261.appspot.com/products",
}); */

/* Constantes a utilizar */
const Products = db.collection("products");

exports.getProducts = (req, res) => {
  Products.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      if (data._size > 0) {
        let product = [];
        data.forEach((doc) => {
          product.push({
            productId: doc.id,
            name: doc.data().name,
            display: doc.data().display,
            sku: doc.data().sku,
            bulk: doc.data().bulk,
            boxUnity: doc.data().boxUnity,
            imageUrl: doc.data().imageUrl,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            deletedAt: doc.data().deletedAt,
          });
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          data: product,
        });
      } else {
        return res.status(200).json({
          code: 400,
          status: "success",
          message: "No hay productos para mostrar",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: `Error al obtener los productos ${err}` });
    });
};

exports.getProductById = (req, res) => {
  let productId = req.params.id;

  Products.doc(productId)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "No se encontro el productos",
        });
      }
      let doc = data._fieldsProto;
      let product = [];
      product.push({
        productId: productId,
        name: doc.name.stringValue,
        display: doc.display.stringValue,
        sku: doc.sku.stringValue,
        bulk: doc.bulk.stringValue,
        boxUnity: doc.boxUnity.stringValue,
        imageUrl: doc.imageUrl.stringValue,
        createdAt: doc.createdAt.stringValue,
        updatedAt: doc.updatedAt.stringValue,
        deletedAt: doc.deletedAt.stringValue,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        data: product,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Error al encontrar el producto",
        error: err,
      });
    });
};

exports.creatProduct = (req, res) => {
  if (req.body.name === "" || req.body.name == undefined) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los campos son requeridos",
    });
  } else {
    const newProduct = {
      name: req.body.name,
      display: req.body.display,
      sku: req.body.sku,
      bulk: req.body.bulk,
      boxUnity: req.body.boxUnity,
      imageUrl: req.body.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: "",
    };

    Products.add(newProduct)
      .then((doc) => {
        let product = [];
        product.push({
          productId: doc.id,
          newProduct,
        });
        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Producto creado correctamente",
          data: product,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          status: "error",
          message: `No fue creado el producto`,
        });
      });
  }
};

exports.updatedProduct = (req, res) => {
  let productId = req.params.id;
  if (req.body.name == "" || req.body.name == undefined) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Los campos son requeridos",
    });
  }
  const editProduct = {
    name: req.body.name,
    display: req.body.display,
    sku: req.body.sku,
    bulk: req.body.bulk,
    boxUnity: req.body.boxUnity,
    imageUrl: req.body.imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: "",
  };

  Products.doc(productId)
    .update(editProduct)
    .then((data) => {
      let product = [];
      product.push({
        productId: productId,
        data: editProduct,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: product,
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

exports.deleteProduct = (req, res) => {
  let productId = req.params.id;

  Products.doc(productId)
    .delete()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "producto eliminado correctamente",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "No se elimino el producto",
      });
    });
};

/* exports.productUploadImage = (req, res) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  //Se genera un token de la imagen
  let generatedToken = regex.v4;
  let file = req.file;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (
      mimetype !== "image/jpeg" &&
      mimetype !== "image/png" &&
      mimetype !== "image/git" &&
      mimetype !== "image/jpg"
    ) {
      return res
        .status(400)
        .json({ message: "El tipo de la imagen no es valido" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    const storageRef = storage().ref(`/products/${imageFileName}`);
    const taskPut = storageRef
      .put(file)
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${credential.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
        return Products.doc(req.body.productId).update({ imageUrl });
      })
      .then(() => {
        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Imagen subida correctamente",
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          status: "error",
          message: "Error al subir la imagen",
        });
      });
  });
  busboy.end(req.rawBody);
}; */
