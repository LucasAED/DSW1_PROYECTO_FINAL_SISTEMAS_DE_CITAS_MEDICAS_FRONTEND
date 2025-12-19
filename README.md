# 🏥 Sistema de Gestión de Citas Médicas - Frontend (React)

Interfaz de usuario moderna (SPA) desarrollada en **React + Vite** para la gestión de clínicas. Este proyecto consume la API RESTful .NET y ofrece una experiencia visual interactiva para la administración de doctores y reservas de citas.

## 🚀 Tecnologías Principales
* **Framework:** React 18
* **Build Tool:** Vite (Para carga ultrarrápida)
* **Estilos:** CSS Modules / Modern CSS
* **HTTP Client:** Fetch API
* **Alertas/UX:** SweetAlert2 (Para notificaciones de éxito/error)

## ✨ Funcionalidades de Interfaz

### 1. 🎨 Estado en Tiempo Real (Visual Feedback)
La interfaz reacciona a la hora del sistema y al estado de los datos:
* **Badges Dinámicos:** Los doctores muestran indicadores visuales:
    * 🟢 **"Atendiendo":** Si la hora actual está dentro de su turno.
    * 🟡 **"Ocupado":** Si tiene una cita en curso.
    * ⚪ **"Fuera de Turno":** Si su horario laboral terminó.
* **Validación Visual:** Los campos de formulario se bloquean o validan instantáneamente para evitar errores de usuario.

### 2. 🌍 Manejo de Zonas Horarias (Frontend)
El sistema resuelve el problema de discrepancia horaria:
* Recibe fechas en formato **UTC (Z)** desde el Backend.
* Las convierte automáticamente a la **hora local del navegador** del usuario antes de mostrarlas en tablas o formularios.
* Garantiza que una cita a las "03:00 AM" se vea como tal, sin importar el servidor.

### 3. 🛡️ Validaciones de Formulario
* Bloqueo de fechas pasadas.
* Detección de cruces de horario (Turnos de amanecida) antes de enviar la solicitud al servidor.

## ⚙️ Instalación y Ejecución

Como el proyecto no incluye la carpeta `node_modules` (por optimización), es necesario instalar las dependencias primero.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/LucasAED/DSW1_PROYECTO_FINAL_SISTEMAS_DE_CITAS_MEDICAS_FRONTEND.git](https://github.com/LucasAED/DSW1_PROYECTO_FINAL_SISTEMAS_DE_CITAS_MEDICAS_FRONTEND.git)
    ```

2.  **Entrar a la carpeta del proyecto:**
    ```bash
    cd DSW1_PROYECTO_FINAL_SISTEMAS_DE_CITAS_MEDICAS_FRONTEND
    ```

3.  **Instalar dependencias (¡IMPORTANTE!):**
    ```bash
    npm install
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    * El proyecto se abrirá generalmente en `http://localhost:5173`.

## 🔌 Conexión con Backend

El Frontend está configurado para buscar la API en el puerto local por defecto.
* Asegúrese de que el Backend (.NET) esté en ejecución **antes** de intentar iniciar sesión o cargar datos.
* Si necesita cambiar la URL de la API, verifique el archivo de configuración o constantes (ej. `apiConfig.js` o `.env`).

---
**Autor:** Lucas Alonso Escalante Delgado
**Curso:** Desarrollo de Servicios Web I (DSW1)
