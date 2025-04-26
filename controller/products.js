import Products from '../models/products';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.query;
  try {
    const product = await Products.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const reduceProductStock = async (req, res) => {
  const { id, amount } = req.query;
  try {
    const product = await Products.findById(id);
    product.quantity = product.quantity - amount;

    await Products.findByIdAndUpdate(id, product, { new: true })
      .then((updatedProduct) => {
        res.status(200).json(updatedProduct);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addProductStock = async (req, res) => {
  const { id, amount } = req.query;
  try {
    const product = await Products.findById(id);
    product.quantity = product.quantity + amount;

    await Products.findByIdAndUpdate(id, product, { new: true })
      .then((doc) => {
        return res.status(200).json({ message: 'Stock updated', doc });
      })
      .catch((err) => {
        return res.status(404).json({ message: 'Something went wrong', err });
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product) {
    return res.status(400).json({ message: 'Product is required' });
  }

  await Products.create({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    quantity: product.quantity,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    categories: product.categories,
  })
    .then((doc) => {
      return res.status(200).json({ message: 'Product created', doc });
    })
    .catch((err) => {
      return res.status(404).json({ message: 'Something went wrong', err });
    });
};

export const updateProduct = async (req, res) => {
  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ message: 'Product is required' });
  }

  await Products.findByIdAndUpdate(
    product._id,
    {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      quantity: product.quantity,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      categories: product.categories,
    },
    { new: true }
  )
    .then((doc) => {
      return res.status(200).json({ message: 'Product updated', doc });
    })
    .catch((err) => {
      return res.status(404).json({ message: 'Something went wrong', err });
    });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Products.findByIdAndDelete(id)
    .then((doc) => {
      return res.status(200).json({ message: 'Product deleted', doc });
    })
    .catch((err) => {
      return res.status(404).json({ message: 'Something went wrong', err });
    });
};
