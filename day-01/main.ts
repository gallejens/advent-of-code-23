const data = await Deno.readTextFile('day-01/data.txt');

const WORDS_TO_VALUE: [string, number][] = [
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
];

const REVERSE_WORDS_TO_VALUE: typeof WORDS_TO_VALUE = WORDS_TO_VALUE.map(
  ([word, value]) => [word.split('').reverse().join(''), value]
);

const lines = data.split('\r\n');
let total = 0;

const findNumber = (line: string, reverse: boolean) => {
  const wordsToCheck = reverse ? REVERSE_WORDS_TO_VALUE : WORDS_TO_VALUE;
  let wordBufferIdx = 0;
  const wordBuffers: Map<number, { buffer: string; value: number }> = new Map();

  for (let i = 0; i < line.length; i++) {
    const idx = reverse ? line.length - 1 - i : i;
    const char = line[idx];

    // first check if char is number
    const number = parseInt(char);
    if (!Number.isNaN(number)) {
      return number;
    }

    // check if char is part of a wordbuffer
    for (const [bufferId, data] of wordBuffers) {
      if (data.buffer[0] !== char) {
        wordBuffers.delete(bufferId);
        continue;
      }

      data.buffer = data.buffer.slice(1);

      if (!data.buffer) {
        return data.value;
      }
    }

    // check if char is first letter of a word
    for (const [word, value] of wordsToCheck) {
      if (word[0] === char) {
        wordBuffers.set(wordBufferIdx, { buffer: word.slice(1), value });
        wordBufferIdx++;
      }
    }
  }

  return 0;
};

console.time('Benchmark');

for (const line of lines) {
  const first = findNumber(line, false);
  const last = findNumber(line, true);

  total += first * 10 + (last ?? first);
}

console.timeEnd('Benchmark');
console.log(`Solution: ${total}`);
