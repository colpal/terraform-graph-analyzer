function subset(lessers, greaters) {
  for (const lesser of lessers) {
    if (!greaters.has(lesser)) return false;
  }
  return true;
}

function union(a, b) {
  return new Set([...a, ...b]);
}

export function* parseEdges(dot) {
  const matches = dot.matchAll(/^\s*"(.+)" -> "(.+)"/gm);
  for (const [_, from, to] of matches) {
    yield [from, to];
  }
}

export function groupForwards(it) {
  const nodes = {};
  for (const [from, to] of it) {
    if (nodes[from]) nodes[from].add(to);
    else nodes[from] = new Set([to]);
  }
  return nodes;
}

export function groupBackwards(it) {
  const nodes = {};
  for (const [from, to] of it) {
    if (nodes[to]) nodes[to].add(from);
    else nodes[to] = new Set([from]);
  }
  return nodes;
}

function* getWaveChildren(wave, forwards) {
  for (const parent of wave) {
    const forward = forwards[parent];
    if (!forward) continue;
    for (const child of forwards[parent]) {
      yield child;
    }
  }
}

function* filterValidChildren(children, backwards, visited) {
  for (const child of children) {
    const parents = backwards[child];
    if (subset(parents, visited)) yield child;
  }
}

export function* generateWaves(root, backwards, forwards) {
  let currentWave = new Set([root]);
  yield currentWave;
  let visited = new Set(currentWave);
  while (true) {
    const waveChildren = new Set(getWaveChildren(currentWave, forwards));
    const nextWave = new Set(
      filterValidChildren(waveChildren, backwards, visited),
    );
    if (nextWave.size === 0) break;
    yield nextWave;
    visited = union(visited, nextWave);
    currentWave = nextWave;
  }
}

export function generateChart(waves) {
  const indexPad = Math.ceil(Math.log10(waves.length));
  const sizePad = Math.ceil(
    Math.log10(Math.max(...waves.map(([, wave]) => wave.size))),
  );
  return waves.map(([index, wave]) => {
    const label = `${index}`.padStart(indexPad, "0");
    const size = `${wave.size}`.padStart(sizePad, "0");
    const bar = "#".repeat(Math.ceil(wave.size / 10));
    return `${index}: [${size}] ${bar}`;
  });
}
