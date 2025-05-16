import express from "express"
import { deletereg, fetch, fetchOne, register, updatereg } from "../controllers/control.js"

const router = express.Router()

router.post('/register',register)
router.get('/fetch',fetch)
router.post('/update/:id',updatereg)
router.post('/delete/:id',deletereg)
router.get('/fetchone/:id',fetchOne)

export default router