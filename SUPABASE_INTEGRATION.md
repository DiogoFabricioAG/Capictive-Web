# 📚 Integración de Supabase en Capictive

Este documento explica dónde están guardadas todas las funciones de Supabase y cómo funciona el sistema de base de datos.

## 🗂️ Estructura de Archivos

### **Clientes de Supabase**

#### `lib/supabase/client.ts`
Cliente de Supabase para **componentes del lado del cliente**.
- Exporta: `createClient()` y `getSupabaseBrowserClient()`
- Uso: Componentes con `"use client"`
- Ejemplo: Formularios, interacciones del usuario

#### `lib/supabase/server.ts`
Cliente de Supabase para **componentes del servidor y API routes**.
- Exporta: `createClient()` y `getSupabaseServerClient()`
- Uso: Server Components, API Routes, Server Actions
- Acceso a cookies para autenticación

### **Funciones de Consulta**

#### `lib/supabase/queries.ts`
Todas las funciones de consulta a la base de datos. **Solo para uso en servidor**.

**Funciones disponibles:**

##### Videos
- `getVideos()` - Obtiene todos los videos ordenados por fecha

##### Podcasts
- `getPodcasts()` - Obtiene todos los podcasts ordenados por fecha

##### Newsletters
- `getNewsletters()` - Obtiene todos los newsletters
- `getNewsletterBySlug(slug)` - Obtiene un newsletter específico con findings y stats

##### Iniciativas Gubernamentales
- `getGovernmentInitiatives()` - Obtiene todas las iniciativas con sus conexiones

##### Fuentes de Información
- `getInformationSources()` - Obtiene todas las fuentes verificadas

##### Chat (⭐ NUEVO)
- `getChatConversations(userId)` - Obtiene conversaciones del usuario
- `getChatMessages(conversationId)` - Obtiene mensajes de una conversación
- `createChatConversation(userId, title)` - Crea nueva conversación
- `saveChatMessage(conversationId, role, content)` - Guarda un mensaje

##### Contribuciones
- `submitContribution(userId, contribution)` - Envía una contribución de usuario

##### Suscripciones
- `subscribeToNewsletter(email, userId?)` - Suscribe al newsletter

---

## 🤖 Sistema de Chat con Cloudflare Worker

### **Arquitectura del Chat**

\`\`\`
Usuario → ChatInterface → API Route → Cloudflare Worker → Supabase
                                    ↓
                              Guarda mensajes
\`\`\`

### **Archivos del Sistema de Chat**

#### `lib/capictive-bot.ts`
Utilidades para interactuar con el bot de Cloudflare Worker.

**Funciones:**
- `queryCapictiveBot(query)` - Envía query al Worker y obtiene respuesta
- `formatMarkdownResponse(markdown)` - Convierte markdown a HTML usando `marked`

**Worker URL:** `https://capictive-brain.diogofabricio17.workers.dev`

