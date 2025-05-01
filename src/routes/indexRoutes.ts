import express from 'express'
import { homeRoute, profileRoute } from '../controllers/indexControllers'
import { isAuthenticated } from '../middlewares/Authentication';
import { getFile } from '../controllers/audioControllor';

const router = express.Router()



router.get('/home', isAuthenticated, homeRoute)

router.get('/profile' , profileRoute)
router.get("/api/files/:id", getFile);
export default router;
