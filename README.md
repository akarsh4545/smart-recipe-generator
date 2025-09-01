
# Smart Recipe Generator

A client-side React (Vite) app that suggests recipes from your pantry. Includes image-based ingredient recognition (TensorFlow.js MobileNet), recipe matching, substitutions, dietary filters, serving size scaling, ratings & favorites (localStorage), and a mobile-first UI. Easily deploy to Netlify/Vercel.

## Tech
- React 18 + Vite
- Tailwind CSS
- TensorFlow.js + MobileNet (on-device, no API key)
- LocalStorage (favorites & ratings)

## Run locally
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy
- **Netlify**: drag-drop the `dist/` folder, or connect Git and set build command `npm run build` and publish directory `dist`.
- **Vercel**: import the repo, framework preset **Vite**, build command `npm run build`, output `dist`.

## Features checklist
- User input (text + image) ✅
- Dietary preferences (veg/vegan/gluten-free/dairy-free) ✅
- Multiple recipes with steps + nutrition ✅
- Filters (difficulty, time) ✅
- Serving size adjustment ✅
- Recipe DB ≥ 20 recipes ✅
- Ratings + favorites + personalized suggestions ✅
- Clean, responsive UI ✅
- Live deployment on free hosting ✅

## Notes
- Image recognition is heuristic: MobileNet labels are mapped to ingredient names; manual input is always available.
- All data stays in the browser; no backend required.

## 🚀 Live Demo
[Smart Recipe Generator](https://smart-recipe-generator11.netlify.app)
