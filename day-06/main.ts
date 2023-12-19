const data = await Deno.readTextFile('day-06/data.txt');
const allLineNumbers = data
  .split('\r\n')
  .map(x => x.match(/[0-9]+/g))
  .filter(x => x !== null)
  .map(x => x!.map(y => parseInt(y)));

type Race = { time: number; distance: number };

const solvePartOne = () => {
  const races: Race[] = [];
  for (let i = 0; i < allLineNumbers[0]?.length; i++) {
    races.push({ time: allLineNumbers[0][i], distance: allLineNumbers[1][i] });
  }

  let solution = 1;

  for (const race of races) {
    let possible = 0;
    for (let i = 1; i < race.time; i++) {
      const distance = i * (race.time - i);
      if (distance > race.distance) {
        possible++;
      }
    }
    solution *= possible;
  }

  console.log(`Solution part one: ${solution}`);
};

const solvePartTwo = () => {
  const parseNumbers = (line: number[]) =>
    parseInt(line.reduce<string>((a, b) => `${a}${b}`, ''));

  const race: Race = {
    time: parseNumbers(allLineNumbers[0]),
    distance: parseNumbers(allLineNumbers[1]),
  };

  let possible = 0;
  for (let i = 1; i < race.time; i++) {
    const distance = i * (race.time - i);
    if (distance > race.distance) {
      possible++;
    }
  }

  console.log(`Solution part two: ${possible}`);
};

solvePartOne();
solvePartTwo();
