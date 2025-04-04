const Product = require("../models/ProductModel");
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description, discount } =
      newProduct;

    try {
      const checkedProduct = await Product.findOne({
        name: name,
      });
      if (checkedProduct) {
        resolve({
          status: "ERR",
          message: "Product is already exits",
        });
      }
      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock: Number(countInStock),
        rating,
        description,
        discount: Number(discount)
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "Create product success",
          data: createdProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProduct = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkedProduct = await Product.findOne({
        _id: id,
      });
      if (!checkedProduct) {
        resolve({
          status: "ERR",
          message: "Product not found",
        });
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (updatedProduct) {
        resolve({
          status: "OK",
          message: "Update product success",
          data: updatedProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailProduct = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkedProduct = await Product.findOne({
        _id: id,
      });
      if (!checkedProduct) {
        resolve({
          status: "ERR",
          message: "Product not found",
        });
      }
      const detailProduct = await Product.findOne({_id: id});
      if (detailProduct === null) {
        resolve({
          status: "ERR",
          message: "Failed to retrieve product details",
          data: detailProduct,
        });
      }
      resolve({
        status: "OK",
        message: "Get detail product success",
        data: detailProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProduct = (limit, page, sort,filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.count();
      if(filter){
      const label= filter[0];

        const objectFilter = {};
        objectFilter[filter[0]] = filter[1];
        const allObjectFilter = await Product.find({[label]: {'$regex': filter[1],}}).limit(limit).skip(page * limit);
        resolve({
          status: "OK",
          message: "Get all product success",
          data: allObjectFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          message: "Get all product success",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit)
        .sort({
          name: sort,
        });

      resolve({
        status: "OK",
        message: "Get all product success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async(resolve, reject) => {
    try {
      const checkedProduct = await Product.findOne({ _id: id });
      if (checkedProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteManyProduct = (ids) =>{
  return new Promise(async(resolve,reject)=>{
    try {
      await Product.deleteMany({_id: ids})
      resolve({
        status: 'OK',
        message:'Delete All product success'
      })
    } catch (error) {
      reject(error)
    }
  })
}

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct('type')
      resolve({
        status: "OK",
        message: "Get all product success",
        data: allType,

      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType
};
