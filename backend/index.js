import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database.js';
import { initGeminiClient } from './config/gemini.js';
import chatRoutes from './routes/chatRoutes.js';
import departamentosRoutes from './routes/departamentosRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // o 3000 según tu frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

// Routes
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
