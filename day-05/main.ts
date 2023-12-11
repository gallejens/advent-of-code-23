const data = await Deno.readTextFile('day-05/data.txt');
const lines = data.split('\r\n').filter(s => !!s);

const solvePartOne = () => {
  const seeds = lines[0]
    .replace('seeds:', '')
    .split(' ')
    .map(s => parseInt(s.trim()))
    .filter(s => !Number.isNaN(s));

  let mapId = 0;
  const maps = new Map<
    number,
    { dest: number; src: number; range: number }[]
  >();

  // start at line one to skip seeds
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.includes(':')) {
      mapId++;
      continue;
    }

    const [dest, src, range] = line
      .split(' ')
      .map(s => parseInt(s.trim()))
      .filter(s => !Number.isNaN(s));

    const mapEntries = maps.get(mapId) ?? [];
    mapEntries.push({ dest, src, range });
    maps.set(mapId, mapEntries);
  }

  // do the mapping
  const set: { originalValue: number; newValue: number | undefined }[] =
    seeds.map(s => ({
      originalValue: s,
      newValue: undefined,
    }));
  for (const [_, mapEntries] of maps) {
    for (const { dest, src, range } of mapEntries) {
      for (let i = 0; i < set.length; i++) {
        const { originalValue, newValue } = set[i];
        if (newValue !== undefined) continue;
        if (originalValue < src || originalValue > src + range) continue;

        const diff = originalValue - src;
        set[i].newValue = dest + diff;
      }
    }

    for (let i = 0; i < set.length; i++) {
      const newValue = set[i].newValue;
      if (newValue === undefined) continue;
      set[i].originalValue = newValue;
      set[i].newValue = undefined;
    }
  }

  let lowest: number | undefined;
  for (const { originalValue } of set) {
    if (lowest === undefined || originalValue < lowest) {
      lowest = originalValue;
    }
  }

  console.log(`Part one answer: ${lowest}`);
};

const solvePartTwo = () => {
  // console.log(`Part two answer: `);
};

solvePartOne();
solvePartTwo();
