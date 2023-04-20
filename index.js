const fs = require("fs");

class ProductManager {
  constructor() {
    this.idCounter = 0;
    this.path = "./products.json";
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const productList = await this.getProducts();
      const stockProduct = productList.find((product) => product.code === code);

      if (stockProduct) {
        console.log(`Error:${code}, already`);
      } else {
        const recentProduct = productList[productList.length - 1];
        const newIdName = recentProduct ? recentProduct.id + 1 : 1;
        const product = {
          id: newIdName,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };

        productList.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(productList));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf8");
        const productsJS = JSON.parse(products);
        return productsJS;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(idProduct) {
    try {
      const productsFile = await this.getProducts();
      const productIndex = productsFile.findIndex(
        (product) => product.id === idProduct
      );

      if (productIndex === -1) {
        console.log("Error: product not found");
      } else {
        productsFile.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        console.log(`Success: The product ${idProduct} has been delete`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(idProduct, updatedFields) {
    try {
      const productsFile = await this.getProducts();
      const productIndex = productsFile.findIndex(
        (product) => product.id === idProduct
      );

      if (productIndex === -1) {
        console.log("Error: The product ID not encounter");
      } else {
        const updatedProduct = {
          ...productsFile[productIndex],
          ...updatedFields,
          id: idProduct,
        };
        productsFile[productIndex] = updatedProduct;
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        console.log(`Product successfully updated`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async #existingProduct(idProduct) {
    try {
      const productsFile = await this.getProducts();
      return productsFile.find((products) => products.id === idProduct);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(idProduct) {
    try {
      const product = this.#existingProduct(idProduct);
      if (!product) {
        console.log("Not found");
      } else {
        return product;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// instancia
const productManager = new ProductManager();

// obtencion de datos
const tryTest = async () => {
  const getItem = await productManager.getProducts();
  console.log("Carga de base de datos: ", getItem);

  // carga de datos info
  await productManager.addProduct(
    "Zapatillas Air Jordan",
    "Usa las legendrias Air Jordan, inspirada en el mejor jugador de la historia Michel J.",
    125,
    "https://t.ly/8l1E",
    "A1rJ0rd4N",
    23
  );

  // Consulta  de producto por ID correcto
  const consult1 = await productManager.getProductById(1);
  console.log("Consulta por ID: ", consult1);
  // Consutla ID Incorrecto
  const consult1b = await productManager.getProductById(2);
  console.log("Consulta por ID: ", consult1b);
  // Consulta del Array de productos
  const consult2 = await productManager.getProducts();
  console.log("1er prueba: ", consult2);
  // Actualizar producto por ID (Precio y Stock)
  await productManager.updateProduct(1, {
    price: 200,
    stock: 29,
  });
  // Ver update producto
  const consult2b = await productManager.getProducts();
  console.log("Actualizacion de datos: ", consult2b);

  //Eliminar producto por ID
  await productManager.deleteProduct(1);
  const consult3 = await productManager.getProducts();
  console.log("2da prueba: ", consult3);
};

tryTest();
