import React, { useEffect, useMemo, useRef, useState } from 'react'
import recipesData from '../data/recipes.json'
import { recognizeIngredientsFromImage } from '../lib/vision'
import { scoreRecipe, adjustServingIngredients } from '../lib/match'
import { toggleFavorite, setRating, getFavorites, getRatings } from '../lib/storage'
// English Navbar (Quick Fix)
<nav className="flex gap-6 p-4 bg-gray-100 shadow-md">
  <a href="/" className="text-blue-600 font-semibold">Home</a>
  <a href="/pantry" className="text-gray-700 hover:text-black">Pantry</a>
  <a href="/recipes" className="text-gray-700 hover:text-black">Recipes</a>
  <a href="/favorites" className="text-gray-700 hover:text-black">Favorites</a>
</nav>

const Tag = ({children}) => <span className="px-2 py-1 text-xs rounded-full bg-gray-200">{children}</span>

function Rating({recipeId, ratings, onRate}) {
  const r = ratings[recipeId] || 0
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} className={n<=r?'font-bold':''} onClick={()=>onRate(n)} aria-label={`rate ${n}`}>
          ★
        </button>
      ))}
      <span className="text-xs text-gray-500 ml-1">{r ? r.toFixed(1) : ''}</span>
    </div>
  )
}

function RecipeCard({recipe, favorites, ratings, onFav, onRate}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{recipe.name}</h3>
        <button onClick={onFav} title="Save">
          {favorites.includes(recipe.id) ? '💖' : '🤍'}
        </button>
      </div>
      <div className="flex gap-2 text-xs text-gray-600">
        <Tag>{recipe.cuisine}</Tag>
        <Tag>{recipe.difficulty}</Tag>
        <Tag>{recipe.time} min</Tag>
        {recipe.dietary.map(d => <Tag key={d}>{d}</Tag>)}
      </div>
      <div className="text-sm text-gray-700">
        <div className="font-semibold mt-2">Ingredients</div>
        <ul className="list-disc ml-5">{recipe.ingredients.slice(0,5).map((i,idx)=><li key={idx}>{i}</li>)}</ul>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Rating recipeId={recipe.id} ratings={ratings} onRate={onRate}/>
        <details>
          <summary className="cursor-pointer text-blue-600 text-sm">View details</summary>
          <div className="mt-2 text-sm">
            <div className="font-semibold">Steps</div>
            <ol className="list-decimal ml-5">{recipe.steps.map((s,idx)=><li key={idx}>{s}</li>)}</ol>
            <div className="font-semibold mt-2">Nutrition (per serving)</div>
            <div className="text-gray-700">Calories {recipe.nutrition.calories}, Protein {recipe.nutrition.protein_g}g, Carbs {recipe.nutrition.carbs_g}g, Fat {recipe.nutrition.fat_g}g</div>
            <div className="font-semibold mt-2">Substitutions</div>
            <ul className="list-disc ml-5">
              {Object.entries(recipe.substitutions).map(([k,v]) => <li key={k}><b>{k}:</b> {v.join(', ')}</li>)}
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}

