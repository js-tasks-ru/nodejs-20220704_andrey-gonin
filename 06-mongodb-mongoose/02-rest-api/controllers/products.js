const Product = require('./../models/Product');
const {mapProduct} = require('./../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  const {subcategory} = ctx.request.query;
  ctx.findPriductList = {};

  if (subcategory) {
    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
      ctx.throw(400, 'invalid id');
    }

    ctx.findPriductList.subcategory = subcategory;
  }

  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find(ctx.findPriductList);

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'invalid id');
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.throw(404, 'not found item');
  }

  ctx.body = {product: mapProduct(product)};
};

