import React, { useState, useEffect } from 'react';

/**
 * ============================================================================
 * CASO DE USO 1: LISTENERS GLOBALES DEL NAVEGADOR CON FUNCIÓN DE LIMPIEZA
 * ============================================================================
 * 
 * ¿Por qué es fundamental la función de limpieza (cleanup function)?
 * Al registrar un listener en un objeto global como `window` o `document`,
 * el navegador guarda una referencia en memoria de la función de callback.
 * 
 * Si el componente se desmonta (se destruye) y NO se ejecuta `removeEventListener`,
 * la referencia sigue viva en memoria. Cada vez que el componente se vuelva a
 * montar, se añadirá un nuevo listener duplicado. Esto se conoce como fuga de
 * memoria (Memory Leak), provocando degradación de rendimiento y ejecuciones fantasma.
 * 
 * @param {Object} props
 * @param {Function} [props.onLog] - Callback opcional para registrar eventos en la consola en pantalla.
 */
function MonitorVentana({ onLog }) {
  // Estado local para almacenar las dimensiones de la ventana
  const [dimensiones, setDimensiones] = useState({
    ancho: window.innerWidth,
    alto: window.innerHeight
  });

  // Estado local para estado de conectividad a internet
  const [estaEnLinea, setEstaEnLinea] = useState(navigator.onLine);

  useEffect(() => {
    const timestampMontaje = new Date().toLocaleTimeString();
    if (onLog) {
      onLog(`[${timestampMontaje}] 🟢 [MonitorVentana] Suscripción activa: listeners de 'resize' y 'online/offline' registrados.`);
    }
    console.log(`%c[MonitorVentana] Montado - Listeners agregados`, 'color: #38bdf8; font-weight: bold;');

    /**
     * Handler de redimensionamiento
     */
    const manejarResize = () => {
      setDimensiones({
        ancho: window.innerWidth,
        alto: window.innerHeight
      });
      console.log(`[MonitorVentana] Dimensiones actualizadas: ${window.innerWidth}x${window.innerHeight}px`);
    };

    /**
     * Handler de cambio en la red
     */
    const manejarEstadoRed = () => {
      setEstaEnLinea(navigator.onLine);
      if (onLog) {
        onLog(`[${new Date().toLocaleTimeString()}] 🌐 Estado de red alterado: ${navigator.onLine ? 'En línea' : 'Sin conexión'}`);
      }
    };

    // 1. REGISTRO DE EVENTOS EN EL OBJETO GLOBAL WINDOW
    window.addEventListener('resize', manejarResize);
    window.addEventListener('online', manejarEstadoRed);
    window.addEventListener('offline', manejarEstadoRed);

    /**
     * 2. FUNCIÓN DE LIMPIEZA OBLIGATORIA (CLEANUP):
     * Se ejecuta automáticamente cuando:
     * a) El componente es desmontado del árbol de React.
     * b) Antes de que el efecto se vuelva a ejecutar si cambiaran sus dependencias.
     */
    return () => {
      const timestampDesmontaje = new Date().toLocaleTimeString();
      if (onLog) {
        onLog(`[${timestampDesmontaje}] 🔴 [MonitorVentana] LIMPIEZA EJECUTADA: listeners eliminados correctamente con removeEventListener.`);
      }
      console.log(`%c[MonitorVentana] Desmontado - Listeners removidos exitosamente (0 memory leaks)`, 'color: #ef4444; font-weight: bold;');

      // Eliminación ineludible para prevenir fugas de memoria
      window.removeEventListener('resize', manejarResize);
      window.removeEventListener('online', manejarEstadoRed);
      window.removeEventListener('offline', manejarEstadoRed);
    };
  }, [onLog]); // Arreglo de dependencias estable

  return (
    <div className="acm-widget acm-widget--monitor">
      <div className="acm-widget__header">
        <h4>📡 Monitor de Pantalla & Conectividad</h4>
        <span className={`acm-status-pill ${estaEnLinea ? 'acm-status-pill--online' : 'acm-status-pill--offline'}`}>
          {estaEnLinea ? '● En Línea' : '○ Desconectado'}
        </span>
      </div>

      <div className="acm-metric-grid">
        <div className="acm-metric-card">
          <span className="acm-metric-label">Ancho de ventana</span>
          <strong className="acm-metric-value">{dimensiones.ancho} px</strong>
        </div>
        <div className="acm-metric-card">
          <span className="acm-metric-label">Alto de ventana</span>
          <strong className="acm-metric-value">{dimensiones.alto} px</strong>
        </div>
        <div className="acm-metric-card">
          <span className="acm-metric-label">Orientación</span>
          <strong className="acm-metric-value">
            {dimensiones.ancho > dimensiones.alto ? 'Horizontal' : 'Vertical'}
          </strong>
        </div>
      </div>

      <p className="acm-widget__hint">
        💡 <em>Prueba a cambiar el tamaño de tu navegador: verás cómo los valores reaccionan en tiempo real.</em>
      </p>
    </div>
  );
}

export default MonitorVentana;
