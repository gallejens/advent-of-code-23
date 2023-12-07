const data = await Deno.readTextFile('day1/data.txt');

const WORDS_TO_VALUE: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const regex = /[0-9]|one|two|three|four|five|six|seven|eight|nine/g;
const lines = data.split('\r\n');

let total = 0;

function getValue(str: string): number {
  const number = parseInt(str);
  if (!Number.isNaN(number)) return number;

  return WORDS_TO_VALUE[str] ?? 0;
}

for (const line of lines) {
  const numbers = [...(line.match(regex) ?? [])];
  if (numbers.length === 0) continue;

  total += getValue(numbers[0]) * 10;
  total += getValue(numbers[numbers.length - 1]);
}

console.log(`Solution: ${total}`);
