
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'
import { labelToIngredient } from './ingredientMapping'

let model = null
export async function ensureModel() {
  if (!model) model = await mobilenet.load()
  return model
}

export async function recognizeIngredientsFromImage(imgEl) {
  const model = await ensureModel()
  const preds = await model.classify(imgEl)
  // Map to ingredients and keep top-3 unique
  const mapped = []
  for (const p of preds) {
    const ing = labelToIngredient(p.className)
    if (ing && !mapped.includes(ing)) mapped.push(ing)
    if (mapped.length >= 3) break
  }
  return mapped
}