export default function App(){
  const [pantry, setPantry] = useState([])
  const [textInput, setTextInput] = useState('')
  const [dietary, setDietary] = useState([]) // e.g., ['vegetarian','gluten-free']
  const [difficulty, setDifficulty] = useState('')
  const [maxTime, setMaxTime] = useState('')
  const [servings, setServings] = useState(2)
  const [favorites, setFavorites] = useState(getFavorites())
  const [ratings, setRatings] = useState(getRatings())
  const [loadingVision, setLoadingVision] = useState(false)
  const fileRef = useRef(null)
  const imgRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const dietaryOptions = ['vegetarian','vegan','gluten-free','dairy-free']

  const scored = useMemo(() => {
    // compute adjusted recipes by servings
    const factor = servings / 2
    const adjusted = recipesData.map(r => ({
      ...r,
      ingredients: adjustServingIngredients(r.ingredients, factor),
      servings
    }))
    const list = adjusted
      .map(r => ({recipe: r, s: scoreRecipe(r, pantry, dietary, maxTime?parseInt(maxTime):null, difficulty || null)}))
      .filter(x => x.s >= 0)
      .sort((a,b) => b.s - a.s || a.recipe.time - b.recipe.time)
      .slice(0, 20)
      .map(x => x.recipe)
    return list
  }, [pantry, dietary, maxTime, difficulty, servings])

  const suggestions = useMemo(() => {
    // Suggest top-rated favorites cuisines
    const ratingEntries = Object.entries(ratings)
    if (ratingEntries.length === 0) return []
    const avg = {}
    for (const [id, r] of ratingEntries) {
      const rec = recipesData.find(x => x.id === parseInt(id))
      if (!rec) continue
      avg[rec.cuisine] = (avg[rec.cuisine] || [])
      avg[rec.cuisine].push(r)
    }
    const rankedCuisines = Object.entries(avg).map(([c,arr]) => [c, arr.reduce((a,b)=>a+b,0)/arr.length])
      .sort((a,b)=>b[1]-a[1]).map(x=>x[0])
    return recipesData.filter(r => rankedCuisines.includes(r.cuisine) && !favorites.includes(r.id)).slice(0,6)
  }, [ratings, favorites])

  function addTextIngredient() {
    const items = textInput.split(',').map(s => s.trim()).filter(Boolean)
    if (items.length) setPantry(p => [...new Set([...p, ...items])])
    setTextInput('')
  }

  async function onPickImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setLoadingVision(true)
    await new Promise(r => setTimeout(r)) // allow image render
    const img = imgRef.current
    try {
      const ings = await recognizeIngredientsFromImage(img)
      if (ings.length) setPantry(p => [...new Set([...p, ...ings])])
    } catch (e) {
      console.error(e)
      alert('Failed to recognize ingredients. You can still add manually.')
    } finally {
      setLoadingVision(false)
    }
  }

  function onToggleDietary(tag){
    setDietary(prev => prev.includes(tag) ? prev.filter(x=>x!==tag) : [...prev, tag])
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-4">
        <h1 className="text-2xl font-bold">🍳 Smart Recipe Generator</h1>
        <div className="text-sm text-gray-600">Mobile-responsive • Client-side • TFJS image recognition</div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 md:col-span-1">
          <h2 className="font-semibold mb-2">1) Add your ingredients</h2>
          <div className="flex gap-2">
            <input className="flex-1 border rounded px-2 py-1" placeholder="e.g., tomato, onion, paneer" value={textInput} onChange={e=>setTextInput(e.target.value)} />
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={addTextIngredient}>Add</button>
          </div>
          <div className="mt-3 text-sm">
            <input type="file" accept="image/*" ref={fileRef} onChange={onPickImage}/>
            {preview && <img ref={imgRef} src={preview} alt="preview" className="mt-2 rounded"/>}
            {loadingVision && <div className="text-xs text-gray-500 mt-1">Analyzing image…</div>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pantry.map(p => <Tag key={p}>{p}</Tag>)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
          <h2 className="font-semibold mb-2">2) Filters & customization</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-sm">Dietary</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {dietaryOptions.map(opt => (
                  <button key={opt} onClick={()=>onToggleDietary(opt)} className={`px-2 py-1 rounded border ${dietary.includes(opt)?'bg-green-100 border-green-400':'bg-white'}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm">Difficulty</label>
              <select className="w-full border rounded px-2 py-1" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                <option value="">Any</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Max time (min)</label>
              <input className="w-full border rounded px-2 py-1" type="number" value={maxTime} onChange={e=>setMaxTime(e.target.value)} placeholder="e.g., 30"/>
            </div>
            <div>
              <label className="text-sm">Servings</label>
              <input className="w-full border rounded px-2 py-1" type="number" min="1" value={servings} onChange={e=>setServings(parseInt(e.target.value||'1'))}/>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">Adjust servings to scale ingredient quantities automatically.</div>
        </div>
      </section>

      <section className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">3) Matching recipes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {scored.map(r => (
              <RecipeCard key={r.id} recipe={r} favorites={favorites} ratings={ratings}
                onFav={()=>setFavorites(toggleFavorite(r.id).favorites)}
                onRate={(n)=>setRatings(setRating(r.id,n).ratings)}
              />
            ))}
            {scored.length===0 && <div className="text-gray-600">No matches yet. Add a few common ingredients or relax filters.</div>}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">4) Suggestions for you</h2>
          <div className="grid gap-3">
            {suggestions.map(r => (
              <div key={r.id} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.cuisine} • {r.time} min</div>
                </div>
                <button onClick={()=>setFavorites(toggleFavorite(r.id).favorites)} className="text-sm px-2 py-1 rounded bg-blue-600 text-white">Save</button>
              </div>
            ))}
            {suggestions.length===0 && <div className="text-gray-600 text-sm">Rate a few recipes to see personalized suggestions.</div>}
          </div>
        </div>
      </section>

      <footer className="text-xs text-gray-500 mt-6 text-center">
        Built for the Smart Recipe Generator assessment. Client-only, deploy to Netlify/Vercel. 
      </footer>
    </div>
  )
}