# Arquitectura - Gestión de Productividad Revolut Team

## Visión General

Plataforma centralizada de gestión de productividad con 6 módulos principales:

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Panel de Entregas** | Dashboard en tiempo real con estado de todas las entregas por proyecto |
| 2 | **Check-ins Diarios** | Formularios inteligentes de reporte diario (<2 min) |
| 3 | **Calendario Multi-proyecto** | Vista unificada con drag & drop y detección de sobrecargas |
| 4 | **Analytics de Productividad** | Métricas accionables e insights automáticos |
| 5 | **Plantillas de Proyectos** | Biblioteca de templates con hitos predefinidos |
| 6 | **Reportes Ejecutivos** | Generación automática semanal/mensual para stakeholders |

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI** | Tailwind CSS + shadcn/ui |
| **State** | Zustand |
| **Gráficos** | Recharts |
| **Drag & Drop** | @dnd-kit/core |
| **Calendario** | FullCalendar |
| **Backend** | Node.js + Express + TypeScript |
| **Tiempo Real** | Socket.io |
| **Base de Datos** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT (access + refresh tokens) |
| **Telegram** | Telegram Bot API (node-telegram-bot-api) |
| **Scheduler** | node-cron |
| **PDF/Reportes** | Puppeteer (generación PDF) |
| **Validación** | Zod (frontend + backend) |

---

## Estructura del Proyecto

```
gestion.revolut.team/
├── client/                          # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Componentes base (shadcn)
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   ├── dashboard/           # Módulo 1: Panel de Entregas
│   │   │   │   ├── DeliveryBoard.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── BottleneckAlert.tsx
│   │   │   │   ├── KpiCards.tsx
│   │   │   │   └── TimelineChart.tsx
│   │   │   ├── checkins/            # Módulo 2: Check-ins Diarios
│   │   │   │   ├── CheckinForm.tsx
│   │   │   │   ├── CheckinHistory.tsx
│   │   │   │   ├── BlockersList.tsx
│   │   │   │   └── TeamCheckinSummary.tsx
│   │   │   ├── calendar/            # Módulo 3: Calendario
│   │   │   │   ├── MultiProjectCalendar.tsx
│   │   │   │   ├── CalendarFilters.tsx
│   │   │   │   ├── WorkloadIndicator.tsx
│   │   │   │   └── RescheduleModal.tsx
│   │   │   ├── analytics/           # Módulo 4: Analytics
│   │   │   │   ├── ProductivityDashboard.tsx
│   │   │   │   ├── VelocityChart.tsx
│   │   │   │   ├── ComplianceRate.tsx
│   │   │   │   ├── InsightsPanel.tsx
│   │   │   │   └── TeamComparison.tsx
│   │   │   ├── templates/           # Módulo 5: Plantillas
│   │   │   │   ├── TemplateLibrary.tsx
│   │   │   │   ├── TemplateEditor.tsx
│   │   │   │   ├── MilestoneBuilder.tsx
│   │   │   │   └── TemplatePreview.tsx
│   │   │   ├── reports/             # Módulo 6: Reportes
│   │   │   │   ├── ReportBuilder.tsx
│   │   │   │   ├── ReportPreview.tsx
│   │   │   │   ├── ReportScheduler.tsx
│   │   │   │   └── StakeholderConfig.tsx
│   │   │   └── notifications/
│   │   │       ├── NotificationBell.tsx
│   │   │       ├── NotificationList.tsx
│   │   │       └── NotificationItem.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── Deliveries.tsx
│   │   │   ├── Checkins.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Templates.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Login.tsx
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useDeliveries.ts
│   │   │   ├── useCheckins.ts
│   │   │   ├── useCalendar.ts
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useAuth.ts
│   │   ├── stores/
│   │   │   ├── deliveryStore.ts
│   │   │   ├── checkinStore.ts
│   │   │   ├── calendarStore.ts
│   │   │   ├── notificationStore.ts
│   │   │   └── authStore.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── delivery.routes.ts
│   │   │   ├── checkin.routes.ts
│   │   │   ├── calendar.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   ├── template.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   └── notification.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── delivery.controller.ts
│   │   │   ├── checkin.controller.ts
│   │   │   ├── calendar.controller.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── template.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   └── notification.controller.ts
│   │   ├── services/
│   │   │   ├── delivery.service.ts
│   │   │   ├── checkin.service.ts
│   │   │   ├── calendar.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── template.service.ts
│   │   │   ├── report.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── telegram.service.ts
│   │   │   ├── deadline.service.ts
│   │   │   ├── workload.service.ts
│   │   │   └── pdf.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── socket/
│   │   │   ├── index.ts
│   │   │   └── handlers.ts
│   │   ├── jobs/
│   │   │   ├── deadlineChecker.ts
│   │   │   ├── checkinReminder.ts
│   │   │   └── reportGenerator.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── validators/
│   │   │   ├── delivery.validator.ts
│   │   │   ├── checkin.validator.ts
│   │   │   ├── project.validator.ts
│   │   │   └── template.validator.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   └── app.ts
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example
├── docker-compose.yml
├── ARCHITECTURE.md
├── README.md
└── package.json
```

