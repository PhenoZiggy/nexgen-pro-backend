import express from "express"
import {
  getAllProducts,
  getProductById,
  reduceProductStock,
  addProductStock,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/products"

const router = express.Router()

router.get("/products/get-all", getAllProducts)
router.get("/products/get-by-id", getProductById)
router.post("/products/reduce-stock", reduceProductStock)
router.post("/products/add-stock", addProductStock)
router.post("/products/create", createProduct)
router.delete("/products/delete/:id", deleteProduct)
router.put("/products/update", updateProduct)


module.exports = router
