// size: 725 × 467

/**

What I need:

Game
 * Level
 * Score
 * Start
 * Exit

 Entity
  * sprite
  * hp

  Grid
 	¤ Cell(char, state, location)
  	¤ createCellArray
  	* createCell()
 	* setCell(cell, location)
 	* getCell(Location)
 	* deleteCell(Location)
 	* moveCellTo(cell, location)




World
 * init
 ¤ Location(col, row)

 * clearGrid
 * setGrid(rows, cols)
 * getGrid
 * deleteGrid
 * toString

*/

var World = function() {

	var grid = null;

	this.config = {
		ROWS: 10,
		COLS: 10 
	};

	this.init = function() {
		var ROWS = this.config.ROWS;
		var COLS = this.config.COLS;

		grid = new Grid(ROWS, COLS);
	};

	this.getGrid = function() {
		return grid;
	};

	this.deleteGrid = function() {
		grid = null;
	};

	this.clearGrid = function() {
		for (var y = 0, l = grid.length; y < l; y++) {
			for (var x = 0; x < grid[y].length; x++) {
				var location = new Location(x, y);
				grid.deleteCell(location);
			}
		}
	};

	this.setGrid = function(rows, cols) {
		grid = new Grid(rows, cols);
	};

	function Location(col, row) {
		this.x = col;
		this.y = row;
	}

	function Grid(rows, cols) {
		this.cells = createCellArray(rows, cols);
		this.rows = rows;
		this.cols = cols;

		function createCellArray(rows, cols) {
			var _grid = new Array(rows);
			for (var i = 0; i < rows; i++) {
				_grid[i] = [];
				for (var n = 0; n < cols; n++) {
					_grid[i][n] = null;
				}
			}
			return _grid;
		}

		function Cluster(cells) {
			this.cellList = new LinkedList();
			cells.forEach(function(cell) {
				this.cellList.append(cell);
			});
		}

		this.moveCluster = function(cluster, str) {
			var currNode = cluster.cellList.getHead();
			var x = currNode.element.location.x,
				y =	currNode.element.location.y;
				var cell = currNode.element;
			if (str === 'UP') {
				var location = new Location(cell.location.x, cell.location.y - 1);
				this.moveCellTo(cell, location);
			}
		};

		function Cell(char, state, location) {
			this.char = char;
			this.state = state;
			this.location = location;
		}

		this.setCell = function(cell, location) {
			cell.location = location;
			cellStore[location.y][location.x] = cell;
		};

		this.getCell = function(location) {
			return cellStore[location.y][location.x];
		};

		this.moveCellTo = function(cell, location) {
			var location_ = cell.location;
			this.setCell(cell, location);
			this.deleteCell(location_);
		};

		this.deleteCell = function(location) {
			cellStore[location.y][location.x] = null;
		};
	}
};

function LinkedList() {
	var Node = function(element) {
		this.element = element;
		this.next = null;
	};

	var length = 0;
	var head = null;

	this.append = function(element) {
		var node = new Node(element);
		var current = null;

		if (head === null) {
			head = node;
		} else {
			current = head;
			//loop the list until last item is found
			while (current.next) {
				current = current.next;
			}
			//get last item and assign the link(next) to the element(node)
			current.next = node;
		}
		length++;
	};
	this.insert = function(position, element) {
		if (position >= 0 && position <= length) {
			var node = new Node(element);
			var current = head;
			var previous = null;
			var index = 0;

			if (position === 0) {
				node.next = current;
				head = node;
			} else {
				while (index++ < position) {
					previous = current;
					current = current.next;
				}
				node.next = current;
				previous.next = node;
			}
			length++;
			return true;
		} else {
			return false;
		}
	};
	this.removeAt = function(position) {
		//check for out-of-bounds values
		if (position > -1 && position < length) {
			var current = head;
			var previous = null;
			var index = 0;

			//removing first item
			if (position === 0) {
				head = current.next;
			} else {
				while (index++ < position) {
					previous = current;
					current = current.next;
				}
				previous.next = current.next;
			}
			length--;
			return current.element;
		} else {
			return null;
		}
	};
	this.remove = function(element) {
		var index = this.indexOf(element);
		return this.removeAt(index);
	};
	this.indexOf = function(element) {

		/*var current = head;
		var index = -1;

		while (current) {
			if (element === current.element) {
				return index;
			}
			index++;
			current = current.next;
		}
		}*/
		for (var current = head, i = 0; current; current = current.next, i++) {
			if (element === current.element) {
				return i;
			}
		}
		return -1;
	};
	this.isEmpty = function() {
		return length === 0;
	};
	this.size = function() {
		return length;
	};
	this.toString = function() {
		var current = head;
		var string = '';

		while (current) {
			string += current.element + (current.next ? ', ' : '');
			current = current.next;
		}
		return string;
	};
	this.print = function() {
		console.log(this.toString());
	};
	this.getHead = function() {
		return head;
	};

	this.listToArray = function() {
		var arr = [];
		for (var current = head; current; current = current.next) {
			arr.push(current.element);
		}
		return arr;
	};
}

	