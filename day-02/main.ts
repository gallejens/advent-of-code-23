const data = await Deno.readTextFile('day-02/data.txt');
const lines = data.split('\r\n');

const MAX: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

let total = 0;

const isSetPossible = (set: string) => {
  const hands = set.split(',');

  for (const hand of hands) {
    const [amount, color] = hand.trim().split(' ');
    if (+amount > MAX[color]) {
      return false;
    }
  }

  return true;
};

for (const line of lines) {
  const splitLine = line.split(':');
  if (splitLine.length !== 2)
    throw new Error(`More than one colon in line ${line}`);

  const id = +splitLine[0].replace('Game ', '');
  const sets = splitLine[1].trim().split(';');

  let valid = true;
  for (const set of sets) {
    const setPossible = isSetPossible(set);
    console.log(`${set} is ${setPossible ? 'possible' : 'not possible'}`);
    if (setPossible) continue;

    valid = false;
    break;
  }

  if (!valid) continue;

  total += id;
}

console.log(total);
