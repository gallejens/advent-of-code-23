const data = await Deno.readTextFile('day-04/data.txt');
const cards = data.split('\r\n').filter(s => !!s);

const parseNumbers = (str: string) => {
  return str
    .split(' ')
    .map(s => parseInt(s))
    .filter(n => !isNaN(n));
};

const getAmountCorrect = (
  winningNumbers: number[],
  playerNumbers: number[]
) => {
  let amountCorrect = 0;
  for (const n of playerNumbers) {
    if (winningNumbers.includes(n)) {
      amountCorrect++;
    }
  }
  return amountCorrect;
};

const solvePartOne = () => {
  let points = 0;

  for (const card of cards) {
    const [winningNumbersStr, playerNumbersStr] = card.split(':')[1].split('|');
    const [winningNumbers, playerNumbers] = [
      winningNumbersStr,
      playerNumbersStr,
    ].map(parseNumbers);

    const amountCorrect = getAmountCorrect(winningNumbers, playerNumbers);
    if (amountCorrect === 0) continue;

    points += Math.pow(2, amountCorrect - 1);
  }

  console.log(`Part one answer: ${points}`);
};

const solvePartTwo = () => {
  const correctPerCard = new Map<number, number>();
  for (const card of cards) {
    const [cardInfo, numbersStr] = card.split(':');

    const splitCardInfo = cardInfo.split(' ');
    const cardNumber = parseInt(splitCardInfo[splitCardInfo.length - 1]);

    const [winningNumbersStr, playerNumbersStr] = numbersStr.split('|');
    const [winningNumbers, playerNumbers] = [
      winningNumbersStr,
      playerNumbersStr,
    ].map(parseNumbers);

    const amountCorrect = getAmountCorrect(winningNumbers, playerNumbers);
    correctPerCard.set(cardNumber, amountCorrect);

    console.log(`Card ${cardNumber} has ${amountCorrect} correct numbers`);
  }

  let amountOfCards = 0;
  const duplicates = new Map<number, number>();
  for (const [cardNumber, amountCorrect] of correctPerCard) {
    amountOfCards++; // the original card

    const cardAmount = (duplicates.get(cardNumber) ?? 0) + 1;

    for (let i = 1; i <= amountCorrect; i++) {
      const dupeCardNumber = cardNumber + i;
      const amount = duplicates.get(dupeCardNumber) ?? 0;
      duplicates.set(dupeCardNumber, amount + cardAmount);
    }
  }

  for (const [_, n] of duplicates) {
    amountOfCards += n;
  }

  console.log(`Part two answer: ${amountOfCards}`);
};

solvePartOne();
solvePartTwo();
