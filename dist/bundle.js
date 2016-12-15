/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
"use strict";
var State = (function () {
    function State(parent, size) {
        this.parent = parent;
        this.size = size;
    }
    State.prototype.getField = function () {
        return this.field;
    };
    State.prototype.setField = function (field) {
        this.field = field;
        this.hash = this.getHashCode();
    };
    State.prototype.equals = function (obj) {
        if (obj == null || !(obj instanceof State))
            return false;
        return this.hash == obj.hashCode();
    };
    State.prototype.hashCode = function () {
        return this.hash;
    };
    State.prototype.getF = function () {
        return this.g + this.h;
    };
    State.prototype.getG = function () {
        return this.g;
    };
    State.prototype.setG = function (g) {
        this.g = g;
    };
    State.prototype.getH = function () {
        return this.h;
    };
    State.prototype.setH = function (h) {
        this.h = h;
    };
    State.prototype.getParent = function () {
        return this.parent;
    };
    State.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    State.prototype.getHashCode = function () {
        if (this.field == null)
            return "0";
        return this.field.join("");
    };
    return State;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = State;


/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
"use strict";
var Astar = (function () {
    function Astar(rules) {
        this.closedState = 0;
        this.rules = rules;
    }
    Astar.prototype.search = function (startState) {
        var close = [];
        var open = [];
        open.push(startState);
        startState.setG(0);
        startState.setH(this.rules.getH(startState));
        var count = 0;
        while (open.length > 0) {
            /*if (count == 100)
                return null;
            count++;

            for (let i of open) {
                let s = "";
                let g = 0;
                for(let j = 0; j < 4; j++) {
                    for (let k = 0; k < 4; k++) {
                        s += i.getField()[g++].toString() + " "
                    }
                    s += "\n"
                }
                console.log(s);
                console.log(i.getF());
                console.log("--------------------------------------------------------------------------")
            }
            console.log("----------------------EEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDD-----------------")*/
            var x = this.getStateWithMinF(open);
            if (this.rules.isTerminate(x)) {
                this.closedState = close.length;
                return this.completeSolution(x);
            }
            //console.log(open.length, close.length);
            //console.time("Search hash");
            var removeIndex = open.map(function (item) { return item.hashCode(); })
                .indexOf(x.hashCode());
            open.splice(removeIndex, 1); //must test
            //console.timeEnd("Search hash");
            close.push(x.hashCode());
            var neighbors = this.rules.getNeighbors(x);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var neighbor = neighbors_1[_i];
                if (close.indexOf(neighbor.hashCode()) > -1) {
                    continue;
                }
                var g = x.getG() + this.rules.getDistance(x, neighbor);
                var isGBetter = void 0;
                //console.time("Consist neigh");
                var isContainNeighbor = open.map(function (item) { return item.hashCode(); })
                    .indexOf(neighbor.hashCode());
                //console.timeEnd("Consist neigh");
                if (isContainNeighbor == -1) {
                    neighbor.setH(this.rules.getH(neighbor));
                    open.push(neighbor);
                    isGBetter = true;
                }
                else {
                    isGBetter = g < neighbor.getG();
                }
                if (isGBetter) {
                    neighbor.setParent(x);
                    neighbor.setG(g);
                }
            }
        }
        return null;
    };
    Astar.prototype.getClosedStatesCount = function () {
        return this.closedState;
    };
    Astar.prototype.getStateWithMinF = function (open) {
        var result = null;
        var min = Number.MAX_VALUE;
        //console.time("Time MinF");
        for (var _i = 0, open_1 = open; _i < open_1.length; _i++) {
            var state = open_1[_i];
            if (state.getF() < min) {
                min = state.getF();
                result = state;
            }
        }
        //console.timeEnd("Time MinF");
        return result;
    };
    Astar.prototype.completeSolution = function (terminate) {
        var path = [];
        var temp = terminate;
        while (temp != null) {
            path.unshift(temp);
            temp = temp.getParent();
        }
        return path;
    };
    return Astar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Astar;


/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";
var Puzzle = (function () {
    function Puzzle(canvas, size) {
        var _this = this;
        this.puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        this.terminateState = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        this.clicks = 0;
        this.countMix = 50;
        canvas.width = 530;
        canvas.height = 530;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = size;
        if (size == 3) {
            this.puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
            this.terminateState = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        }
        else if (size == 4) {
            this.puzzle = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
            this.terminateState = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
        }
        this.puzzleSize = canvas.width / size;
        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.mix(this.countMix);
        this.draw();
        canvas.onclick = function (e) {
            var x = (e.pageX - canvas.offsetLeft) / _this.puzzleSize | 0;
            var y = (e.pageY - canvas.offsetTop) / _this.puzzleSize | 0;
            _this.processEvent(x, y);
        };
        canvas.ontouchend = function (e) {
            var x = (e.touches[0].pageX - canvas.offsetLeft) / _this.puzzleSize | 0;
            var y = (e.touches[0].pageY - canvas.offsetTop) / _this.puzzleSize | 0;
            _this.processEvent(x, y);
        };
    }
    Puzzle.prototype.getField = function () {
        var result = [];
        for (var _i = 0, _a = this.puzzle; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var el = row_1[_b];
                result.push(el);
            }
        }
        return result;
    };
    Puzzle.prototype.setPuzzleView = function (x, y) {
        this.ctx.fillStyle = "#fff";
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.117647)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillRect(x + 1, y + 1, this.puzzleSize - 2, this.puzzleSize - 2);
    };
    Puzzle.prototype.setFontPuzzle = function () {
        this.ctx.font = (this.puzzleSize / 4) + "px Roboto";
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#222";
    };
    Puzzle.prototype.getClicks = function () {
        return this.clicks;
    };
    Puzzle.prototype.doAction = function (action) {
        switch (action) {
            case 'Top': {
                var coords = void 0;
                var nullCoords = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x,
                    y: nullCoords.y - 1
                };
                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
                break;
            }
            case 'Bottom': {
                var coords = void 0;
                var nullCoords = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x,
                    y: nullCoords.y + 1
                };
                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
                break;
            }
            case 'Right': {
                var coords = void 0;
                var nullCoords = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x + 1,
                    y: nullCoords.y
                };
                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
                break;
            }
            case 'Left': {
                var coords = void 0;
                var nullCoords = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x - 1,
                    y: nullCoords.y
                };
                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
                break;
            }
        }
    };
    Puzzle.prototype.resetPuzzle = function () {
        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.mix(this.countMix);
        this.draw();
    };
    Puzzle.prototype.getNullPuzzle = function () {
        for (var i = 0; i < this.puzzle.length; i++) {
            for (var j = 0; j < this.puzzle[0].length; j++)
                if (this.puzzle[i][j] === 0)
                    return { x: j, y: i };
        }
    };
    Puzzle.prototype.isWin = function () {
        for (var i = 0; i < this.puzzle.length; i++) {
            for (var j = 0; j < this.puzzle[0].length; j++)
                if (this.puzzle[i][j] != this.terminateState[i][j])
                    return false;
        }
        return true;
    };
    Puzzle.prototype.processEvent = function (x, y) {
        this.move(x, y);
        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        if (this.isWin()) {
            console.log("You win for " + this.clicks + " clicks");
        }
    };
    Puzzle.prototype.move = function (x, y) {
        var nullCoords = this.getNullPuzzle();
        if (((x - 1 == nullCoords.x || x + 1 == nullCoords.x) && y == nullCoords.y) ||
            ((y - 1 == nullCoords.y || y + 1 == nullCoords.y) && x == nullCoords.x)) {
            this.puzzle[nullCoords.y][nullCoords.x] = this.puzzle[y][x];
            this.puzzle[y][x] = 0;
            this.clicks++;
        }
    };
    Puzzle.prototype.draw = function () {
        for (var i = 0; i < this.puzzle.length; i++) {
            for (var j = 0; j < this.puzzle[0].length; j++) {
                if (this.puzzle[i][j] > 0) {
                    if (this.setPuzzleView !== null)
                        this.setPuzzleView(j * this.puzzleSize, i * this.puzzleSize);
                    if (this.setFontPuzzle !== null) {
                        this.setFontPuzzle();
                        this.ctx.fillText(this.puzzle[i][j].toString(), j * this.puzzleSize + this.puzzleSize / 2, i * this.puzzleSize + this.puzzleSize / 2);
                    }
                }
            }
        }
    };
    Puzzle.prototype.mix = function (stepCount) {
        for (var i = 0; i < stepCount; i++) {
            var coords = { x: null, y: null };
            var nullCoords = this.getNullPuzzle();
            var hMove = Math.random() >= 0.5;
            var upLeft = Math.random() >= 0.5;
            if (!hMove && !upLeft) {
                coords.y = nullCoords.y;
                coords.x = nullCoords.x - 1;
            }
            if (hMove && !upLeft) {
                coords.x = nullCoords.x;
                coords.y = nullCoords.y + 1;
            }
            if (!hMove && upLeft) {
                coords.y = nullCoords.y;
                coords.x = nullCoords.x + 1;
            }
            if (hMove && upLeft) {
                coords.x = nullCoords.x;
                coords.y = nullCoords.y - 1;
            }
            if (0 <= coords.x && coords.x <= (this.size - 1) && 0 <= coords.y && coords.y <= (this.size - 1)) {
                this.move(coords.x, coords.y);
            }
        }
        this.clicks = 0;
    };
    ;
    return Puzzle;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Puzzle;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rules_1 = __webpack_require__(4);
