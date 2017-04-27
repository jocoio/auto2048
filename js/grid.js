function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

Grid.prototype.availableCellsInRow = function (row) {
  var cells = [];

  this.eachCellInRow(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  }, row);

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Call callback for every cell in a given row
Grid.prototype.eachCellInRow = function (callback, row) {
  for (var x = 0; x < this.size; x++) {
    callback(x, row, this.cells[x][row]);
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Shows how many cells are available in a given row
Grid.prototype.cellsAvailableInRow = function (row) {
  return this.availableCellsInRow(row).length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
    position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};

Grid.prototype.timeToCombineDiagonally = function () {
  for (var x1 = 0; x1 < this.size - 1; x1++) {
    for (var x2 = x1 + 1; x2 < this.size; x2++) {
      if (!this.cellAvailable({ x: x1, y: 2 })) {
        if ((this.cellContent({ x: x1, y: 2 }).value === this.cellContent({ x: x2, y: 3 }).value) && (this.cellsAvailableInRow(2) === x2 - x1)) {
          return true;
        }
      }
    }
  }

  return false;
}

Grid.prototype.timeToCombineDown = function () {
  for (var x1 = 0; x1 < this.size; x1++) {
    if (!this.cellAvailable({ x: x1, y: 2 })) {
      if (this.cellContent({ x: x1, y: 2 }).value === this.cellContent({ x: x1, y: 3 }).value) {
        return true;
      }
    }
  }

  return false;
}
