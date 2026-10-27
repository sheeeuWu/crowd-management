# Crowd Management System

An enterprise-grade real-time crowd analytics and venue monitoring dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Socket.IO**.

Designed for public venues (malls, campuses, stadiums, offices) to monitor live crowd occupancy, footfall, average dwell time, demographic trends, and inspect visitor entry/exit records in real time.

---

## 🌟 Key Features

### 1. Authentication & Session Security

- Dedicated tenant/partner login screen matching modern SaaS split-hero layout.
- Masked password input with interactive visibility toggle.
- Form validation via **React Hook Form** + **Zod** with inline error alerts.
- Automatic **401 Unauthorized** token expiration handling: wipes invalid tokens from storage and redirects to `/login` without redirect loops.

### 2. Overview Dashboard

- **Occupancy Metrics Panel**:
  - **Live Occupancy** count with comparative trendline indicator.
  - **Today's Footfall** with negative delta comparison.
  - **Avg Dwell Time** (`XXmin YYsec`) formatted duration with comparative badge.
  - Clear visual separation between Occupancy & Dwell cards.
- **Overall Occupancy Time-Series Chart**:
  - Area chart rendered via **Recharts** with soft translucent teal wash.
  - X-axis hourly progression (`8:00` to `18:00`), Y-axis crowd counts, and light dotted grid.
  - Active **`LIVE`** badge marker anchored directly on the active timestamp.
- **Demographics Analytics**:
  - **Donut Chart**: Male vs. Female percentage breakdown with central `Total Crowd: 100%` label and gender figure glyphs.
  - **Demographics Analysis Chart**: Dual-area chart comparing Male and Female crowd distributions over time.
- **Interactive Date Filter**:
  - Filter analytics across **Today**, **Last 7 Days**, **This Month**, and **Custom Date Range** with zero-flicker cached transitions.

### 3. Crowd Entries (Visitor Logs)

- Paginated tabular record of visitors: Name & Avatar, Sex, Entry time, Exit time, and Dwell duration.
- Dwell time dynamically calculated with `--` for visitors currently inside the venue.
- Fast `< 1 2 3 ... 11 >` pagination controls powered by `placeholderData: keepPreviousData`.

### 4. Real-Time Socket.IO Synchronization

- Single WebSocket connection managed via `SocketContext` listening to:
  - **`live_occupancy`**: Live occupancy updates (`siteOccupancy` / `genderCount`) that shift the KPI cards and chart in real time without page refreshes.
  - **`alert`**: Zone movement alerts (`High`, `Medium`, `Low` severity) that increment the notification badge and populate the sliding **Alerts Drawer** with bold timestamps and color-coded badges.

### 5. Responsive Shell & Navigation

- **Desktop**: Collapsible sidebar with smooth transition (`w-60` to `w-20`) and floating hover tooltips.
- **Mobile (< 768px)**: Hidden off-screen drawer triggered by header hamburger with backdrop blur, closing automatically upon navigation.
- Venue switcher updating the active site context across the entire application.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **State & Data Fetching**: TanStack React Query v5
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form, Zod
- **Real-Time Gateway**: Socket.io-client

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### 1. Installation

```bash
git clone <repository-url>
cd crowd-management
npm install
```

### 2. Environment Configuration

Create a `.env.local` or `.env` file in the project root:

```env
# Backend API Gateway URL
NEXT_PUBLIC_API_URL=https://your-api-gateway.com

# Real-Time WebSocket Gateway URL
NEXT_PUBLIC_SOCKET_URL=http://your-socket-url
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Authentication

Use the assigned testing credentials provided in your assessment brief or login using:

| Username / Login ID | Password   | Role          |
| :------------------ | :--------- | :------------ |
| `demo@example.com`  | `••••••••` | Operator      |
| `admin@example.com` | `••••••••` | Administrator |

---

## 📡 Testing Real-Time Sockets Locally

To test real-time WebSocket events outside a live production network, run this local mock Socket.IO server in a separate terminal:

```bash
node -e "
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send live occupancy headcount every 5 seconds
  setInterval(() => {
    socket.emit('live_occupancy', {
      siteOccupancy: Math.floor(110 + Math.random() * 20),
      siteId: 'site-demo-01',
      genderCount: { male: 76, female: 44 },
      ts: Date.now()
    });
  }, 5000);

  // Send zone alert every 8 seconds
  setInterval(() => {
    socket.emit('alert', {
      id: 'alert_' + Date.now(),
      direction: 'entry',
      personName: 'Visitor Sample',
      zoneName: 'Main Entrance Zone',
      severity: 'high',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }, 8000);
});

httpServer.listen(4000, () => console.log('Mock Socket.IO running on :4000'));
"
```

---

## 🚢 Deployment (Vercel / Netlify / Render)

### Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com/).
3. In the **Environment Variables** settings, configure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`.
4. Click **Deploy**.
