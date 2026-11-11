import React, { useState, useCallback } from 'react';
import MonitorVentana from './components/MonitorVentana.jsx';
import TemporizadorEstudio from './components/TemporizadorEstudio.jsx';

/**
 * ============================================================================
 * APLICACIÓN PRINCIPAL: AUDITORÍA DE CICLO DE VIDA Y CLEANUP FUNCTION
 * ============================================================================
 * 
 * Este panel interactivo permite montar y desmontar dinámicamente componentes
 * que utilizan `useEffect`, evidenciando en tiempo real tanto en la pantalla
 * como en la consola del navegador la ejecución exacta de las funciones de
 * limpieza (`cleanup function`).
 */
function App() {
  // Estados para controlar el montaje/desmontaje reactivo de cada componente
  const [mostrarMonitor, setMostrarMonitor] = useState(true);
  const [mostrarTimer, setMostrarTimer] = useState(true);

  // Registro de logs visuales para evidenciar el ciclo de vida
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] 🚀 Panel de auditoría de efectos inicializado.`
  ]);

  /**
   * Callback memorizado para agregar entradas a la consola en pantalla
   */
  const agregarLog = useCallback((mensaje) => {
    setLogs((prev) => [mensaje, ...prev.slice(0, 19)]); // Guardar últimas 20 entradas
  }, []);

  const limpiarConsola = () => {
    setLogs([`[${new Date().toLocaleTimeString()}] 🧹 Consola visual limpiada.`]);
  };

  return (
    <div className="acm-app">
      {/* Encabezado */}
      <header className="acm-header">
        <div className="acm-badge">ACM UD — Frontend ReactJS</div>
        <h1>Tarea 2: Hook useEffect y Función de Limpieza</h1>
        <p className="acm-subtitle">
          Verificación empírica de gestión de ciclo de vida, eliminación de listeners globales
          y cancelación de temporizadores para prevención de fugas de memoria (<em>Memory Leaks</em>).
        </p>
      </header>

      {/* Barra de Controles de Montaje / Desmontaje */}
      <section className="acm-controls-panel">
        <div className="acm-controls-group">
          <span className="acm-controls-title">Interruptores de Montaje (useState):</span>
          
          <button
            className={`acm-toggle-btn ${mostrarMonitor ? 'acm-toggle-btn--active' : 'acm-toggle-btn--danger'}`}
            onClick={() => setMostrarMonitor(!mostrarMonitor)}
          >
            {mostrarMonitor ? 'Destruir Monitor de Pantalla' : 'Montar Monitor de Pantalla'}
          </button>

          <button
            className={`acm-toggle-btn ${mostrarTimer ? 'acm-toggle-btn--active' : 'acm-toggle-btn--danger'}`}
            onClick={() => setMostrarTimer(!mostrarTimer)}
          >
            {mostrarTimer ? 'Destruir Temporizador' : 'Montar Temporizador'}
          </button>
        </div>

        <button className="acm-clear-btn" onClick={limpiarConsola}>
          🧹 Limpiar Registros
        </button>
      </section>

      {/* Cuadrícula Principal */}
      <main className="acm-main-grid">
        {/* Columna de Widgets Reactivos */}
        <div className="acm-widgets-column">
          {/* Componente 1: Monitor de Pantalla */}
          {mostrarMonitor ? (
            <MonitorVentana onLog={agregarLog} />
          ) : (
            <div className="acm-placeholder-card">
              <span className="acm-placeholder-icon">🔴</span>
              <h4>Monitor de Pantalla desmontado</h4>
              <p>La función <code>return () =&gt; removeEventListener(...)</code> liberó la memoria de la ventana.</p>
            </div>
          )}

          {/* Componente 2: Temporizador Pomodoro */}
          {mostrarTimer ? (
            <TemporizadorEstudio onLog={agregarLog} />
          ) : (
            <div className="acm-placeholder-card">
              <span className="acm-placeholder-icon">🔴</span>
              <h4>Temporizador de Estudio desmontado</h4>
              <p>La función <code>return () =&gt; clearInterval(...)</code> canceló el intervalo en segundo plano.</p>
            </div>
          )}
        </div>

        {/* Columna de Consola de Auditoría en Tiempo Real */}
        <div className="acm-terminal-column">
          <div className="acm-terminal">
            <div className="acm-terminal__header">
              <div className="acm-terminal__dots">
                <span className="acm-dot acm-dot--red"></span>
                <span className="acm-dot acm-dot--yellow"></span>
                <span className="acm-dot acm-dot--green"></span>
              </div>
              <span className="acm-terminal__title">Terminal de Ciclo de Vida (Cleanup Audit)</span>
            </div>

            <div className="acm-terminal__body">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`acm-terminal__line ${
                    log.includes('LIMPIEZA')
                      ? 'acm-terminal__line--cleanup'
                      : log.includes('Suscripción') || log.includes('iniciado')
                      ? 'acm-terminal__line--mount'
                      : ''
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Guía Teórica y Buenas Prácticas */}
      <footer className="acm-footer">
        <div className="acm-theory-box">
          <h3>🧠 Anatomía Canónica del Cleanup en useEffect</h3>
          <pre className="acm-code-block">
{`useEffect(() => {
  // 1. FASE DE MONTAJE / SUSCRIPCIÓN
  // Operaciones que conectan recursos externos:
  window.addEventListener('resize', manejarResize);
  const timerId = setInterval(hacerAlgo, 1000);

  // 2. FUNCIÓN DESTRUCTURA (CLEANUP OBLIGATORIO)
  // Se ejecuta al desmontar el componente o antes de volver a ejecutar el efecto:
  return () => {
    window.removeEventListener('resize', manejarResize);
    clearInterval(timerId);
  };
}, [/* dependencias */]);`}
          </pre>
        </div>
      </footer>
    </div>
  );
}

export default App;
