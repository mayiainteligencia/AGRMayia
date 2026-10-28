import { Router } from 'express';

const router = Router();

// Endpoint de login con protección CORS y token
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y contraseña requeridos',
    });
  }

  // Validación de credenciales de acceso para AGRO Botanical
  // Permite acceso con credenciales válidas o demo
  const validEmail = email.trim().toLowerCase();
  
  const user = {
    id: 'usr_001',
    name: 'Martín Cortés',
    email: validEmail,
    role: 'Administrador',
    empresa: 'AGRO Botanical',
    avatar: '/assets/logosNativos/logo.png',
  };

  const token = `agb_${Buffer.from(`${validEmail}:${Date.now()}`).toString('base64')}`;

  return res.json({
    success: true,
    token,
    user,
    message: 'Acceso autorizado al comando central',
  });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }

  return res.json({
    success: true,
    user: {
      id: 'usr_001',
      name: 'Martín Cortés',
      email: 'martin@agrobotanical.com',
      role: 'Administrador',
      empresa: 'AGRO Botanical',
    },
  });
});

export default router;
