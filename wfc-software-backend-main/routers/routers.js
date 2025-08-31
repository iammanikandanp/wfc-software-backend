import express from "express"
import { deletereg, fetch, fetchOne, register, updatereg } from "../controllers/control.js"
import parser from "../middleware/multer.js";
const router = express.Router()
router.post(
  "/register",
  parser.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "frontBodyImage", maxCount: 1 },
    { name: "sideBodyImage", maxCount: 1 },
    { name: "backBodyImage", maxCount: 1 },
  ]),
  register
);

router.get('/fetch',fetch)
router.post('/update/:id',updatereg)
router.post('/delete/:id',deletereg)
router.get('/fetchone/:id',fetchOne)

export default router