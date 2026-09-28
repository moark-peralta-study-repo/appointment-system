import { Router } from "express";
import { listVets } from "../controllers/vetController.js";

const router = Router();

router.get("/", listVets);
// router.get("/:id");
// router.post("/");
// router.post("/:id");
// router.put("/vets/:id");
// router.delete("/vets/:id");

export default router;
