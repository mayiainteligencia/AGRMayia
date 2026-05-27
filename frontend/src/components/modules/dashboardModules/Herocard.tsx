import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  time: string;
};

export const HeroCard: React.FC = () => {
  const { colores, empresa, ia } = brandingConfig;
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `¡Hola! Soy ${ia.nombre}, tu asesor de IA. ¿En qué puedo ayudarte hoy?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Inicializar Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        
        // Detectar palabras clave para enviar
        const textLower = currentText.toLowerCase().trim();
        const hasKeyword = textLower.includes('mayia') || 
                          textLower.includes('enviar') || 
                          textLower.includes('envía') ||
                          textLower.includes('manda');
        
        if (hasKeyword && finalTranscript) {
          // Remover la palabra clave del mensaje
          let cleanedText = currentText
            .replace(/\bmayia\b/gi, '')
            .replace(/\benviar\b/gi, '')
            .replace(/\benvía\b/gi, '')
            .replace(/\bmanda\b/gi, '')
            .trim();
          
          setInput(cleanedText);
          
          // Detener el reconocimiento y enviar
          setIsListening(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          
          // Enviar el mensaje después de un pequeño delay
          setTimeout(() => {
            if (cleanedText.trim()) {
              // Simular el envío
              const messageToSend = cleanedText;
              sendMessageWithText(messageToSend);
            }
          }, 300);
        } else {
          setInput(currentText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Error de reconocimiento:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const handleMicClick = async () => {
    setShowModal(true);
    
    // Esperar a que el modal se abra
    setTimeout(async () => {
      // Solicitar permisos de micrófono
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        setInput('');
        setIsListening(true);
        
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error al iniciar reconocimiento:', error);
          }
        }
      } catch (error) {
        console.error('Error al acceder al micrófono:', error);
        alert('Por favor permite el acceso al micrófono para usar esta función');
      }
    }, 500);
  };

  const toggleListening = async () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (input.trim()) {
        setTimeout(() => sendMessage(), 500);
      }
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        setIsListening(true);
        setInput('');
        
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error al iniciar:', error);
            // Si ya está iniciado, reiniciar
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error de permisos:', error);
        alert('Por favor permite el acceso al micrófono');
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    await sendMessageWithText(input);
  };

  const sendMessageWithText = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      time: now,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: userMessage.content,
          departamento: 'General',
        }),
      });

      if (!response.ok) throw new Error('Error IA');

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.respuesta,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'No fue posible conectar con el asistente. Por favor intenta de nuevo.',
          time: now,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <>
      <div
        className="group relative transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: `linear-gradient(135deg, ${colores.primario}20 0%, ${colores.secundario}20 100%)`,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '28px',
          border: `2px solid ${colores.primario}40`,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Resplandor de fondo */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '700px',
              height: '700px',
              opacity: isHovered ? 0.7 : 0,
              transition: 'opacity 700ms ease-in-out',
              filter: 'blur(100px)',
              background: colores.primario,
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Animated gradient blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${colores.primario}40 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: 'float 6s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '350px',
            height: '350px',
            background: `radial-gradient(circle, ${colores.secundario}40 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite reverse',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Contenido principal con z-index más alto */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 3D Glassmorphic shape */}
          <div
            style={{
              position: 'relative',
              width: '160px',
              height: '120px',
              marginBottom: '16px',
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${i * 5}px`,
                  top: '0',
                  width: '120px',
                  height: '100px',
                  background: `linear-gradient(135deg, 
                    ${colores.primario}${Math.max(20 - i * 2, 5).toString(16).padStart(2, '0')} 0%, 
                    ${colores.secundario}${Math.max(20 - i * 2, 5).toString(16).padStart(2, '0')} 100%)`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '32px',
                  border: `1px solid ${colores.primario}${Math.max(40 - i * 5, 10).toString(16).padStart(2, '0')}`,
                  transform: `perspective(800px) rotateY(${-15 + i * 4}deg) translateZ(${i * 10}px)`,
                  boxShadow: `0 ${10 + i * 5}px ${30 + i * 10}px rgba(0,0,0,0.2)`,
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                }}
              />
            ))}

            <div
              style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                width: '60%',
                height: '30%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                transform: 'perspective(800px) rotateY(-10deg)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: colores.primario,
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}
          >
            Plataforma Inteligente Para {empresa.nombre}
          </h2>

          {/* Texto de instrucción */}
          <p
            style={{
              fontSize: '13px',
              color: colores.textoMedio,
              margin: '0 0 4px 0',
              maxWidth: '400px',
            }}
          >
            Pulsa para comunicarte con tu asesor IA por voz
          </p>
          <p
            style={{
              fontSize: '14px',
              color: colores.textoOscuro,
              margin: '0 0 8px 0',
              maxWidth: '400px',
              fontStyle: 'italic',
            }}
          >
            Di "MAYIA" al final para enviar tu mensaje
          </p>

          {/* Potenciado por MAYIA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: colores.textoOscuro,
              marginBottom: '16px',
            }}
          >
            <span>Potenciado por</span>
            <img
              src="/assets/logosNativos/mayiaLogoBlanco.png"
              alt="MAYIA"
              style={{
                height: '16px',
                width: 'auto',
                objectFit: 'contain',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.textContent = 'MAYIA';
                fallback.style.fontWeight = '600';
                fallback.style.color = colores.primario;
                target.parentElement?.appendChild(fallback);
              }}
            />
          </div>

          {/* Botón de micrófono minimalista - AHORA CON Z-INDEX ALTO */}
          <button
            onClick={handleMicClick}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: `1.5px solid ${colores.primario}40`,
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 20,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${colores.primario}10`;
              e.currentTarget.style.borderColor = colores.primario;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = `${colores.primario}40`;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Mic size={20} color={colores.primario} strokeWidth={2} />
          </button>
        </div>

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              33% { transform: translate(30px, -20px) rotate(5deg); }
              66% { transform: translate(-20px, 20px) rotate(-5deg); }
            }
          `}
        </style>
      </div>

      {/* Modal de Chat */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '600px',
              height: '80vh',
              maxHeight: '700px',
              backgroundColor: colores.fondoSecundario,
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px',
                background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'white', fontSize: '18px' }}>
                    {ia.nombre}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {isListening ? 'Escuchando...' : 'Asesor IA'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={24} color="white" />
              </button>
            </div>

            {/* Mensajes */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                backgroundColor: colores.fondoPrincipal,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    animation: 'fadeIn 0.3s ease',
                  }}
                >
                  {m.role === 'assistant' && (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      AI
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        backgroundColor: m.role === 'user' ? colores.primario : colores.fondoTerciario,
                        background: m.role === 'user' ? `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)` : colores.fondoTerciario,
                        color: m.role === 'user' ? 'white' : colores.textoClaro,
                        padding: '14px 18px',
                        borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '15px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {m.content}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: colores.textoMedio,
                        marginTop: '6px',
                        textAlign: m.role === 'user' ? 'right' : 'left',
                      }}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    AI
                  </div>
                  <div
                    style={{
                      backgroundColor: colores.fondoTerciario,
                      padding: '14px 18px',
                      borderRadius: '18px 18px 18px 4px',
                      display: 'flex',
                      gap: '6px',
                    }}
                  >
                    <div className="typing-dot" />
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: '20px 24px',
                backgroundColor: colores.fondoSecundario,
                borderTop: `1px solid ${colores.borde}`,
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <button
                onClick={toggleListening}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isListening
                    ? `linear-gradient(135deg, ${colores.peligro} 0%, ${colores.advertencia} 100%)`
                    : `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isListening ? 'Escuchando... (Di "MAYIA" para enviar)' : 'Escribe o habla...'}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: `1px solid ${colores.borde}`,
                  backgroundColor: colores.fondoPrincipal,
                  color: colores.textoClaro,
                  outline: 'none',
                  fontSize: '15px',
                }}
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: '14px 20px',
                  borderRadius: '14px',
                  border: 'none',
                  background: loading || !input.trim() ? colores.fondoTerciario : `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
                  color: loading || !input.trim() ? colores.textoMedio : 'white',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes pulse {
                0%, 100% { box-shadow: 0 0 0 0 ${colores.peligro}40; }
                50% { box-shadow: 0 0 0 20px ${colores.peligro}00; }
              }

              .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: ${colores.textoMedio};
                animation: typing 1.4s infinite;
              }

              @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};