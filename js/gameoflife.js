function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x == j && y == k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let alive = this.find((ele) => ele[0] === cell[0] && ele[1] === cell[1]);
  return !!alive;
}

const printCell = (cell, state) => {
  const STATE = {
    ALIVE: "\u25A3",
    NOT_ALIVE: "\u25A2",
  };

  const result = contains.call(state, cell) ? STATE.ALIVE : STATE.NOT_ALIVE;
  return result;
};

const corners = (state = []) => {
  let minX, minY, maxX, maxY;

  if (state.length < 1) {
    return {
      topRight: [0, 0],
      bottomLeft: [0, 0],
    };
  }

  minX = maxX = state[0][0];
  minY = maxY = state[0][1];

  state.forEach(function (ele) {
    const [x, y] = ele;
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  });

  return {
    topRight: [maxX, maxY],
    bottomLeft: [minX, minY],
  };
};

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);

  let result = "";
  for (let i = topRight[1]; i >= bottomLeft[1]; i--) {
    for (let j = bottomLeft[0]; j <= topRight[0]; j++) {
      result += printCell([j, i], state);
      if (j == topRight[0]) {
        result += "\n";
      } else {
        result += " ";
      }
    }
  }

  return result;
};

const getNeighborsOf = ([x, y]) => [
  [x - 1, y],
  [x - 1, y + 1],
  [x - 1, y - 1],
  [x + 1, y],
  [x + 1, y + 1],
  [x + 1, y - 1],
  [x, y + 1],
  [x, y - 1],
];

const getLivingNeighbors = (cell, state) =>
  getNeighborsOf(cell).filter((ele) => contains.bind(state)(ele)) || [];

const willBeAlive = (cell, state) => {
  const countOfLivingNeighbors = getLivingNeighbors(cell, state).length;
  const isAlive = contains.call(state, cell);
  return (
    (isAlive && countOfLivingNeighbors === 2) || countOfLivingNeighbors === 3
  );
};

const calculateNext = (state) => {
  const { topRight, bottomLeft } = corners(state);
  const _res = [];
  for (let i = bottomLeft[0] - 1; i <= topRight[0] + 1; i++) {
    for (let j = bottomLeft[1]; j <= topRight[1] + 1; j++) {
      if (willBeAlive([i, j], state)) {
        _res.push([i, j]);
      }
    }
  }
  return _res;
};

const iterate = (state, iterations) => {
  const _res = [];
  _res.push(state);
  for (let i = 0; i < iterations; i++) {
    _res.push(calculateNext(_res[i]));
  }
  return _res;
};

const main = (pattern, iterations) => {
  const allStates = iterate(startPatterns[pattern], iterations);
  allStates.forEach((newState) => console.log(printCells(newState)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

main("rpentomino", 2);

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
