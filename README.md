# BBS Calculator — Civil Engineering
**IS 456:2000 | IS 2502:1963 | West Bengal Steel Rates**

## Features
- ✅ Multiple footings, columns, plinth beams, wall beams, slabs
- ✅ Set quantity (Nos) per element type
- ✅ Complete BBS per element + combined aggregate BBS
- ✅ West Bengal current rates — editable anytime
- ✅ 12m rod purchase count per dia
- ✅ SVG Blueprint drawings with dimensions
- ✅ IS 456 covers auto-applied (Footing:75, Beam/Col:40, Slab:20mm)
- ✅ Professional light theme, IBM Plex font

## Project Structure
```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Main app, routing input ↔ results
├── index.css                 # Global styles + CSS variables
├── components/
│   ├── ui.jsx                # Reusable UI primitives (Button, Card, Field…)
│   ├── ItemManager.jsx       # Add/remove/edit multiple element instances
│   └── BBSResults.jsx        # BBS table, grouped table, cost table
└── utils/
    ├── calculations.js       # Pure IS-code calculation functions
    └── drawings.jsx          # SVG blueprint drawing components
```

## Local Development
```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build & Deploy (GitHub Pages)
```bash
# 1. Build
npm run build

# 2. Deploy to GitHub Pages
npm install -D gh-pages

# 3. Add to package.json scripts:
#    "deploy": "gh-pages -d dist"

# 4. Add to vite.config.js:
#    base: '/bbs-calculator/'   ← your repo name

npm run deploy
# → https://yourusername.github.io/bbs-calculator/
```

## Deploy to Netlify (Free, Instant)
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```

## IS Code References
| Parameter | Reference | Value |
|-----------|-----------|-------|
| Footing cover | IS 456 Cl.26.4.2.2 | 75mm |
| Beam/Column cover | IS 456 Cl.26.4.2.1 | 40mm |
| Wall beam cover | IS 456 Cl.26.4.2.1 | 25mm |
| Slab cover | IS 456 Cl.26.4.2.1 | 20mm |
| Tension lap | IS 456 Cl.26.2.1 | 40d |
| Hook length | IS 2502 | 9d |
| Tie spacing | IS 456 Cl.26.5.3.2 | ≤ least dim |

**Note:** Always verify with approved structural drawings before procurement.
