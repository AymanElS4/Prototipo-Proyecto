# 🏔️ Rescatando al Turista - Prototipo RPG Educativo

> **Prototipo interactivo de alta fidelidad** desarrollado para pruebas de usuario en la enseñanza de **inglés funcional** orientado a trabajadores del sector turístico en pueblos andinos del Perú.

El juego está ambientado en el ficticio pueblo tradicional de **San Pedro de las Nubes**. El jugador asume el rol de un guía turístico local que asiste a visitantes extranjeros mientras aprende y refuerza vocabulario y frases útiles en situaciones cotidianas.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19 con TypeScript
- **Empaquetador y Servidor Local:** Vite 6
- **Estilos:** CSS Plano 2D (Flat Retro RPG UI, sin sombras pesadas para máximo rendimiento)
- **Iconografía:** Lucide React
- **Celebración y Efectos:** Canvas Confetti
- **Persistencia:** Estados locales y `localStorage` (sin necesidad de backend ni base de datos externa)

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### Pasos:
1. **Abrir la terminal** en la carpeta raíz del proyecto:
   ```bash
   cd "c:\Users\Ayman El Salous Mnz\OneDrive\Desktop\Prototipo fin"
   ```

2. **Instalar dependencias** (si es la primera vez):
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Ingresa a: **[http://localhost:5173/](http://localhost:5173/)**

---

## 📱 Formato de Pantalla (Mobile-First)

El prototipo está diseñado y adaptado a las proporciones de un smartphone moderno como el **Xiaomi Redmi 15C** (pantalla de 6.88", relación de aspecto 20.6:9, contenedor de 460px de ancho y hasta 940px de alto con notch central).

---

## 🎮 Guía de Pruebas de Usuario (Paso a Paso)

Este prototipo permite realizar el recorrido completo de evaluación de usabilidad para el **Módulo 1**:

```
Menú Principal ➡️ Selección de Módulos ➡️ Pueblo de San Pedro ➡️ Actividad 1 (Maleta) ➡️ Actividad 2 (Sopa de Letras) ➡️ Actividad 3 (Speaking Simulado) ➡️ Recompensa Final (Llave Dorada + Chullo)
```

### 1. Menú Principal y Personalización
- **`INICIAR PARTIDA`**: Ingresa directamente a la pantalla de selección de niveles (Ruta del Valle).
- **`Personalizar Avatar`**: Permite cambiar el nombre del guía, color del poncho/vestimenta tradicional y equipar accesorios en la cabeza (**Chullo andino**, **Sombrero de paja**, **Gorra de guía** o el **Chullo Dorado de Guía** al ser desbloqueado).
- **`Bitácora`**: Muestra las insignias obtenidas y el historial de actividades con puntajes.
- **`Ajustes`**: Pausa, controles y opción para reiniciar el progreso.

### 2. Mapa Lineal de 6 Módulos (World Map)
- **Módulo 1 (San Pedro de las Nubes):** Totalmente jugable y accesible con el botón *"¡Entrar al Módulo 1!"*.
- **Módulos 2 al 6:** Representados como bloqueados con candado 🔒. Al intentar entrar, una ventana pequeña explica que se requiere completar el Módulo 1 y portar la **Llave Dorada**.

### 3. Exploración del Pueblo de San Pedro (Módulo 1)
- **Movimiento:** 
  - **Teclado:** Teclas `W`, `A`, `S`, `D` o las flechas de dirección.
  - **D-Pad Virtual:** Cruz táctil en la esquina inferior izquierda.
  - **Clic en el suelo:** Tocar cualquier parte del suelo para que el personaje camine hasta allí.
- **Interacción:**
  - Presionar tecla `[E]` o tocar el botón circular dorado **`[HABLAR]`** en la esquina inferior derecha.
  - O tocar directamente a cualquier NPC en la pantalla:
    - 🤠 **Mr. John Miller:** Turista norteamericano en la plaza que perdió su equipaje.
    - 🧔🏽 **Don Mateo:** Jefe de Información Turística (al norte).
    - 👵🏽 **Doña Rosa:** Maestra artesana de tejidos (al oeste).

### 4. Actividad 1: Búsqueda del Equipaje Perdido
1. Habla con **Mr. John** en la plaza. Explica que perdió su equipaje.
2. Al aceptar la misión, aparece la **pantalla de introducción pedagógica de vocabulario** (*Backpack, Blue, Circle, Lost*) con explicaciones e instrucciones.
3. John especifica en el diálogo: *"It is a blue backpack with a circle in the center. ¡Es una maleta azul con un círculo!"*.
4. Aparecen **4 maletas distribuidas por el pueblo**:
   - 🔴 Roja con cuadrado (*red backpack with a square*).
   - 🟢 Verde con triángulo (*green backpack with a triangle*).
   - 🟡 Amarilla con estrella (*yellow backpack with a star*).
   - 🔵 **Azul con círculo (*blue backpack with a circle - Correcta*)**.
5. **Retroalimentación pedagógica:** Si el participante toca una maleta equivocada, surge una ventana en español explicando las características en inglés de lo que seleccionó frente a lo que John pidió, con opción de reintentar.
6. Al tocar la maleta correcta, se obtiene la insignia *"Ojo de Halcón"*, puntos XP y se actualiza la misión para entregársela a John.

### 5. Actividad 2: Sopa de Letras Turística
1. Habla con John para devolverle la maleta; él pedirá repasar las palabras clave de su libreta de viaje.
2. Aparece la pantalla de vocabulario con las 4 palabras: **`backpack`**, **`blue`**, **`circle`**, **`cloudy`**.
3. Se despliega la cuadrícula interactiva de 8x8 con **ilustraciones gráficas de cada objeto**.
4. Al seleccionar las letras correctas en la cuadrícula o tocar una palabra:
   - Aparece un **visto verde (`✓`) directamente sobre el objeto gráfico**.
   - Si se selecciona una combinación errónea, se entrega retroalimentación pedagógica en español.
5. Al completar las 4 palabras, se otorga la insignia *"Maestro de las Letras"* y +100 puntos.

### 6. Actividad 3: Listening & Speaking (Simulación 100% Visual)
- Flujo interactivo sin dependencias de hardware de sonido:
  1. Se presenta la frase modelo: *"Excuse me, I lost my blue backpack."* con su traducción.
  2. El usuario toca el botón de micrófono 🎙️ **"Toca para Grabar"**.
  3. Se muestra el símbolo visual de escucha: 🔴 *"Escuchando tu voz... (00:0X)"* con ondas 2D activas.
  4. Se muestra el botón: ⏹️ *"Parar Grabación"*.
  5. Al detenerse, aparece el botón: 📤 *"Enviar"*.
  6. Al enviar, surge la pantalla de felicitación 🎉 con precisión del 100%, +150 XP y la insignia *"Voz del Valle"*.

### 7. Cierre del Módulo 1 y Recompensas Obligatorias
- Habla con **Don Mateo** en el Centro de Información Turística.
- Don Mateo felicita al guía y le hace entrega obligatoria de:
  - 🗝️ **La Llave Dorada de San Pedro** (artefacto necesario para abrir los siguientes 5 módulos).
  - 👑 **El Chullo Sagrado de Guía Experto** (accesorio cosmético que ahora se puede equipar en el avatar desde el menú de personalización).

---

## ⚡ Barra de Atajos Rápidos para Pruebas (Quick Test Bar)

Para agilizar las pruebas de usabilidad sin obligar a repetir todo el recorrido, en la esquina superior derecha del mapa del pueblo se incluyó una barra de atajos directos:

| Botón | Acción Inmediata |
|---|---|
| **`🎒 Act. 1`** | Abre la pantalla de vocabulario de la maleta y muestra las 4 maletas en el mapa. |
| **`🔤 Act. 2`** | Abre directamente la Sopa de Letras con tarjetas gráficas. |
| **`🎙️ Act. 3`** | Abre directamente la actividad de Speaking simulada. |
| **`🗝️ Llave`** | Despliega la entrega de la Llave Dorada y el Chullo cosmético con Don Mateo. |

---

## 🌐 Funcionalidades Adicionales

- **Alternancia Online / Offline:** Botón en el HUD superior que permite alternar entre `ONLINE` (verde) y `OFFLINE` (naranja), simulando el estado de sincronización y guardado local.
- **Bitácora y Logros:** Registro en tiempo real de medallas, actividades completadas, errores cometidos y puntuaciones.
- **Menú de Pausa:** Tecla `ESC` o botón de pausa para silenciar audio, consultar controles o reiniciar el progreso local a cero.
- **Rendimiento Instantáneo (0 ms):** Toda la lógica es síncrona en memoria y libre de llamadas bloqueantes de audio o red.