---

## Modelo de Datos (PostgreSQL + Prisma)

### Diagrama de Entidades

```
┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│    User      │     │   Project     │     │    Delivery      │
├──────────────┤     ├───────────────┤     ├──────────────────┤
│ id           │──┐  │ id            │──┐  │ id               │
│ name         │  │  │ name          │  │  │ title            │
│ email        │  │  │ description   │  │  │ description      │
│ phone        │  │  │ status        │  │  │ status           │
│ role         │  │  │ startDate     │  │  │ priority         │
│ password     │  │  │ endDate       │  └──│ projectId        │
│ telegramChatId│  │  │ managerId ────│──┘  │ assigneeId       │
│ avatarUrl    │  │  │ templateId    │     │ milestoneId      │
│ isActive     │  │  │ createdAt     │     │ dueDate          │
│ createdAt    │  │  └───────────────┘     │ completedAt      │
└──────────────┘  │                         │ progress (0-100) │
       │          │                         │ type             │
       │          │                         │ createdAt        │
       │          │                         │ updatedAt        │
       │          │                         └──────────────────┘
       │          │
       │          │  ┌──────────────────┐   ┌──────────────────┐
       │          │  │  Notification    │   │  DeliveryLog     │
       │          │  ├──────────────────┤   ├──────────────────┤
       │          └──│ userId           │   │ id               │
       │             │ id               │   │ deliveryId       │
       │             │ type             │   │ previousStatus   │
       │             │ title            │   │ newStatus        │
       │             │ message          │   │ changedById      │
       │             │ channel          │   │ note             │
       │             │ read             │   │ createdAt        │
       │             │ deliveryId       │   └──────────────────┘
       │             │ createdAt        │
       │             └──────────────────┘
       │
       │  ┌──────────────────┐   ┌──────────────────┐
       │  │   Checkin        │   │  CheckinBlocker  │
       │  ├──────────────────┤   ├──────────────────┤
       └──│ userId           │   │ id               │
          │ id               │──│ checkinId        │
          │ date             │   │ description      │
          │ accomplished     │   │ isResolved       │
          │ planned          │   │ resolvedAt       │
          │ mood (1-5)       │   │ projectId        │
          │ projectId        │   └──────────────────┘
          │ createdAt        │
          └──────────────────┘

┌────────────────────┐   ┌──────────────────┐   ┌──────────────────────┐
│ ProjectTemplate    │   │ TemplateMilestone│   │ ReportConfig         │
├────────────────────┤   ├──────────────────┤   ├──────────────────────┤
│ id                 │──│ id               │   │ id                   │
│ name               │   │ templateId       │   │ name                 │
│ description        │   │ name             │   │ frequency            │
│ category           │   │ description      │   │ (weekly/monthly)     │
│ isPublic           │   │ relativeDueDay   │   │ recipients (json)    │
│ createdById        │   │ deliveries (json)│   │ sections (json)      │
│ milestones[]       │   │ order            │   │ projectIds (json)    │
│ usageCount         │   └──────────────────┘   │ lastGeneratedAt      │
│ createdAt          │                           │ createdById          │
└────────────────────┘                           │ createdAt            │
                                                 └──────────────────────┘

┌──────────────────┐
│   Milestone      │
├──────────────────┤
│ id               │
│ name             │
│ description      │
│ projectId        │
│ dueDate          │
│ status           │
│ order            │
│ createdAt        │
└──────────────────┘
```

### Enums

