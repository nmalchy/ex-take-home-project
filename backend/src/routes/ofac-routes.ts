import { Router } from 'express';
import { checkSanctionsList } from '../controllers/ofac-controller';
import { validateSanctionedUsersCheckRequest } from '../validators/ofac-validators';

const router: Router = Router();

// OFAC API routes
router.post('/v1/check-sanctions-list', validateSanctionedUsersCheckRequest, checkSanctionsList);

// Add more routes as app grows

export default router;
