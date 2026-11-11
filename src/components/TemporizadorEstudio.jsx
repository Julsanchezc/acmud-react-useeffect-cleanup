import React, { useState, useEffect } from 'react';

/**
 * ============================================================================
 * CASO DE USO 2: TEMPORIZADORES (setInterval) CON FUNCIÓN DE LIMPIEZA
 * ============================================================================
 * 
 * ¿Por qué es fundamental la función de limpieza con setInterval?
 * `setInterval` inicia un hilo temporizado que ejecuta una función repetidamente
 * cada N milisegundos en el runtime del navegador.
 * 
 * Si el componente se desmonta de la pantalla sin llamar a `clearInterval(intervalId)`,
 * el temporizador continuará ejecutándose indefinidamente en segundo plano,
 * consumiendo CPU y provocando advertencias de "Can't perform a React state update
 * on an unmounted component".
 * 
 * @param {Object} props
 * @param {Function} [props.onLog] - Callback para reportar eventos a la terminal visual.
 */
function TemporizadorEstudio({ onLog }) {
  const TIEMPO_INICIAL_SEGUNDOS = 25 * 60; // 25 minutos estándar de Pomodoro
  const [segundosRestantes, setSegundosRestantes] = useState(TIEMPO_INICIAL_SEGUNDOS);
  const [estaCorriendo, setEstaCorriendo] = useState(false);

  useEffect(() => {
    // Si el temporizador no está activo, no creamos ningún intervalo
    if (!estaCorriendo) return;

    if (onLog) {
      onLog(`[${new Date().toLocaleTimeString()}] ⏱️ [Temporizador] setInterval iniciado (1000ms).`);
    }

    /**
     * 1. INICIALIZACIÓN DEL INTERVALO
     * Descuenta un segundo en cada ciclo utilizando la forma funcional de setSegundosRestantes
     * para asegurar el valor más reciente del estado sin depender de cierres obsoletos (stale closures).
     */
    const intervaloId = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervaloId);
          setEstaCorriendo(false);
          if (onLog) {
            onLog(`[${new Date().toLocaleTimeString()}] 🔔 [Temporizador] ¡Sesión de estudio completada!`);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    /**
     * 2. FUNCIÓN DE LIMPIEZA OBLIGATORIA (CLEANUP):
     * Cancela el temporizador activo cuando:
     * - El usuario pausa el temporizador (cambia estaCorriendo).
     * - El componente se desmonta o destruye de la interfaz.
     */
    return () => {
      if (onLog) {
        onLog(`[${new Date().toLocaleTimeString()}] 🛑 [Temporizador] LIMPIEZA: clearInterval(${intervaloId}) ejecutado.`);
      }
      clearInterval(intervaloId);
    };
  }, [estaCorriendo, onLog]); // Se reactiva solo al cambiar el estado de ejecución

  /**
   * Formateador de segundos a mm:ss
   */
  const formatearTiempo = (totalSegundos) => {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const reiniciar = () => {
    setEstaCorriendo(false);
    setSegundosRestantes(TIEMPO_INICIAL_SEGUNDOS);
    if (onLog) {
      onLog(`[${new Date().toLocaleTimeString()}] 🔄 [Temporizador] Tiempo restablecido a 25:00.`);
    }
  };

  return (
    <div className="acm-widget acm-widget--timer">
      <div className="acm-widget__header">
        <h4>⏱️ Temporizador Pomodoro de Estudio</h4>
        <span className={`acm-badge-pill ${estaCorriendo ? 'acm-badge-pill--active' : 'acm-badge-pill--paused'}`}>
          {estaCorriendo ? 'Corriendo' : 'Pausado'}
        </span>
      </div>

      <div className="acm-timer-display">
        {formatearTiempo(segundosRestantes)}
      </div>

      <div className="acm-timer-controls">
        <button
          className={`acm-control-btn ${estaCorriendo ? 'acm-control-btn--pause' : 'acm-control-btn--start'}`}
          onClick={() => setEstaCorriendo(!estaCorriendo)}
        >
          {estaCorriendo ? '⏸️ Pausar' : '▶️ Iniciar'}
        </button>

        <button
          className="acm-control-btn acm-control-btn--reset"
          onClick={reiniciar}
        >
          🔄 Reiniciar
        </button>
      </div>

      <p className="acm-widget__hint">
        💡 <em>Si desmontas este componente mientras corre, la función de limpieza detiene el intervalo automáticamente.</em>
      </p>
    </div>
  );
}

export default TemporizadorEstudio;
