
// Map MobileNet labels to common ingredients
export const labelToIngredient = (label) => {
  const l = label.toLowerCase()
  if (l.includes('banana')) return 'banana'
  if (l.includes('apple')) return 'apple'
  if (l.includes('broccoli')) return 'broccoli'
  if (l.includes('cucumber')) return 'cucumber'
  if (l.includes('tomato')) return 'tomato'
  if (l.includes('bell pepper') || l.includes('pepper')) return 'bell peppers'
  if (l.includes('carrot')) return 'carrot'
  if (l.includes('mushroom')) return 'mushrooms'
  if (l.includes('onion')) return 'onion'
  if (l.includes('garlic')) return 'garlic'
  if (l.includes('bread')) return 'bread'
  if (l.includes('egg')) return 'eggs'
  if (l.includes('chicken')) return 'chicken'
  if (l.includes('fish')) return 'fish'
  if (l.includes('bottle gourd')) return 'bottle gourd'
  if (l.includes('zucchini')) return 'zucchini'
  if (l.includes('paneer') || l.includes('cheese')) return 'paneer'
  if (l.includes('tofu')) return 'tofu'
  if (l.includes('basil')) return 'basil'
  if (l.includes('lemon')) return 'lemon'
  if (l.includes('avocado')) return 'avocado'
  if (l.includes('rice')) return 'rice'
  if (l.includes('pasta')) return 'pasta'
  return null
}
