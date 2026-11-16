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
Menú Principal ➡️ Mapa General 2D ➡️ Pueblo de San Pedro ➡️ Actividad 1 (Maleta) ➡️ Actividad 2 (Sopa de Letras) ➡️ Actividad 3 (Unir con Líneas) ➡️ Actividad 4 (Speaking Simulado) ➡️ Recompensa Final (Llave Dorada + Chullo) ➡️ Desbloqueo Módulo 2
```

### 1. Menú Principal y Personalización
- **`INICIAR PARTIDA`**: Ingresa directamente al mapa general 2D del valle.
- **`Personalizar Avatar`**: Permite cambiar el nombre del guía, color del poncho/vestimenta tradicional y equipar accesorios en la cabeza (**Chullo andino**, **Sombrero de paja**, **Gorra de guía** o el **Chullo Dorado de Guía** al ser desbloqueado).
- **`Bitácora`**: Muestra las insignias obtenidas y el historial de actividades con puntajes.
- **`Ajustes`**: Pausa, controles y opción para reiniciar el progreso.

### 2. Mapa Explorable del Valle Andino (Overworld 2D)
- **Paisaje y Ciudades en 2D:** El mapa general 2D conecta las 6 ciudades/asentamientos andinos.
- **Movimiento Libre:** El jugador puede caminar libremente por el mapa del valle con WASD, flechas, toques en pantalla o el D-Pad táctil.
- **Módulo 1 (San Pedro de las Nubes):** Totalmente accesible. Acercarse o tocarlo despliega el botón `[ENTRAR]` para ingresar al pueblo y sus actividades.
- **Módulo 2 (Mercado de Artesanías):**
  - **Bloqueado con candado 🔒** mientras no se haya completado el Módulo 1.
  - **Desbloqueo con Llave:** Al terminar el Módulo 1 y recibir la **Llave Dorada**, al interactuar con el Módulo 2 en el mapa, **el candado se desbloquea**, se celebra con confeti y se abre la interacción con Don Fernando (Guardián del Mercado).
- **Módulos 3 al 6:** Representados con candados 🔒 no interactivos, indicando que requieren desbloquear los niveles previos en orden.

### 3. Exploración del Pueblo de San Pedro (Módulo 1)
- **Movimiento:** Teclado (WASD / Flechas), D-Pad virtual en pantalla o toque en el suelo.
- **Interacción:** Presionar tecla `[E]`, tocar el botón `[HABLAR]` o tocar directamente a los NPCs:
  - 🤠 **Mr. John Miller:** Turista norteamericano en la plaza.
  - 🧔🏽 **Don Mateo:** Jefe de Información Turística (al norte).
  - 👵🏽 **Doña Rosa:** Maestra artesana de tejidos (al oeste).

### 4. Actividad 1: Búsqueda del Equipaje Perdido
1. Habla con **Mr. John** en la plaza. Explica que perdió su equipaje.
2. Pantalla introductoria de vocabulario (*Backpack, Blue, Circle, Lost*).
3. John describe su maleta: *"blue backpack with a circle"*.
4. Aparecen **4 maletas distribuidas por el pueblo** (Roja con cuadrado, Verde con triángulo, Amarilla con estrella, Azul con círculo).
5. Retroalimentación en español si se elige una errónea, o éxito al encontrar la maleta azul con círculo (+100 XP, insignia *"Ojo de Halcón"*).

### 5. Actividad 2: Sopa de Letras Turística
1. Habla con John para devolverle la maleta; él pedirá repasar las palabras clave de su libreta de viaje.
2. Pantalla de vocabulario con las 4 palabras: **`backpack`**, **`blue`**, **`circle`**, **`cloudy`**.
3. Cuadrícula interactiva de 8x8 con **ilustraciones gráficas de cada objeto**.
4. Al seleccionar las letras correctas, aparece un **visto verde (`✓`) directamente sobre el objeto gráfico**.
5. Al completar las 4 palabras, se otorga la insignia *"Maestro de las Letras"* (+100 XP).

### 6. Actividad 3: Asociación de Oraciones y Unir con Líneas
1. Habla con John; pregunta si conoces a alguien en tu familia que le pueda ayudar en el pueblo.
2. **Pantalla de Vocabulario y Grammar:** Explica la estructura de oraciones: Sujeto + is + Profesión + Lugar de trabajo.
3. **Pantalla de Actividad:**
   - 3 oraciones modelo para leer o escuchar:
     1. *"Mi tío es un policía trabajando en la estación de policía"* (*"My uncle is a police officer working at the police station"*).
     2. *"Mi tía es una recepcionista en un hotel"* (*"My aunt is a receptionist in a hotel"*).
     3. *"Mi primo es un chef en un restaurante"* (*"My cousin is a chef in a restaurant"*).
   - **9 botones distribuidos en 3 columnas:**
     - **Columna 1 (Familia):** `my uncle` 👨🏽, `my aunt` 👩🏽, `my cousin` 👦🏽.
     - **Columna 2 (Profesión):** `chef` 👨‍🍳, `receptionist` 💁‍♀️, `police officer` 👮‍♂️.
     - **Columna 3 (Lugar):** `police station` 🚓, `restaurant` 🍽️, `hotel` 🏨.
   - **Simulación de unión con líneas:** El usuario toca en orden (Familiar ➡️ Profesión ➡️ Lugar).
   - Si se equivoca, recibe retroalimentación pedagógica en español y puede reintentar.
   - Al completar las 3 líneas, recibe la insignia *"Conector del Pueblo"* (+140 XP).

### 7. Actividad 4: Listening & Speaking (Simulación 100% Visual)
- Frase modelo: *"Excuse me, I lost my blue backpack."*
- Flujo interactivo: Micrófono 🎙️ ➡️ Escuchando 🔴 ➡️ Parar ⏹️ ➡️ Enviar 📤 ➡️ Felicitaciones 🎉 (+150 XP, insignia *"Voz del Valle"*).

### 8. Cierre del Módulo 1 y Recompensas Obligatorias
- Habla con **Don Mateo** en el Centro de Información Turística.
- Entrega de:
  - 🗝️ **La Llave Dorada de San Pedro** (artefacto que desbloquea el Módulo 2 en el mapa general).
  - 👑 **El Chullo Sagrado de Guía Experto** (accesorio cosmético equipable).

---

## ⚡ Barra de Atajos Rápidos para Pruebas (Quick Test Bar)

En la esquina superior derecha del pueblo se incluye la barra de atajos directos:

| Botón | Acción Inmediata |
|---|---|
| **`🎒 Act. 1`** | Abre la pantalla de vocabulario de la maleta y muestra las 4 maletas en el mapa. |
| **`🔤 Act. 2`** | Abre directamente la Sopa de Letras con tarjetas gráficas. |
| **`🔗 Act. 3`** | Abre directamente la Asociación de Oraciones y unión con líneas en 3 columnas. |
| **`🎙️ Act. 4`** | Abre directamente la actividad de Speaking simulada. |
| **`🗝️ Llave`** | Despliega la entrega de la Llave Dorada y el Chullo cosmético con Don Mateo. |

---

## 🌐 Funcionalidades Adicionales

- **Alternancia Online / Offline:** Botón en el HUD superior que permite alternar entre `ONLINE` (verde) y `OFFLINE` (naranja), simulando el estado de sincronización y guardado local.
- **Bitácora y Logros:** Registro en tiempo real de medallas, actividades completadas, errores cometidos y puntuaciones.
- **Menú de Pausa:** Tecla `ESC` o botón de pausa para silenciar audio, consultar controles o reiniciar el progreso local a cero.
- **Rendimiento Instantáneo (0 ms):** Toda la lógica es síncrona en memoria y libre de llamadas bloqueantes de audio o red.
