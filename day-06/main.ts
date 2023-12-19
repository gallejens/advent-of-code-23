const data = await Deno.readTextFile('day-06/data.txt');
const allLineNumbers = data
  .split('\r\n')
  .map(x => x.match(/[0-9]+/g))
  .filter(x => x !== null)
  .map(x => x!.map(y => parseInt(y)));

const races: { time: number; distance: number }[] = [];
for (let i = 0; i < allLineNumbers[0]?.length; i++) {
  races.push({ time: allLineNumbers[0][i], distance: allLineNumbers[1][i] });
}

const solvePartOne = () => {
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

const solvePartTwo = () => {};

solvePartOne();
solvePartTwo();
