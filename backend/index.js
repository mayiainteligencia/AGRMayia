import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database.js';
import { initGeminiClient } from './config/gemini.js';
import chatRoutes from './routes/chatRoutes.js';
import departamentosRoutes from './routes/departamentosRoutes.js';

import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de CORS robusto para proteger el backend y permitir frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests locales seguros, sin origin (herramientas locales) o whitelist
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(new Error('Bloqueado por política CORS de AGRO Botanical'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/departamentos', departamentosRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dashboard IA Backend running' });
});

// Iniciar servidor
async function startServer() {
  try {
    console.log('Iniciando servidor...\n');
    
    // Verificar API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada');
    }
    
    // Inicializar Gemini
    initGeminiClient();
    
    // Probar conexión a BD
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\nServidor corriendo en http://localhost:${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
