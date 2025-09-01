
// Recipe matching and filters
export function scoreRecipe(recipe, pantry, restrictions, maxTime, difficulty) {
  // pantry: array of strings
  const ing = recipe.ingredients.map(s => s.toLowerCase())
  let matches = 0
  for (const p of pantry) {
    const t = p.toLowerCase()
    if (ing.some(x => x.includes(t))) matches += 1
  }
  // dietary restriction must be satisfied if provided
  if (restrictions && restrictions.length > 0) {
    for (const r of restrictions) {
      if (!recipe.dietary.includes(r)) return -1
    }
  }
  if (maxTime && recipe.time > maxTime) return -1
  if (difficulty && recipe.difficulty !== difficulty) return -1
  return matches
}

export function adjustServingIngredients(ingredients, factor) {
  // naive scaling: if an ingredient starts with a number, scale it
  return ingredients.map(line => {
    const m = line.match(/^\s*(\d+(?:\.\d+)?)\s*(.*)$/)
    if (!m) return line
    const qty = parseFloat(m[1])
    const rest = m[2]
    const newQty = (qty * factor).toFixed(2).replace(/\.00$/,'')
    return `${newQty} ${rest}`
  })
}
