
const productService = require("../services/ProductService");
const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } =
      req.body;
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Please fill all fields",
      });
    }

    const createdProduct = await productService.createProduct(req.body);
    return res.status(200).json(createdProduct);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: "Create product failed",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const  id  = req.params.id;
    const { name, image, type, price, countInStock, rating, description } =
      req.body;
    const data = req.body;
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Please fill all fields",
      });
    }
    const updatedProduct = await productService.updateProduct(id, data);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: "Update product failed",
    });
  }
};

const deleteProduct = async (req, res) => {
    try {
        const  id  = req.params.id;
        const deletedProduct = await productService.deleteProduct(id);
        return res.status(200).json(deletedProduct);
    } catch (error) {
        return res.status(400).json({
        status: "ERR",
        message: "Delete product failed",
        });
    }
};

const getAllProduct = async (req, res) => {
    try {
      const {limit,page,sort,filter} = req.body;
        const allProduct = await productService.getAllProduct(Number(limit)|| 8, Number(page) || 0,sort,filter);
        return res.status(200).json(allProduct);
    } catch (error) {
        return res.status(400).json({
        status: "ERR",
        message: "Update product failed",
        });
    }
};

const getDetailProduct = async (req, res) => {
    try {
        const id  = req.params.id;
        const detailProduct = await productService.getDetailProduct(id);
        return res.status(200).json(detailProduct);
      } catch (error) {
        return res.status(400).json({
          status: "ERR",
          message: "Get Detail product failed",
        });
      }
};

const deleteManyProduct = async(req,res) => {
  try {
    const ids = req.body.ids;
    if(!ids){
      return res.status(404).json({
        status: 'ERR',
        message: 'The ids is required'
      })
    }
    const response = await productService.deleteMany(ids);
    return res.status(200).json(response)
  } catch (error) {
    res.status(404).json({
      status: 'ERR',
      message: 'Failed to delete all product'
    })
  }
}

const getAllType = async(req,res) => {
  try {
    const response = await productService.getAllType();
    return res.status(200).json(response)
  } catch (error) {
    res.status(404).json({
      status: 'ERR',
      message: 'Failed to get all type'
    })
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
  deleteManyProduct,
  getAllType
  
};