**DeliveryStatus:**
| Estado | Color | Descripción |
|--------|-------|-------------|
| `PENDING` | Gris | Aún no iniciada |
| `IN_PROGRESS` | Azul | En desarrollo activo |
| `IN_REVIEW` | Amarillo | En revisión/QA |
| `COMPLETED` | Verde | Entregada y aprobada |
| `DELAYED` | Rojo | Pasó la fecha límite |
| `BLOCKED` | Naranja | Bloqueada por dependencia |

**UserRole:**
| Rol | Permisos |
|-----|----------|
| `ADMIN` | CRUD total, gestión de usuarios, configuración global |
| `MANAGER` | CRUD proyectos/entregas, dashboard completo, reportes |
| `MEMBER` | Ver sus entregas, actualizar estado, completar check-ins |

**DeliveryType:**
`FEATURE` | `BUG_FIX` | `DOCUMENTATION` | `DESIGN` | `RESEARCH` | `OTHER`

**Priority:**
`LOW` | `MEDIUM` | `HIGH` | `CRITICAL`

---

## Módulo 1: Panel de Entregas en Tiempo Real

### Flujo de Datos

```
Cliente actualiza estado ──► POST /api/deliveries/:id/status
                                    │
                                    ▼
                              Guardar en DB + DeliveryLog
                                    │
                                    ├──► Socket.io broadcast ──► Todos los clientes
                                    │         actualizan dashboard en tiempo real
                                    │
                                    ├──► Evaluar notificaciones
                                    │     ├──► In-app (Socket.io → NotificationBell)
                                    │     └──► Telegram (Bot API → Manager)
                                    │
                                    └──► Recalcular métricas de proyecto
```

### Dashboard Principal

```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo │ Búsqueda │ 🔔 Notificaciones │ Avatar      │
├─────────┬────────────────────────────────────────────────────┤
│         │  KPIs:  [Total] [En curso] [Retrasadas] [Done]    │
│         ├────────────────────────────────────────────────────┤
│ Sidebar │                                                    │
│         │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ - Panel │  │Proyecto 1│ │Proyecto 2│ │Proyecto 3│  ...      │
│ - Check │  │ ████░░░  │ │ ████████ │ │ ██░░░░░  │          │
│ - Calen │  │  60%     │ │ 100% ✓   │ │  25% ⚠   │          │
│ - Analy │  └──────────┘ └──────────┘ └──────────┘          │
│ - Templ │                                                    │
│ - Repor ├────────────────────────────────────────────────────┤
│ - Conf  │  Timeline / Gantt                                  │
│         │  ═══█████════                                      │
│         │  ════════█████████═══                               │
│         │  ══█████████═══                                    │
│         ├──────────────────────┬─────────────────────────────┤
│         │ Entregas Recientes   │  Cuellos de Botella         │
│         │ ● Entrega X - done   │  ⚠ Proyecto A: 3 delayed   │
│         │ ● Entrega Y - in_rev │  ⚠ Proyecto C: blocked 48h │
│         │ ● Entrega Z - delay  │  ⚠ Juan: 6 tareas activas  │
└─────────┴──────────────────────┴─────────────────────────────┘
```

### Detección de Cuellos de Botella (automática)

| Regla | Condición | Alerta |
|-------|-----------|--------|
| Entregas retrasadas | >30% del proyecto en `DELAYED` | Telegram + In-app al Manager |
| Bloqueos prolongados | `BLOCKED` por más de 48h | Telegram + In-app |
| Progreso estancado | Sin actualización en 72h | In-app |
| Sobrecarga de miembro | >5 entregas activas simultáneas | In-app al Manager |

---

## Módulo 2: Check-ins Diarios Automatizados

### Formulario de Check-in (<2 minutos)

```
┌─────────────────────────────────────────┐
│         Check-in Diario - 22/02/2026    │
├─────────────────────────────────────────┤
│                                         │
│  Proyecto: [Seleccionar ▼]              │
│                                         │
│  ✅ ¿Qué lograste ayer?                │
│  ┌─────────────────────────────────┐    │
│  │ Completé el módulo de login...  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  📋 ¿Qué planeas hacer hoy?            │
│  ┌─────────────────────────────────┐    │
│  │ Integrar API de pagos...        │    │
│  └─────────────────────────────────┘    │
│                                         │
│  🚧 ¿Algún obstáculo o bloqueo?        │
│  ┌─────────────────────────────────┐    │
│  │ Esperando credenciales de API   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  😊 Estado de ánimo:  😟 😐 🙂 😊 🚀  │
│                                         │
│           [ Enviar Check-in ]           │
└─────────────────────────────────────────┘
```

