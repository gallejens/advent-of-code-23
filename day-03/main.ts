const schematic = await Deno.readTextFile('day-03/data.txt');
const rows = schematic.split('\r\n');
const grid = rows.map(row => row.split(''));

const partNumbers: { number: string; x: number; y: number }[] = [];
let currentPartNumberId: number | null = null;

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const cell = row[x];

    const number = +cell;
    if (Number.isNaN(number) || cell === '.') {
      currentPartNumberId = null;
      continue;
    }

    if (currentPartNumberId === null) {
      partNumbers.push({ number: cell, x, y });
      currentPartNumberId = partNumbers.length - 1;
    } else {
      partNumbers[currentPartNumberId].number += cell;
    }
  }
}

const solvePartOne = () => {
  // now we check if the partnumbers are valid
  let total = 0;

  for (const partNumber of partNumbers) {
    const { number, x, y } = partNumber;

    let valid = false;

    for (const yOffset of [-1, 0, 1]) {
      for (
        let xOffset = -1;
        xOffset < number.length + 1;
        xOffset += yOffset === 0 ? number.length + 1 : 1 // skip the middle where numbeds are located
      ) {
        const cell = grid[y + yOffset]?.[x + xOffset];
        if (!cell) continue;

        if (cell === '.') continue;

        const number = +cell;
        if (!Number.isNaN(number)) continue;

        valid = true;

        break;
      }

      if (valid) break;
    }

    if (valid) {
      total += +number;
    }
  }

  console.log(`Solution part one: ${total}`);
};

const solvePartTwo = () => {
  // now we check if the partnumbers are valid
  let total = 0;

  const symbols: { x: number; y: number; number: number }[] = [];

  for (const partNumber of partNumbers) {
    const { number: strNumber, x, y } = partNumber;
    const number = +strNumber;

    for (const yOffset of [-1, 0, 1]) {
      for (
        let xOffset = -1;
        xOffset < strNumber.length + 1;
        xOffset += yOffset === 0 ? strNumber.length + 1 : 1 // skip the middle where numbeds are located
      ) {
        const [cellX, cellY] = [x + xOffset, y + yOffset];
        const cell = grid[y + yOffset]?.[x + xOffset];
        if (!cell || cell !== '*') continue;

        const existingSymbol = symbols.find(
          s => s.x === cellX && s.y === cellY
        );
        if (existingSymbol) {
          total += existingSymbol.number * number;
        } else {
          symbols.push({ x: cellX, y: cellY, number });
        }
      }
    }
  }

  console.log(`Solution part two: ${total}`);
};

solvePartOne();
solvePartTwo();
