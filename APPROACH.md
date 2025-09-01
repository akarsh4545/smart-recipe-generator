**Approach (≤200 words)**

This solution is a client‑side React app (Vite) using Tailwind for a clean, mobile‑first UI. Ingredient recognition runs entirely in the browser via TensorFlow.js and a pre‑trained MobileNet model; top classification labels are mapped to pantry ingredients. Users can also add ingredients by text. Recipes are stored as a JSON dataset (22 items) including cuisine, difficulty, time, steps, substitutions, servings, and nutrition per serving.

The matching algorithm scores recipes by ingredient overlap and then applies filters for dietary tags (vegetarian/vegan/gluten‑free/dairy‑free), maximum cooking time, and difficulty. Serving size scaling multiplies leading numeric quantities in ingredient lines. Ratings and favorites persist in localStorage; “Suggestions” surfaces recipes aligned with cuisines the user rates highly.

Error handling covers model load failures and empty results; loading states and progressive UI patterns keep interactions responsive. The app builds to a static bundle deployable on Netlify or Vercel with zero server code. The codebase is small, readable, and production‑oriented with modular utilities and a clear README.