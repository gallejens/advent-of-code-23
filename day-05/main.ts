const data = await Deno.readTextFile('day-05/data.txt');
const lines = data.split('\r\n').filter(s => !!s);

const seedNumbers = lines[0]
  .replace('seeds:', '')
  .split(' ')
  .map(s => parseInt(s.trim()))
  .filter(s => !Number.isNaN(s));

const solvePartOne = () => {
  const seeds = seedNumbers;

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
  const set: { originalValue: number; newValue: number }[] = seeds.map(s => ({
    originalValue: s,
    newValue: s,
  }));
  for (const [_, mapEntries] of maps) {
    for (const { dest, src, range } of mapEntries) {
      for (let i = 0; i < set.length; i++) {
        const { originalValue, newValue } = set[i];
        if (newValue !== newValue) continue;
        if (originalValue < src || originalValue > src + range) continue;

        const diff = originalValue - src;
        set[i].newValue = dest + diff;
      }
    }

    for (let i = 0; i < set.length; i++) {
      set[i].originalValue = set[i].newValue;
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
  console.time('benchmark');

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

  // create seed ranges
  const seedRanges: [number, number][] = [];
  for (let i = 0; i < seedNumbers.length; i += 2) {
    seedRanges.push([seedNumbers[i], seedNumbers[i] + seedNumbers[i + 1]]);
  }

  type Range = { from: [number, number]; to: [number, number]; depth: number };

  // determine linked numnbers
  let currentDepth = 0;
  const ranges: Range[] = [
    {
      from: [0, 2000],
      to: [0, 2000],
      depth: -1,
    },
  ];

  for (const mapEntries of [...maps.values()]) {
    // create new ranges for this depth
    const newRanges: Range[] = [];
    for (const { dest, src, range } of mapEntries) {
      const currentFrom: [number, number] = [src, src + range - 1];
      const currentTo: [number, number] = [dest, dest + range - 1];
      newRanges.push({
        from: currentFrom,
        to: currentTo,
        depth: currentDepth,
      });
    }

    // add new ranges to existing ranges and split existing ranges
    for (const newRange of newRanges) {
      console.log(`new range: ${newRange.from} -> ${newRange.to}`);

      const originalRangeLength = ranges.length;
      for (let i = 0; i < originalRangeLength; i++) {
        const { from, to, depth } = ranges[i];
        if (depth === currentDepth) continue;

        const diff = to[0] - from[0];

        // if new range overlaps left side of original range
        if (
          newRange.from[0] < to[0] &&
          newRange.from[1] < to[1] &&
          newRange.from[0] < to[1]
        ) {
          console.log('left');
          continue;
        }

        // if new range overlaps right side of original range
        if (
          newRange.from[0] > to[0] &&
          newRange.from[0] < to[1] &&
          newRange.from[1] > to[1]
        ) {
          console.log('right');
          continue;
        }

        // if new range is inside original range
        // this also handles left or right bound being same while fully inside
        if (newRange.from[0] >= to[0] && newRange.from[1] <= to[1]) {
          console.log('inside');

          // add the new range
          ranges.push({
            from: newRange.from,
            to: newRange.to,
            depth: currentDepth,
          });

          const leftBoundSame = newRange.from[0] === to[0];

          // modify left side of original range if left bound isnt same
          if (!leftBoundSame) {
            const newOriginalBound = newRange.from[0] - 1;
            from[1] = newOriginalBound;
            to[1] = newOriginalBound - diff;
          }

          // add leftover of original range on right side if right bound isnt same
          if (newRange.from[1] !== to[1]) {
            // if left bound was same, we dont add new range but modify original
            const newBound = newRange.from[1] + 1;
            if (leftBoundSame) {
              from[0] = newBound;
              to[0] = newBound + diff;
            } else {
              console.log(diff);
              console.log(`Adding range ${newBound} -> ${to[1]}`);
              ranges.push({
                from: [newBound, to[1]],
                to: [newBound + diff, to[1]],
                depth,
              });
            }
          }
          continue;
        }

        // if new range overlap original range
        if (newRange.from[0] < to[0] && newRange.from[1] > to[1]) {
          console.log('overlap');
          continue;
        }
      }
    }

    currentDepth++;
    break;
  }

  console.log(ranges.sort((a, b) => a.from[0] - b.from[0]));

  console.timeEnd('benchmark');
  // console.log(`Part two answer: ${lowest}`);
};

solvePartOne();
solvePartTwo();
