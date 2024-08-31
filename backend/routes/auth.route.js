import express from 'express';
import { checkAuth, forgotPassword, logout, resetPassword, signin, signup, verifyEmail } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',signin);
authRouter.post('/logout',logout);
authRouter.post('/verifyEmail',verifyEmail);
authRouter.post('/forgotPassword',forgotPassword);
authRouter.post('/resetPassword/:token',resetPassword);
authRouter.get("/check-auth", verifyToken, checkAuth);

export default authRouter;