### Cron Jobs

| Job | Frecuencia | Acción |
|-----|-----------|--------|
| `checkinReminder` | Diario 9:00 AM | Telegram recordatorio a quienes no han hecho check-in |
| `blockerAnalysis` | Diario 6:00 PM | Analizar bloqueos recurrentes, notificar managers |

### Análisis Automático de Check-ins

- Detectar **bloqueos recurrentes** (mismo obstáculo >3 días)
- Alertar al manager cuando un miembro reporta mood bajo (1-2) por >2 días consecutivos
- Generar resumen diario del equipo para managers

---

## Módulo 3: Calendario Multi-proyecto Inteligente

### Vista de Calendario

```
┌──────────────────────────────────────────────────────────┐
│ Filtros: [Todos ▼] [Prioridad ▼] [Tipo ▼] [Equipo ▼]  │
├──────────────────────────────────────────────────────────┤
│              Febrero 2026                                │
│  Lun    Mar    Mié    Jue    Vie    Sáb    Dom          │
│ ─────────────────────────────────────────────            │
│  16     17     18     19     20     21     22            │
│ ┌────┐ ┌────┐                ┌────┐                     │
│ │P1:A│ │P2:B│        ⚠      │P1:C│                     │
│ │────│ │────│  SOBRECARGA    │────│                     │
│ └────┘ └────┘   3 entregas   └────┘                     │
│                  en 1 día                                │
│  23     24     25     26     27     28                   │
│ ┌────────────────┐   ┌────────────┐                     │
│ │ P3: Milestone  │   │  P1: Demo  │  ← drag & drop     │
│ └────────────────┘   └────────────┘                     │
├──────────────────────────────────────────────────────────┤
│ Carga del equipo:  ████████░░ 80%  ⚠ Redistribuir?     │
│ [Ver sugerencia de redistribución]                       │
└──────────────────────────────────────────────────────────┘
```

### Algoritmo de Redistribución

Cuando detecta sobrecarga (>3 entregas/día para un miembro o >80% capacidad del equipo):
1. Identificar entregas con margen de fechas flexible
2. Calcular disponibilidad de cada miembro
3. Sugerir redistribución manteniendo prioridades y dependencias
4. Presentar sugerencia al manager para aprobar/rechazar

---

## Módulo 4: Analytics de Productividad

### Métricas Clave

| Métrica | Cálculo | Visualización |
|---------|---------|---------------|
| **Velocidad de entrega** | Entregas completadas / semana | Line chart (tendencia) |
| **Tasa de cumplimiento** | Entregas a tiempo / total × 100 | Gauge chart |
| **Tiempo promedio por tipo** | Avg(completedAt - createdAt) por tipo | Bar chart |
| **Índice de bloqueo** | Horas en BLOCKED / horas totales | KPI card |
| **Mood del equipo** | Promedio de mood de check-ins | Trend line |
| **Tasa de check-in** | Check-ins completados / esperados | Percentage |

### Insights Automáticos

El sistema genera insights basados en patrones:

