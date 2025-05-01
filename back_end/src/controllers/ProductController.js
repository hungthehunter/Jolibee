const productService = require("../services/ProductService");
const cloudinary = require("cloudinary").v2;
const createProduct = async (req, res) => {
  try {
    const image = req.file;
    const { name, type, price, countInStock, rating, description ,discount} = req.body;

    // Kiểm tra nếu thiếu trường nào
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description ||
      !discount
    ) {
      if (image && image.filename) {
        await cloudinary.uploader.destroy(image.filename); // Nếu có lỗi thì xóa ảnh đã upload
      }
      return res.status(400).json({
        status: "ERR",
        message: "Please fill all fields",
        data: { name, image, type, price, countInStock, rating, description,discount },
      });
    }

    // Tạo dữ liệu sản phẩm
    const productData = {
      name,
      image: image.path,
      type,
      price,
      countInStock,
      rating,
      description,
      discount
    };

    // Tạo sản phẩm trong database
    const createdProduct = await productService.createProduct(productData);
    return res.status(200).json(createdProduct);
  } catch (error) {
    // Nếu có lỗi thì xóa ảnh đã upload
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    return res.status(400).json({
      status: "ERR",
      message: "Create product failed",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.file;
    const { name, type, price, countInStock, rating, description,discount } = req.body;

    if (!name || !type || !price || !countInStock || !rating || !description || !discount) {
      if (image && image.filename) {
        await cloudinary.uploader.destroy(image.filename);
      }
      return res.status(400).json({
        status: "ERR",
        message: "Please fill all fields",
      });
    }

    // 🔍 Lấy thông tin sản phẩm cũ để xử lý ảnh
    const oldProduct = await productService.getDetailProduct(id);
    if (!oldProduct) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    let newImage = oldProduct.data.image; // mặc định dùng ảnh cũ nếu không có ảnh mới

    if (image) {
      // 📌 Nếu có ảnh mới: cập nhật image path mới và xoá ảnh cũ trên Cloudinary
      newImage = image.path;

      const imageUrl = oldProduct.data.image;
      if (imageUrl) {
        const parts = imageUrl.split("/upload/");
        if (parts.length === 2) {
          const imagePath = parts[1].split(".")[0]; // v1744620365/folder/filename
          const publicId = imagePath.split("/").slice(1).join("/"); // bỏ "v..." → folder/filename

          console.log(
            "🔥 Trying to delete Cloudinary image with publicId:",
            publicId
          );
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("🧾 Cloudinary destroy result:", result);
        }
      }
    }

    const updatedData = {
      name,
      image: newImage,
      type,
      price,
      countInStock: Number(countInStock),
      rating,
      description,
      discount: Number(discount),
    };


    const updatedProduct = await productService.updateProduct(id, updatedData);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    return res.status(400).json({
      status: "ERR",
      message: "Update product failed",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productService.getDetailProduct(id);
    if (!product) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    const imageUrl = product.data.image;
    console.log('imageUrl',imageUrl)
    if (imageUrl) {
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        const imagePath = parts[1].split(".")[0]; // v1744620365/jolibee/gm61ofrspgvzqudn4p87
        const publicId = imagePath.split("/").slice(1).join("/"); // bỏ "v1744620365"
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await productService.deleteProduct(id);
    return res.status(200).json({
      status: "OK",
      message: "Delete product success",
    });
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: "Delete product failed",
      error: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const allProduct = await productService.getAllProduct(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
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
    const id = req.params.id;
    const detailProduct = await productService.getDetailProduct(id);
    return res.status(200).json(detailProduct);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: "Get Detail product failed",
    });
  }
};

// const deleteManyProduct = async (req, res) => {
//   try {
//     const ids = req.body.ids;
//     if (!ids) {
//       return res.status(404).json({
//         status: "ERR",
//         message: "The ids is required",
//       });
//     }
//     const response = await productService.deleteMany(ids);
//     return res.status(200).json(response);
//   } catch (error) {
//     res.status(404).json({
//       status: "ERR",
//       message: "Failed to delete all product",
//     });
//   }
// };

const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "The 'ids' field is required and must be a non-empty array",
      });
    }

    // Lấy chi tiết sản phẩm để xóa ảnh
    const products = await Promise.all(
      ids.map((id) => productService.getDetailProduct(id))
    );

    // Xóa ảnh trên Cloudinary
    for (const product of products) {
      if (product && product.data && product.data.image) {
        const imageUrl = product.data.image;
        const parts = imageUrl.split("/upload/");
        if (parts.length === 2) {
          const imagePath = parts[1].split(".")[0];
          const publicId = imagePath.split("/").slice(1).join("/");
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Xóa sản phẩm trong database
    const response = await productService.deleteMany(ids);

    return res.status(200).json({
      status: "OK",
      message: "Deleted products and images successfully",
      data: response,
    });
  } catch (error) {
    console.error("Delete many products failed:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Failed to delete products",
      error: error.message,
    });
  }
};


const getAllType = async (req, res) => {
  try {
    const response = await productService.getAllType();
    return res.status(200).json(response);
  } catch (error) {
    res.status(404).json({
      status: "ERR",
      message: "Failed to get all type",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
  deleteManyProduct,
  getAllType,
};
