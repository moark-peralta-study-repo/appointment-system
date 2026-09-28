import { Router } from "express";
import { listVets, getVetDetails } from "../controllers/vetController.js";

const router = Router();

router.get("/", listVets);
router.get("/:id", getVetDetails);
// router.post("/");
// router.post("/:id");
// router.put("/vets/:id");
// router.delete("/vets/:id");

export default router;
