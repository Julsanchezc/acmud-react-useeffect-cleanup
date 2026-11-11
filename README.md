# Tarea 2: Hook useEffect y Función de Limpieza (Cleanup)

> **Curso:** ACM UD WebDev Frontend ReactJS  
> **Rama Estudiantil:** ACM — Universidad Distrital Francisco José de Caldas  
> **Instructor:** Juan Díaz Peña  
> **Estudiante:** Julián Sánchez (`julsanchezc@unal.edu.co`)  
> **Clase de Referencia:** Clase 05 — *UseEffect Clase* ([Ver en YouTube a partir del minuto 48:27](https://www.youtube.com/watch?v=Cx3KprLCFTA&t=2907s))

---

## 🎯 Objetivo de la Asignación

Desarrollar una aplicación en React que combine los hooks `useState` y `useEffect`, cumpliendo con el requisito obligatorio e ineludible de implementar la **función de limpieza** (`cleanup function` mediante el retorno de función en `useEffect`) para prevenir fugas de memoria (*Memory Leaks*), procesos huérfanos en segundo plano y desincronizaciones en el navegador.

---

## 🧠 Fundamentos Teóricos del Hook useEffect

### 1. ¿Qué es un Efecto Secundario (*Side Effect*)?
En la programación funcional pura de React, un componente debería limitarse a recibir `props` y estado, y retornar JSX sin alterar nada fuera de su propio ámbito. Cualquier operación que interactúe con el entorno exterior es un efecto secundario:
- Suscribirse a eventos globales del navegador (`window.addEventListener`).
- Crear temporizadores asíncronos (`setInterval`, `setTimeout`).
- Realizar peticiones HTTP / APIs (`fetch`, `axios`).
- Manipular directamente nodos del DOM o APIs del navegador (`localStorage`, `geolocation`).

### 2. Las 3 Modalidades del Arreglo de Dependencias
```jsx
// 1. Sin dependencias: se ejecuta en el montaje y tras CADA re-renderizado
useEffect(() => { /* ... */ });

// 2. Arreglo vacío []: se ejecuta UNA SOLA VEZ tras el montaje inicial
useEffect(() => { /* ... */ }, []);

// 3. Con dependencias [a, b]: se ejecuta al montar y cuando 'a' o 'b' cambien
useEffect(() => { /* ... */ }, [a, b]);
```

### 3. Anatomía de la Función de Limpieza (*Cleanup Function*)
```jsx
useEffect(() => {
  // FASE DE MONTAJE / SUSCRIPCIÓN:
  // Se conecta el recurso externo
  const listener = () => console.log('Ventana redimensionada');
  window.addEventListener('resize', listener);

  // FASE DE LIMPIEZA INELUDIBLE (Destructor):
  // React invoca este retorno cuando el componente se desmonta
  // o antes de volver a ejecutar el efecto por cambio de dependencias
  return () => {
    window.removeEventListener('resize', listener);
  };
}, []);
```

---

## 🔬 Casos de Uso Implementados en la Aplicación

### Caso 1: Monitor de Pantalla y Red ([`MonitorVentana.jsx`](./src/components/MonitorVentana.jsx))
- **Recurso suscrito**: `window.addEventListener('resize')` y `window.addEventListener('online/offline')`.
- **Riesgo sin limpieza**: Si el usuario desmonta el componente y los listeners siguen registrados, el objeto `window` retendrá referencias en memoria a funciones obsoletas, ejecutando cálculos innecesarios cada vez que la ventana cambie de tamaño.
- **Limpieza aplicada**: En el `return () => { ... }`, se ejecuta `window.removeEventListener(...)` para cada evento registrado.

### Caso 2: Temporizador Pomodoro ([`TemporizadorEstudio.jsx`](./src/components/TemporizadorEstudio.jsx))
- **Recurso suscrito**: `setInterval(..., 1000)` para descontar segundos de estudio.
- **Riesgo sin limpieza**: El hilo de JavaScript mantendrá activo el intervalo en segundo plano aunque el usuario haya salido de la vista, consumiendo ciclos de CPU e intentando actualizar estado inexistente (`Warning: Can't perform a React state update on an unmounted component`).
- **Limpieza aplicada**: Se almacena el identificador `intervaloId` y se ejecuta `clearInterval(intervaloId)` tanto al pausar como al desmontar.

### Caso 3: Panel de Auditoría en Tiempo Real ([`App.jsx`](./src/App.jsx))
- Permite al evaluador destruir y montar cualquiera de los dos componentes con botones interactivos.
- Muestra una **terminal visual** con marcas de tiempo exactas que certifica cuándo se activó la suscripción y cuándo se ejecutó la función de limpieza.

---

## 📂 Arquitectura de Archivos del Proyecto

```text
acmud-react-useeffect-cleanup/
├── README.md                          # Documentación completa y guía técnica
├── index.html                         # Punto de entrada HTML
├── package.json                       # Dependencias (React 18 + Vite)
├── vite.config.js                     # Configuración del compilador Vite
└── src/
    ├── main.jsx                       # Montaje en el Virtual DOM
    ├── App.jsx                        # Panel interactivo de auditoría y desmontaje
    ├── index.css                      # Sistema de diseño oscuro tipo dashboard
    └── components/
        ├── MonitorVentana.jsx         # Caso 1: Event listeners globales + cleanup
        └── TemporizadorEstudio.jsx    # Caso 2: setInterval + clearInterval
```

---

## 🛠️ Instrucciones de Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd acmud-react-useeffect-cleanup

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo local
npm run dev

# 4. Validar compilación de producción
npm run build
```

---

## 📜 Historial de Commits Atómicos (Convención Git)

1. `chore: inicializar proyecto React con Vite y configuracion base`
2. `feat(hooks): implementar MonitorVentana con event listeners y cleanup obligatorio`
3. `feat(hooks): implementar TemporizadorEstudio con setInterval y cancelacion limpia`
4. `feat(app): integrar panel interactivo para auditoria de memory leaks en vivo`
5. `style: anadir interfaz moderna con feedback visual y terminal de logs`
6. `docs: documentar ciclo de vida, prevencion de fugas de memoria y guia en README`