**Request:**
\`\`\`json
{
  "query": "tu pregunta aquí"
}
\`\`\`

**Response:**
\`\`\`json
{
  "response": "**respuesta** en markdown con formato"
}
\`\`\`

#### `app/api/chat/send/route.ts`
API Route que maneja el envío de mensajes.

**Flujo:**
1. Recibe mensaje del usuario
2. Crea conversación si no existe
3. Guarda mensaje del usuario en Supabase
4. Llama al Worker de Cloudflare
5. Guarda respuesta del bot en Supabase
6. Actualiza timestamp de conversación
7. Retorna respuesta al cliente

**Endpoint:** `POST /api/chat/send`

**Body:**
\`\`\`json
{
  "message": "texto del mensaje",
  "conversationId": "uuid o null",
  "userId": "uuid del usuario"
}
\`\`\`

**Response:**
\`\`\`json
{
  "response": "respuesta del bot en markdown",
  "conversationId": "uuid de la conversación"
}
\`\`\`

#### `components/chat-interface.tsx`
Componente de interfaz de chat del lado del cliente.

**Características:**
- ✅ Estado de carga con "Capictive está pensando..."
- ✅ Renderizado de markdown en respuestas del bot
- ✅ Guardado automático de mensajes en Supabase
- ✅ Creación automática de conversaciones
- ✅ Scroll automático a nuevos mensajes
- ✅ Manejo de errores con mensajes amigables

---

## 🗄️ Tablas de Supabase Utilizadas

### **chat_conversations**
\`\`\`sql
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- title (text)
- created_at (timestamp)
- updated_at (timestamp)
\`\`\`

### **chat_messages**
\`\`\`sql
- id (uuid, PK)
- conversation_id (uuid, FK → chat_conversations)
- role (enum: 'user', 'assistant')
- content (text)
- created_at (timestamp)
\`\`\`

### **Otras tablas:**
- `videos` - Videos de análisis político
- `podcasts` - Episodios de podcast
- `newsletters` - Informes de investigación
- `newsletter_findings` - Hallazgos de cada reporte
- `newsletter_stats` - Estadísticas de reportes
- `government_initiatives` - Iniciativas gubernamentales
- `initiative_connections` - Relaciones entre iniciativas
- `initiative_updates` - Actualizaciones de iniciativas
- `information_sources` - Fuentes verificadas
- `user_contributions` - Contribuciones de usuarios
- `user_subscriptions` - Suscripciones al newsletter
- `user_preferences` - Preferencias de usuario

---

## 🔐 Seguridad (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado:

- **chat_conversations & chat_messages**: Solo el propietario puede ver/editar
- **user_contributions**: Solo el propietario puede ver sus contribuciones
- **user_subscriptions**: Solo el propietario puede ver su suscripción
- **Contenido público**: Lectura pública, escritura solo admin

---

## 📝 API Routes Disponibles

### Chat
- `POST /api/chat/send` - Envía mensaje y obtiene respuesta del bot

### Newsletter
- `POST /api/newsletter/subscribe` - Suscribe al newsletter

### Contribuciones
- `POST /api/contributions/submit` - Envía contribución de usuario

### Auth
- `GET /auth/callback` - Callback de OAuth
- `POST /auth/signout` - Cierra sesión

---

## 🚀 Cómo Usar las Funciones

### En Server Components:
\`\`\`tsx
import { getVideos } from "@/lib/supabase/queries"

export default async function VideosPage() {
  const videos = await getVideos()
  return <div>{/* render videos */}</div>
}
\`\`\`

### En Client Components (usar API Routes):
\`\`\`tsx
"use client"

async function handleSubmit() {
  const response = await fetch("/api/chat/send", {
    method: "POST",
    body: JSON.stringify({ message, userId, conversationId })
  })
  const data = await response.json()
}
\`\`\`

### Acceso Directo al Cliente (solo lectura):
\`\`\`tsx
"use client"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()
const { data } = await supabase.from("videos").select("*")
\`\`\`

---

## 📦 Dependencias Necesarias

\`\`\`json
{
  "@supabase/ssr": "latest",
  "@supabase/supabase-js": "latest",
  "marked": "16.4.1"
}
\`\`\`

---

## 🔧 Variables de Entorno

Las siguientes variables están configuradas automáticamente por la integración de Supabase:

- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ Checklist de Integración

- [x] Clientes de Supabase (client.ts, server.ts)
- [x] Funciones de consulta (queries.ts)
- [x] Integración con Cloudflare Worker
- [x] Sistema de chat con guardado en BD
- [x] Renderizado de markdown
- [x] Estado de carga
- [x] Manejo de errores
- [x] API Routes para operaciones del cliente
- [x] RLS policies configuradas
- [x] Scripts SQL de inicialización

---

## 📍 Ubicación de Archivos Clave

\`\`\`
lib/
├── supabase/
│   ├── client.ts          ← Cliente browser
│   ├── server.ts          ← Cliente servidor
│   └── queries.ts         ← Todas las consultas
├── capictive-bot.ts       ← Integración Worker

app/api/
├── chat/
│   └── send/route.ts      ← Envío de mensajes
├── newsletter/
│   └── subscribe/route.ts ← Suscripción
└── contributions/
    └── submit/route.ts    ← Contribuciones

components/
└── chat-interface.tsx     ← UI del chat

scripts/
├── 01-create-tables.sql   ← Creación de tablas
├── 02-setup-rls-policies.sql ← Políticas de seguridad
└── 03-seed-initial-data.sql  ← Datos iniciales
\`\`\`

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
