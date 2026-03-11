# Urban Matrix — Civil Engineering BBS Calculator

**IS 456:2000 | IS 2502:1963 | West Bengal Steel Rates**

A professional, dynamic, and highly scalable React application for Civil Engineers to calculate Bar Bending Schedules (BBS) and material cost estimations.

![App Dashboard & Calculator](https://via.placeholder.com/800x400?text=BBS+Calculator+Dashboard)

## 🌟 Core Features

- **9 Supported Structural Elements**: Calculate BBS for Footings, Columns, Plinth Beams, Wall Beams, Slabs, Staircases, Lintels/Chajjas, Rafts, and Pile Caps.
- **Project Management**: Create projects, add metadata (Client, Location, Engineer details), and save reports automatically to a local **Dashboard History**.
- **Live Blueprint Drawings**: Interactive 2D SVG blueprints (Plan & Section views) that update based on your inputted dimensions.
- **IS Code Auto-Compliance**: Automatically applies standard covers (e.g., Footing: 75mm, Beam: 40mm) and calculates lap splices (Tension/Compression zones) as per IS 456.
- **Dynamic Cost Estimation**: Integrated West Bengal market rates for 12m standard steel rods. Edit rates inline to instantly update the project cost.
- **Export & Share**:
  - 📄 **PDF Generation**: Download professional, client-ready BBS reports with project metadata.
  - 📊 **Excel Export**: Export raw BBS calculation rows to `.xlsx` for further processing.
  - 💬 **WhatsApp Integration**: Quickly share cost summaries and material requirements directly via WhatsApp.

---

## 🏗️ Technical Architecture

This project is built using **React** and **Vite**, featuring a highly scalable, strictly typed component architecture and a modular CSS system.

### The "Micro-Component" CSS System

To guarantee zero styling interference, the application uses a strict CSS separation protocol:

- **`src/styles/pages/`**: Layout rules scoped strictly to their wrapper classes (e.g., `.result-page`, `.dashboard-page`).
- **`src/styles/components/`**: Module-specific styles.
  - **`/ui/`**: Generic primitives (`Button.css`, `Badge.css`, `Card.css`).
  - **`/forms/`**: Input layers (`Inputs.css`, `ToggleSwitch.css`).
  - **`/drawings/`**: Visualizations (`BlueprintControls.css`, `LapSpliceDiagram.css`).

### File Structure Overview

```text
bbs-calculator/
├── src/
│   ├── components/            # Reusable UI Blocks
│   │   ├── forms/             # Specific entry forms (ColumnForm, BeamForm)
│   │   ├── drawings/          # SVG Blueprint rendering logic
│   │   ├── ReportsHistory.jsx # Dashboard & local storage management
│   │   ├── ProjectDetails.jsx # Metadata entry form
│   │   └── ItemManager.jsx    # Add/remove multiple instances of elements
│   ├── pages/                 # Main Views
│   │   ├── CalculatorPage.jsx # The active workspace
│   │   └── ResultPage.jsx     # The finalized BBS tables and cost summaries
│   ├── styles/                # Modular CSS Architecture
│   │   ├── components/        # Micro-component CSS
│   │   ├── pages/             # Page-scoped CSS
│   │   └── index.css          # Main entry (imports all modules)
│   ├── utils/                 # Business Logic & Math
│   │   ├── calculations.js    # Pure IS code math for lengths and weights
│   │   ├── pdfReport.js       # AutoTable PDF layout generation
│   │   └── excelExport.js     # SheetJS export logic
│   ├── App.jsx                # Global State & Routing
│   └── main.jsx               # React DOM Entry
```

---

## 🚀 Local Development

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone & Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Development Server**

   ```bash
   npm run dev
   ```

   _The app will be running at `http://localhost:5173`_

3. **Build for Production**
   ```bash
   npm run build
   ```
   _This outputs optimized static files to the `dist/` directory._

---

## 📚 IS Code References Used

The math engine (`utils/calculations.js`) heavily relies on standard Indian Civil Engineering codes:

| Parameter         | Reference          | Value             |
| ----------------- | ------------------ | ----------------- |
| Footing cover     | IS 456 Cl.26.4.2.2 | 75mm              |
| Beam/Column cover | IS 456 Cl.26.4.2.1 | 40mm              |
| Wall beam cover   | IS 456 Cl.26.4.2.1 | 25mm              |
| Slab cover        | IS 456 Cl.26.4.2.1 | 20mm              |
| Tension lap       | IS 456 Cl.26.2.1   | 40d               |
| Hook length       | IS 2502            | 9d                |
| Tie spacing       | IS 456 Cl.26.5.3.2 | ≤ least dimension |

> **Disclaimer:** This software provides highly accurate mathematical estimates based on standard parameters. However, always verify cutting lengths and quantities against approved structural drawings before finalizing steel procurement.
