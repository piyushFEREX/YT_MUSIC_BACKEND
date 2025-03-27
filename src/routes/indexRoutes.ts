import express from 'express'
import { homeRoute } from '../controllers/indexControllers'

const router = express.Router()


router.get('/', homeRoute)

export default router;