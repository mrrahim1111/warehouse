# WareMind AI — Next-Generation Intelligent Warehouse Management System

Welcome to **WareMind AI**, a state-of-the-art Warehouse Management System (WMS) built to orchestrate, track, and optimize modern warehouse operations through real-time data, AI-driven insights, and immersive visualizations.

## 🚀 Tech Stack

* **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (with arbitrary values and complex grid/flex layouts for a premium glassmorphic UI)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Context API (`WarehouseContext`)

---

## 🎯 Key Features & Modules

### 1. 📊 Executive Dashboard (`DashboardView`)
A comprehensive birds-eye view of warehouse operations. Includes real-time KPI metrics, active order fulfillment rates, daily revenue, active alerts, AI optimization suggestions, and visual charts (simulated) of workload distribution.

### 2. 🧠 AI Decision Center & Assistant (`AIDecisionCenterView`, `AIAssistantView`)
Integrates an intelligent AI engine (`aiEngine.ts`) that analyzes warehouse anomalies.
* **Proactive Recommendations:** Reallocating staff to congested zones, dynamic rerouting of pickers, or alerting about low inventory.
* **Conversational Agent:** Chat interface to ask questions about inventory levels, order statuses, or employee productivity.

### 3. 🗺️ Live Navigation & GPS Tracker (`LiveNavigationTracker`)
* **Indoor Picker GPS:** Visualizes a 2D map of the warehouse floorplan. Tracks employees as they navigate aisles, complete waypoints, and follow AI-optimized routes to minimize walking distance.
* **Carrier Transit Tracker:** Real-time GPS telemetry for dispatch shipments on the road. Displays speed, ETA, driver details, and current location.

### 4. 📦 Inventory Management (`InventoryView`)
Detailed SKU tracking. Includes search, filter, and sorting. Visualizes stock levels, zone assignments (e.g., Zone A, Cold Storage), unit costs, and reorder alerts.

### 5. 🛒 Order Fulfillment & Processing
* **Orders (`OrdersView`):** Track inbound and outbound customer orders. Priorities (e.g., Express, Standard) and fulfillment progress.
* **Picking (`PickingView`):** Manage batch, wave, and discrete picking tasks. Shows progress bars, assigned pickers, and remaining lines.
* **Packing (`PackingView`):** Packing station operations, box dimensioning, packaging material optimization, and shipping label generation.
* **Dispatch (`DispatchView`):** Loading dock scheduling, carrier assignments, and shipment staging.

### 6. ✅ Quality Control (QC) & Exceptions
* **QC (`QCView`):** Inspection workflows to ensure 100% order accuracy before dispatch. Tracks pass/fail rates.
* **Exceptions (`ExceptionsView`):** Resolution center for damaged goods, missing items, or delays.

### 7. 👥 Employees & Shifts (`EmployeesView`)
Manage warehouse staff, track active shifts, monitor productivity scores (items/hour), and handle role-based assignments (Picker, Packer, Forklift Operator, Supervisor).

### 8. 🚚 Suppliers (`SuppliersView`)
Manage vendor relationships, track inbound deliveries, measure reliability scores, and view lead times.

---

## 📂 Project Structure

```
warehouse2/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and global assets
│   ├── components/
│   │   ├── common/         # Reusable UI (Sidebar, Topbar, StatusBadge, LiveNavigationTracker)
│   │   └── views/          # Main application pages (Dashboard, Inventory, Orders, etc.)
│   ├── context/            # Global State Management (WarehouseContext)
│   ├── data/               # Mock data for rapid prototyping & simulation
│   ├── i18n/               # Internationalization & Translations
│   ├── services/           # External API & AI logic integrations
│   ├── types/              # Global TypeScript interfaces & enums
│   ├── App.tsx             # Main Application Entry Point & Routing wrapper
│   ├── index.css           # Global Tailwind directives & custom CSS variables
│   └── main.tsx            # React DOM rendering
├── package.json
├── tailwind.config.js      # (Implicit via standard Vite setup)
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Setup & Installation

**Prerequisites:** Node.js 18+ and `npm` (or `yarn`, `pnpm`).

1. **Clone the repository:**
   ```bash
   git clone git@github.com:mrrahim1111/warehouse.git
   cd warehouse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will typically start on `http://localhost:5173` or `http://localhost:5175`. Open this URL in your browser.*

4. **Build for Production:**
   ```bash
   npm run build
   ```
   *This compiles the application to the `dist/` folder.*

---

## 🧬 Data Flow & State Management

The application is heavily reliant on a centralized React Context (`WarehouseContext.tsx`). This context acts as the single source of truth for the entire frontend application. 

It manages:
* **Entities:** `inventory`, `orders`, `employees`, `shipments`, `exceptions`, `tasks`.
* **Real-time Simulation:** Functions to trigger simulated events (e.g., `resolveException`, `processOrder`) to showcase the UI's dynamic capabilities without needing a live backend database.

### The AI Engine (`src/services/aiEngine.ts`)
We simulate an intelligent backend. When events occur (like an order delay), the `aiEngine` is called to generate dynamic recommendations, ensuring the user experience feels alive and proactive.

---

## 🎨 Design System & Aesthetics

WareMind AI is designed to look like a premium, enterprise-grade software solution used in modern fulfillment centers (like Amazon or Shopify logistics).
* **Color Palette:** Deep slates (`slate-950`, `slate-900`) contrasted with vibrant accents (`cyan-500`, `emerald-500`, `indigo-500`) for high legibility in dark environments.
* **Micro-interactions:** Extensive use of Tailwind's `hover:`, `transition-all`, and `animate-pulse` for live telemetry elements to make the interface feel responsive and real-time.

---

## 🤝 Contributing

When contributing to this repository, please ensure that new components:
1. Are strictly typed using TypeScript interfaces from `src/types/warehouse.ts`.
2. Follow the glassmorphic, dark-mode design aesthetics.
3. Utilize Lucide React for consistent iconography.

---

*Built with precision for the future of supply chain logistics.*
