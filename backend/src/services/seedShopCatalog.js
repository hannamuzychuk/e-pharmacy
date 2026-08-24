const Product = require("../models/Product");

function dedupeCatalogProducts(products) {
  const seen = new Set();

  return products.filter((product) => {
    if (!product.id) {
      return false;
    }

    const key = String(product.id);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function seedShopCatalog(shopId) {
  const [allProducts, shopProducts] = await Promise.all([
    Product.find().sort({ id: 1 }),
    Product.find({ shopId }).select("name suppliers"),
  ]);

  const catalog = dedupeCatalogProducts(allProducts);
  const existingKeys = new Set(
    shopProducts.map((product) => `${product.name}|${product.suppliers}`)
  );

  const docs = catalog
    .filter((product) => !existingKeys.has(`${product.name}|${product.suppliers}`))
    .map((product) => ({
      shopId,
      name: product.name,
      category: product.category,
      stock: product.stock,
      suppliers: product.suppliers,
      price: product.price,
      description: product.description || "",
      photo: product.photo,
    }));

  if (docs.length > 0) {
    await Product.insertMany(docs, { ordered: true });
  }

  return docs.length;
}

module.exports = { seedShopCatalog };
