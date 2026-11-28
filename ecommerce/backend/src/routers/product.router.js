import { Router } from "express";
import { create, deleteById, read, readById, statusUpdate, updateById ,uploadImages} from "../controllers/product.controller.js";
const router = Router();

router.post("/create", create);
router.get("/", read);
router.get("/:id", readById);
router.delete("/delete/:id", deleteById);
router.patch("/status-update/:id", statusUpdate);
router.put("/update/:id", updateById);
router.post("/upload-images/:id", uploadImages);


export default router