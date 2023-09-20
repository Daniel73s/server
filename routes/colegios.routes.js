const { Router } = require('express');
const { getAllColegios, postColegio, patchColegio, deleteColegio } = require('../controllers/colegios.controller');
const router = Router();

router.get('/', getAllColegios);
router.post('/',postColegio);
router.patch('/:id',patchColegio);
router.delete('/',deleteColegio);

module.exports = router;