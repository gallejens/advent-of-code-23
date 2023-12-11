const data = await Deno.readTextFile('day-04/data.txt');
const cards = data.split('\r\n').filter(s => !!s);

const parseNumbers = (str: string) => {
  return str
    .split(' ')
    .map(s => parseInt(s))
    .filter(n => !isNaN(n));
};

const solvePartOne = () => {
  let points = 0;

  for (const card of cards) {
    const [winningNumbersStr, playerNumbersStr] = card.split(':')[1].split('|');
    const [winningNumbers, playerNumbers] = [
      winningNumbersStr,
      playerNumbersStr,
    ].map(parseNumbers);

    let amountCorrect = 0;
    for (const n of playerNumbers) {
      if (winningNumbers.includes(n)) {
        amountCorrect++;
      }
    }

    if (amountCorrect === 0) continue;

    points += Math.pow(2, amountCorrect - 1);
  }

  console.log(`Part one answer: ${points}`);
};

solvePartOne();