var RulesManhattanDistance = (function (_super) {
    __extends(RulesManhattanDistance, _super);
    function RulesManhattanDistance(size, terminateState) {
        return _super.call(this, size, terminateState) || this;
    }
    RulesManhattanDistance.prototype.getH = function (state) {
        var result = 0;
        var currentLine = 0;
        var currPos;
        var goalPos;
        for (var i = 0; i < this.arraySize; i++) {
            currentLine = Math.ceil((i + 1) / this.size);
            if (state.getField()[i] != this.terminateState[i]) {
                currPos = [currentLine, (i + 1) - (currentLine - 1) * this.size];
                var indexInTerminate = this.terminateState.indexOf(state.getField()[i]) + 1;
                goalPos = [Math.ceil(indexInTerminate / this.size), indexInTerminate - (Math.ceil(indexInTerminate / this.size) - 1) * this.size];
                result += Math.abs(currPos[0] - goalPos[0]) + Math.abs(currPos[1] - goalPos[1]);
            }
        }
        return result;
    };
    return RulesManhattanDistance;
}(Rules_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RulesManhattanDistance;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var State_1 = __webpack_require__(0);
var Rules = (function () {
    function Rules(size, terminateState) {
        this.left = -1;
        this.right = 1;
        if (size < 2)
            throw Error("Invalid field size.");
        if (terminateState == null)
            throw Error("Terminate state can't be null");
        this.size = size;
        this.arraySize = size * size;
        if (terminateState.length != this.arraySize)
            throw Error("Size of terminate state is incorrect.");
        this.terminateState = terminateState;
        this.top = -size;
        this.bottom = size;
        this.actions = [this.top, this.bottom, this.left, this.right];
    }
    Rules.prototype.getNeighbors = function (currentState) {
        var result = [];
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            var field = this.doAction(currentState.getField(), action);
            if (field == null) {
                continue;
            }
            var state = new State_1.default(currentState, this.size);
            state.setField(field);
            result.push(state);
        }
        return result;
    };
    Rules.prototype.doAction = function (field, action) {
        var indexZero;
        for (indexZero = 0; indexZero < field.length; indexZero++) {
            if (field[indexZero] == 0) {
                break;
            }
            if (indexZero >= field.length) {
                return null;
            }
        }
        var indexTransferPuzz = indexZero + action;
        if (indexTransferPuzz < 0 || indexTransferPuzz >= field.length) {
            return null;
        }
        if ((action == 1) && ((indexZero + 1) % this.size == 0)) {
            return null;
        }
        if ((action == -1) && ((indexZero + 1) % this.size == 1)) {
            return null;
        }
        var newField = field.slice();
        var temp = newField[indexZero];
        newField[indexZero] = newField[indexTransferPuzz];
        newField[indexTransferPuzz] = temp;
        return newField;
    };
    Rules.prototype.getDistance = function (a, b) {
        var temp = b;
        var result = 0;
        while ((temp != null) && (!temp.equals(a))) {
            temp = temp.getParent();
            result++;
        }
        return result;
    };
    Rules.prototype.getH = function (state) {
        var result = 0;
        for (var i = 0; i < this.arraySize; i++) {
            if (state.getField()[i] != this.terminateState[i])
                result++;
        }
        return result;
    };
    Rules.prototype.isTerminate = function (state) {
        return JSON.stringify(state.getField()) == JSON.stringify(this.terminateState);
    };
    Rules.prototype.getTerminateState = function () {
        return this.terminateState;
    };
    Rules.prototype.getActions = function () {
        return this.actions;
    };
    return Rules;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rules;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Astar_1 = __webpack_require__(1);
var State_1 = __webpack_require__(0);
var RulesManhattanDistance_1 = __webpack_require__(3);
var Puzzle_1 = __webpack_require__(2);
// const startField: Array<number> = [2,6,4,8,1,13,7,3,5,11,12,15,0,10,9,14];
var terminateField = [1, 2, 3, 4, 5, 6, 7, 8, 0];
var startField = [11, 10, 6, 2, 13, 7, 4, 0, 9, 14, 15, 5, 1, 12, 8, 3];
/*const startField: Array<number> = [1,0,2,3,5,6,7,4,9,10,11,8,13,14,15,12];
*/
/*const terminateField: Array<number> = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];*/
var puzzle;
window.onload = function () {
    var canvas = document.getElementById("puzzle");
    puzzle = new Puzzle_1.default(canvas, 3);
    var solveButton = document.getElementById("solve");
    var resetButton = document.getElementById("reset");
    var size = 3;
    var actions = [];
    /*let arraySize = size * size;*/
    var interval;
    solveButton.onclick = function (e) {
        var rules = new RulesManhattanDistance_1.default(size, terminateField);
        var startState = new State_1.default(null, size);
        //console.log(puzzle.getField());
        startState.setField(puzzle.getField() /*startField*/);
        console.time("Time A-Star");
        var astar = new Astar_1.default(rules);
        var result = astar.search(startState);
        console.timeEnd("Time A-Star");
        if (result == null)
            console.log("Solution not found");
        else
            console.log(result);
        actions = [];
        iter = 0;
        for (var i = 0; i < result.length - 1; i++) {
            actions.push(getAction(result[i].getField(), result[i + 1].getField(), size));
        }
        interval = setInterval(doAction, 500);
    };
    resetButton.onclick = function (e) {
        puzzle.resetPuzzle();
    };
    var radioButton = document.querySelectorAll("input[name=group1]");
    radioButton[0].onchange = function (e) {
        size = 3;
        terminateField = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        puzzle = new Puzzle_1.default(canvas, 3);
    };
    radioButton[1].onchange = function (e) {
        size = 4;
        terminateField = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
        puzzle = new Puzzle_1.default(canvas, 4);
    };
    var iter;
    function doAction() {
        if (iter == actions.length) {
            clearInterval(interval);
            return;
        }
        puzzle.doAction(actions[iter++]);
    }
    function getNullPos(field, size) {
        var currIndex;
        for (var i = 0; i < field.length; i++) {
            if (field[i] == 0) {
                currIndex = i + 1;
                break;
            }
        }
        var currLine = Math.ceil(currIndex / size) - 1;
        var currCol = currIndex - (currLine * size);
        return { x: currLine, y: currCol };
    }
    function getAction(a, b, size) {
        var coordsA = getNullPos(a, size);
        var coordsB = getNullPos(b, size);
        var action = (coordsA.x - coordsB.x) > 0 ? 'Top' : (coordsA.x - coordsB.x) < 0 ? 'Bottom' : null;
        if (action == null)
            action = (coordsA.y - coordsB.y) < 0 ? 'Right' : (coordsA.y - coordsB.y) > 0 ? 'Left' : null;
        return action;
    }
};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map