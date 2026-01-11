const Product = require('../models/Product');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const buildPagination = require('../utils/pagination');

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, images, stock } = req.body;
  const product = await Product.create({
    seller: req.user._id,
    title,
    description,
    price,
    category,
    images: images || [],
    stock: stock ?? 0,
  });
  await product.populate('seller', 'username avatar');
  return sendSuccess(res, { product }, 'Product created');
});

const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, sort, category, q } = req.query;
  const { skip, limit: safeLimit, page: safePage } = buildPagination(page, limit);

  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  const sortOption = sort === 'price' ? { price: 1 } : { createdAt: -1 };

  const products = await Product.find(filter)
    .populate('seller', 'username avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(safeLimit);
  const total = await Product.countDocuments(filter);

  return sendSuccess(res, { items: products, page: safePage, total });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'username avatar');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  return sendSuccess(res, { product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (String(product.seller) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  const fields = ['title', 'description', 'price', 'category', 'images', 'stock', 'isActive'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();
  await product.populate('seller', 'username avatar');

  return sendSuccess(res, { product }, 'Product updated');
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (String(product.seller) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  await product.deleteOne();
  return sendSuccess(res, { ok: true }, 'Product deleted');
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const alreadyReviewed = product.reviews.some(
    (review) => String(review.user) === String(req.user._id)
  );
  if (alreadyReviewed) {
    return res.status(400).json({ success: false, message: 'Already reviewed' });
  }

  product.reviews.push({ user: req.user._id, rating, comment });
  product.ratingsCount = product.reviews.length;
  const avg = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.ratingsCount;
  product.ratingsAverage = Number(avg.toFixed(2));
  await product.save();

  return sendSuccess(res, { product }, 'Review added');
});

const reportProduct = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  await Report.create({
    reporter: req.user._id,
    targetType: 'product',
    targetId: product._id,
    reason,
  });

  return sendSuccess(res, { ok: true }, 'Report submitted');
});

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  reportProduct,
};
