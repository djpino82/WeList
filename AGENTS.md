# AGENTS.md

## Objetivo

Generar código limpio, sencillo, mantenible y orientado al aprendizaje.

Priorizar siempre:

1. Simplicidad
2. Legibilidad
3. Aprendizaje
4. Mantenibilidad
5. Seguridad
6. Rendimiento

No implementar soluciones complejas si una solución más simple resuelve el problema correctamente.

Aplicar el principio YAGNI (You Aren't Gonna Need It).

---

# Filosofía

Este proyecto tiene fines educativos.

Todo el código debe ser fácil de entender para un desarrollador junior o alguien que está aprendiendo React, Node.js, Prisma y PostgreSQL.

Si existen varias soluciones válidas:

- elegir la más simple
- elegir la más legible
- evitar la más abstracta

---

# Arquitectura

Utilizar arquitectura modular.

Mantener separación clara entre:

- rutas
- controladores
- servicios
- base de datos

Los controladores deben contener únicamente:

- recepción de datos
- validaciones básicas
- llamada a servicios
- respuesta HTTP

Toda la lógica de negocio debe estar en los servicios.

---

# React

Preferir:

- componentes funcionales simples
- hooks sencillos
- React Query para datos remotos

Evitar:

- patrones avanzados innecesarios
- HOCs
- render props
- abstracciones complejas

Extraer componentes sólo cuando mejore la legibilidad.

---

# Backend

Preferir funciones claras y directas.

Evitar capas innecesarias.

No crear patrones enterprise si no aportan valor real.

La lógica debe ser explícita y fácil de seguir.

---

# Base de datos

Usar Prisma.

Definir relaciones de forma clara.

Crear índices para campos utilizados frecuentemente en búsquedas.

Evitar consultas innecesariamente complejas.

---

# Seguridad

Nunca confiar en datos enviados desde el frontend.

Validar siempre en backend.

Utilizar:

- JWT
- bcrypt
- Zod

Nunca devolver:

- hashes de contraseñas
- secretos
- tokens internos

Aplicar siempre los permisos definidos por la aplicación.

---

# Socket.IO

Utilizar salas.

Validar autenticación antes de permitir conexiones o acceso a salas.

Emitir eventos únicamente a las salas correspondientes.

Evitar broadcasts globales.

---

# Código

Utilizar nombres descriptivos.

Evitar abreviaturas.

Evitar comentarios obvios.

El código debe ser autoexplicativo.

Comentar únicamente cuando una decisión no sea evidente.

---

# Errores

Implementar manejo centralizado de errores.

Mantener respuestas API consistentes.

No exponer detalles internos del servidor.

---

# Dependencias

No instalar librerías innecesarias.

Preferir soluciones nativas cuando sean suficientes.

Añadir dependencias sólo cuando aporten una ventaja clara.

---

# Producción

Todo el código generado debe:

- compilar sin errores
- estar listo para producción
- utilizar variables de entorno
- evitar valores hardcodeados

Nunca incluir secretos en el código.

---

# Modificaciones

Cuando se modifique código existente:

- respetar la estructura actual
- evitar reescribir archivos completos innecesariamente
- realizar cambios mínimos y claros
- mantener consistencia con el resto del proyecto
