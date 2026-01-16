import { Router } from 'express';
import { createGiftCard, getAllGiftCards, updateGiftCard, deleteGiftCard } from '../controllers/giftCard.controller.js';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import upload from '../middleware/multer.js';

const router = Router();

// Public endpoint to list all gift cards
router.get('/', getAllGiftCards);

// Admin protected routes
router.post('/', auth, admin, createGiftCard);
router.put('/:id', auth, admin, updateGiftCard);
router.delete('/:id', auth, admin, deleteGiftCard);

export default router;
