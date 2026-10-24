/** Quantity formatting for first Wine With Pete recipe guides. */
export type GuideIngredient = { id: string; name: string; quantity?: number; unit?: string; note?: string };

export function formatAmount(value: number): string {
  const whole = Math.floor(value + 0.0001);
  const fraction = value - whole;
  const parts = [
    { n: .125, s: '⅛' }, { n: 1 / 6, s: '⅙' }, { n: .25, s: '¼' }, { n: 1 / 3, s: '⅓' },
    { n: .375, s: '⅜' }, { n: .5, s: '½' }, { n: .625, s: '⅝' },
    { n: 2 / 3, s: '⅔' }, { n: .75, s: '¾' }, { n: .875, s: '⅞' },
  ];
  const match = parts.find(part => Math.abs(fraction - part.n) < .013);
  if (match) return (whole ? whole + ' ' : '') + match.s;
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

export function ingredientText(item: GuideIngredient, servings: number, baselineServings = 6): string {
  const scaled = item.quantity === undefined ? undefined : item.quantity * servings / baselineServings;
  const amount = scaled === undefined ? '' : formatAmount(scaled) + ' ';
  let unit = item.unit;
  if (unit === '15-oz cans' && scaled === 1) unit = '15-oz can';
  if (unit === 'cup' && scaled !== undefined && scaled > 1) unit = 'cups';
  return amount + (unit ? unit + ' ' : '') + item.name;
}
