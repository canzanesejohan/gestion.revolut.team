# Gestion Revolut Team

Plataforma centralizada de gestion de productividad con panel de entregas en tiempo real, check-ins diarios, calendario multi-proyecto, analytics, plantillas y reportes automatizados.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Tiempo Real:** Socket.io
- **Notificaciones:** In-app + Telegram Bot API

## Setup rapido

```bash
# 1. Clonar e instalar
git clone https://github.com/canzanesejohan/gestion.revolut.team.git
cd gestion.revolut.team

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Levantar PostgreSQL
docker compose up -d

# 4. Instalar dependencias
npm install

# 5. Crear tablas en la base de datos
npm run db:migrate

# 6. Cargar datos de prueba
npm run db:seed

# 7. Iniciar en desarrollo
npm run dev
```

El frontend estara en `http://localhost:5173` y el backend en `http://localhost:3001`.

## Usuarios de prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@revolut.team | admin123 | ADMIN |
| manager@revolut.team | manager123 | MANAGER |
| ana@revolut.team | member123 | MEMBER |
| luis@revolut.team | member123 | MEMBER |

## Modulos

1. **Panel de Entregas** - Dashboard con estado en tiempo real y deteccion de cuellos de botella
2. **Check-ins Diarios** - Formularios de reporte diario con analisis de bloqueos
3. **Calendario Multi-proyecto** - Vista unificada con drag & drop
4. **Analytics** - Metricas de velocidad, cumplimiento e insights automaticos
5. **Plantillas** - Biblioteca de templates con hitos predefinidos
6. **Reportes Ejecutivos** - Generacion automatica semanal/mensual

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalles completos de la arquitectura.