```
┌─────────────────────────────────────────────────────────┐
│ 💡 Insights de la Semana                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📈 La velocidad de entrega aumentó 15% esta semana     │
│    respecto al promedio del último mes.                 │
│                                                         │
│ ⚠️ Las tareas de tipo DESIGN tardan 2.3x más que el    │
│    promedio. Considerar asignar más recursos.           │
│                                                         │
│ 🔴 El equipo Backend tiene 40% de entregas retrasadas. │
│    Principal causa: bloqueos por dependencias externas. │
│                                                         │
│ 😊 El mood del equipo subió de 3.2 a 4.1 esta semana. │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Módulo 5: Plantillas de Proyectos

### Estructura de Template

```json
{
  "name": "Lanzamiento de Feature",
  "category": "development",
  "milestones": [
    {
      "name": "Discovery",
      "relativeDueDay": 7,
      "deliveries": [
        { "title": "Research de usuario", "type": "RESEARCH", "relativeDueDay": 3 },
        { "title": "Definición de requisitos", "type": "DOCUMENTATION", "relativeDueDay": 7 }
      ]
    },
    {
      "name": "Desarrollo",
      "relativeDueDay": 21,
      "deliveries": [
        { "title": "Diseño UI/UX", "type": "DESIGN", "relativeDueDay": 12 },
        { "title": "Implementación backend", "type": "FEATURE", "relativeDueDay": 18 },
        { "title": "Implementación frontend", "type": "FEATURE", "relativeDueDay": 21 }
      ]
    },
    {
      "name": "Lanzamiento",
      "relativeDueDay": 28,
      "deliveries": [
        { "title": "QA y testing", "type": "BUG_FIX", "relativeDueDay": 25 },
        { "title": "Deploy a producción", "type": "FEATURE", "relativeDueDay": 28 }
      ]
    }
  ]
}
```

### Categorías Predefinidas

- `development` — Proyectos de desarrollo de software
- `marketing` — Campañas y lanzamientos
- `operations` — Procesos operativos
- `custom` — Plantillas del equipo

---

## Módulo 6: Reportes Ejecutivos Automatizados

### Estructura del Reporte

```
┌─────────────────────────────────────────────┐
│        REPORTE SEMANAL / MENSUAL            │
│        Semana 22-28 Feb 2026                │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Resumen Ejecutivo                       │
│  • 23 entregas completadas (↑12%)           │
│  • 92% tasa de cumplimiento                 │
│  • 2 proyectos finalizados                  │
│                                             │
│  🏆 Logros Clave                            │
│  • Proyecto Alpha entregado antes de fecha  │
│  • Nuevo récord de velocidad del equipo     │
│                                             │
│  ⚠️ Riesgos Identificados                   │
│  • Proyecto Beta: 3 entregas retrasadas     │
│  • Equipo Mobile: 80% de capacidad          │
│                                             │
│  📈 Rendimiento vs Objetivos               │
│  • Entregas: 23/25 (92%) ████████░ │
│  • Deadlines: 21/23 (91%) ████████░ │
│  • Check-ins: 95%          █████████ │
│                                             │
│  📋 Próxima Semana                          │
│  • 15 entregas pendientes                   │
│  • 2 milestones por vencer                  │
│                                             │
└─────────────────────────────────────────────┘
```

### Configuración

| Campo | Opciones |
|-------|----------|
| **Frecuencia** | Semanal (lunes AM) / Mensual (1ro del mes) |
| **Formato** | PDF / vista web |
| **Destinatarios** | Lista de usuarios + Telegram |
| **Secciones** | Personalizable (on/off por sección) |
| **Proyectos** | Todos o selección específica |

### Cron Jobs

| Job | Frecuencia | Acción |
|-----|-----------|--------|
| `weeklyReport` | Lunes 8:00 AM | Generar y enviar reporte semanal |
| `monthlyReport` | Día 1, 8:00 AM | Generar y enviar reporte mensual |

---

## Sistema de Notificaciones

### Canales

| Canal | Tecnología | Uso |
|-------|-----------|-----|
| **In-app** | Socket.io (tiempo real) | Todas las notificaciones |
| **Telegram** | Telegram Bot API (node-telegram-bot-api) | Alertas críticas y recordatorios |

### Triggers

| Evento | In-app | Telegram |
|--------|--------|----------|
| Entrega cambia de estado | ✅ | — |
| Entrega marcada `DELAYED` | ✅ | ✅ Manager |
| Entrega marcada `BLOCKED` | ✅ | ✅ Manager |
| Entrega `COMPLETED` | ✅ | — |
| Faltan 24h para deadline | ✅ | ✅ Assignee + Manager |
| Faltan 48h para deadline | ✅ | — |
| Recordatorio check-in diario | ✅ | ✅ Miembro |
| Bloqueo recurrente detectado | ✅ | ✅ Manager |
| Reporte semanal/mensual listo | ✅ | ✅ Stakeholders |
| Sobrecarga detectada en calendario | ✅ | ✅ Manager |

---

## API Endpoints

### Auth
```
POST   /api/auth/login              Login
POST   /api/auth/refresh            Refresh token
POST   /api/auth/logout             Logout
```

### Users
```
GET    /api/users                   Listar usuarios
POST   /api/users                   Crear usuario (ADMIN)
PUT    /api/users/:id               Actualizar usuario
GET    /api/users/:id/workload      Carga de trabajo del usuario
```

### Projects
```
GET    /api/projects                Listar (filtros: status, manager)
GET    /api/projects/:id            Detalle con entregas y milestones
POST   /api/projects                Crear proyecto
POST   /api/projects/from-template  Crear desde plantilla
PUT    /api/projects/:id            Actualizar
DELETE /api/projects/:id            Eliminar
```

### Deliveries
```
GET    /api/deliveries              Listar (filtros: status, project, assignee, type)
GET    /api/deliveries/:id          Detalle con historial
POST   /api/deliveries              Crear
PUT    /api/deliveries/:id          Actualizar
PATCH  /api/deliveries/:id/status   Cambiar estado (trigger notificaciones)
GET    /api/deliveries/stats        Estadísticas para dashboard
```

### Check-ins
```
GET    /api/checkins                Listar (filtros: user, project, date range)
POST   /api/checkins                Crear check-in diario
GET    /api/checkins/summary        Resumen del equipo (día/semana)
GET    /api/checkins/blockers       Bloqueos activos
PATCH  /api/checkins/blockers/:id   Resolver bloqueo
```

### Calendar
```
GET    /api/calendar                Eventos (filtros: projects, team, date range)
PATCH  /api/calendar/reschedule     Reprogramar entrega (drag & drop)
GET    /api/calendar/workload       Análisis de carga por período
GET    /api/calendar/suggestions    Sugerencias de redistribución
```

### Analytics
```
GET    /api/analytics/velocity      Velocidad de entrega
GET    /api/analytics/compliance    Tasa de cumplimiento
GET    /api/analytics/avg-time      Tiempo promedio por tipo
GET    /api/analytics/insights      Insights automáticos
GET    /api/analytics/team          Comparación del equipo
GET    /api/analytics/trends        Tendencias históricas
```

### Templates
```
GET    /api/templates               Listar (filtros: category, public)
GET    /api/templates/:id           Detalle con milestones
POST   /api/templates               Crear plantilla
PUT    /api/templates/:id           Actualizar
DELETE /api/templates/:id           Eliminar
POST   /api/templates/:id/clone     Clonar plantilla
```

### Reports
```
GET    /api/reports                  Listar configuraciones
POST   /api/reports                  Crear configuración de reporte
PUT    /api/reports/:id              Actualizar configuración
POST   /api/reports/:id/generate     Generar reporte manualmente
GET    /api/reports/:id/preview      Preview del reporte
GET    /api/reports/:id/download     Descargar PDF
```

### Notifications
```
GET    /api/notifications            Listar del usuario
PATCH  /api/notifications/:id/read   Marcar como leída
PATCH  /api/notifications/read-all   Marcar todas como leídas
GET    /api/notifications/unread     Contar no leídas
```

---

## WebSocket Events

### Server → Client
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `delivery:updated` | Delivery | Entrega actualizada |
| `delivery:created` | Delivery | Nueva entrega |
| `delivery:statusChanged` | {delivery, oldStatus, newStatus} | Cambio de estado |
| `notification:new` | Notification | Nueva notificación |
| `project:updated` | Project | Proyecto actualizado |
| `checkin:new` | Checkin | Nuevo check-in del equipo |
| `calendar:changed` | {deliveryId, newDate} | Entrega reprogramada |

### Client → Server
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `join:project` | projectId | Unirse a room de proyecto |
| `leave:project` | projectId | Salir de room |
| `join:dashboard` | — | Unirse a room general |

---

## Variables de Entorno

```env
# Server
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/gestion_revolut
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather

# Client (VITE_)
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

## Docker Compose

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gestion_revolut
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  server:
    build: ./server
    ports:
      - "3001:3001"
    depends_on:
      - db
    env_file: .env

  client:
    build: ./client
    ports:
      - "5173:5173"
    depends_on:
      - server

volumes:
  pgdata:
```

---

## Orden de Implementación Recomendado

| Fase | Módulos | Duración Estimada |
|------|---------|-------------------|
| **Fase 1** | Auth + Modelo de datos + API base de Projects/Deliveries | Core |
| **Fase 2** | Panel de Entregas (Módulo 1) + WebSockets + Notificaciones In-app | Core |
| **Fase 3** | Check-ins Diarios (Módulo 2) + Telegram Integration | Extensión |
| **Fase 4** | Calendario Multi-proyecto (Módulo 3) | Extensión |
| **Fase 5** | Analytics (Módulo 4) | Extensión |
| **Fase 6** | Plantillas (Módulo 5) + Reportes (Módulo 6) | Extensión |
