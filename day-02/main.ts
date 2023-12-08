const data = await Deno.readTextFile('day-02/data.txt');
const lines = data.split('\r\n');

const solvePartOne = () => {
  console.time('Part one');

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
      if (setPossible) continue;

      valid = false;
      break;
    }

    if (!valid) continue;

    total += id;
  }

  console.timeEnd('Part one');
  console.log(`Solution part one: ${total}`);
};

const solvePartTwo = () => {
  console.time('Part two');

  let totalPower = 0;

  for (const line of lines) {
    const sets = line.split(':')[1].trim().split(';');

    const highestAmounts: Record<string, number> = {};

    for (const set of sets) {
      const hands = set.split(',');

      for (const hand of hands) {
        const [amountStr, color] = hand.trim().split(' ');
        const amount = +amountStr;

        if (!highestAmounts[color] || amount > highestAmounts[color]) {
          highestAmounts[color] = amount;
          continue;
        }
      }
    }

    totalPower += Object.values(highestAmounts).reduce(
      (acc, cur) => acc * cur,
      1
    );
  }

  console.timeEnd('Part two');
  console.log(`Solution part two: ${totalPower}`);
};

solvePartOne();
solvePartTwo();
