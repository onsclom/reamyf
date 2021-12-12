// @ts-check

const tableExprRegex = /^(\w+)\[(\w+)\]$/;

/*
To run easyLang code:
1. run through the code and save all the headers with their corresponding line number in nameToHeaderLine
2. start parsing instructions one by one until at end of file or time out? (TODO: check for timeout)
3. start an animation loop starting on the "@ ANIMATION_LOOP"
*/

class easyLang {
  constructor() {
    /** @type {Array.<Array.<string>>} */
    this.lines = [];
    /** @type {number} */
    this.instructionPointer = 0;
    /** @type {Object.<string, number>} */
    this.nameToHeaderLine = {};
    /** @type {easyLangStdLib} */
    this.standardLib = new easyLangStdLib(this);
    /** @type {Object.<any,number>} */
    this.tables = {};
    /** @type {Object.<any,number>} */
    this.vars = {};
    /** @type {CanvasRenderingContext2D} */
    this.ctx;
    /** @type {boolean} */
    this.error = false;
  }

  /**
   * Runs script by drawing to ctx
   * @param {string} inputScript
   * @param {CanvasRenderingContext2D} ctx
   */
  run(inputScript, ctx) {
    this.ctx = ctx;
    this.setup(inputScript);
    this.executeCode(0);
  }

  /**
   *
   * @param {number} startLine
   */
  executeCode(startLine) {
    //run code line by line until reaching EOF
    this.instructionPointer = startLine;
    while (this.instructionPointer < this.lines.length && this.error == false) {
      let curLine = this.lines[this.instructionPointer];
      if (curLine.length != 0 && curLine[0] != "" && curLine[0] != "#" && curLine[0] != "@") {
        this.executeInstruction(curLine);
      }
      this.instructionPointer += 1;
    }
  }

  runAnimationFrame() {
    this.executeCode(this.nameToHeaderLine["ANIMATION_LOOP"]);
  }

  /**
   * Executes a single function call
   * @param {Array.<string>} curLine
   */
  executeInstruction(curLine) {
    let command = curLine[0];
    if (this.standardLib[command] != null) {
      this.standardLib[command](curLine);
    } else {
      this.sendError(`Unrecognized command "${command}"`);
    }
  }

  /**
   * Sets up data structures
   * @param {string} inputScript
   */
  setup(inputScript) {
    this.lines = []
    this.lines = inputScript.split("\n").map((line) => (line.trim()).split(" "));
    // setup the headers
    for (
      this.instructionPointer = 0;
      this.instructionPointer < this.lines.length;
      this.instructionPointer += 1
    ) {
      if (this.lines[this.instructionPointer].length==0) continue;
      const instructionParts = this.lines[this.instructionPointer];
      if (instructionParts[0] != "@") continue;
      if (instructionParts.length != 2)
        this.sendError("@ should only have 1 argument.");
      this.nameToHeaderLine[instructionParts[1]] = this.instructionPointer;
    }
    // done with file
    this.ctx.imageSmoothingEnabled = true;
  }

  /**
   * Send error to console
   * @param {string} errorMessage
   */
  sendError(errorMessage) {
    this.error = true;
    // TODO: setup actual console system
    console.error(
      `Error on line ${this.instructionPointer + 1}: ${errorMessage}`
    );
  }
  /**
   *
   * @param {string} valueString
   * @returns {number}
   */
  getValue(valueString) {
    if (this.vars[valueString] != null) {
      return Number(this.vars[valueString]);
    } else {
      return Number(valueString);
    }
  }
}

class easyLangStdLib {
  /**
   *
   * @param {easyLang} core
   */
  constructor(core) {
    this.core = core;
  }

  varset(parts) {
    if (parts.length != 3) {
      this.core.sendError("var takes 2 args");
      return;
    }

    let result = this.core.getValue(parts[2]);
    this.core.vars[parts[1]] = result;
  }

  list(parts) {
    if (parts.length != 2) {
      this.core.sendError("list takes 1 arg");
      return;
    }
    this.core.tables[parts[1]] = {};
  }

  rand(parts) {
    if (parts.length != 4) {
      this.core.sendError(`rand takes 3 arguments`);
      return;
    }
    const randMin = this.core.getValue(parts[2]);
    const randMax = this.core.getValue(parts[3]);
    let randNum = Math.random() * (randMax - randMin) + randMin;

    let found = parts[1].match(tableExprRegex);
    if (found) {
      this.core.tables[found[1]][found[2]] = randNum;
    } else {
      this.core.vars[parts[1]] = randNum;
    }
  }

  push(parts) {
    if (parts.length != 3) {
      this.core.sendError(`push takes 2 args`);
      return;
    }

    let tableName = parts[1];
    let index = Object.keys(this.core.tables[parts[1]]).length;
    this.core.tables[tableName][index] = this.core.getValue(parts[2]);
  }

  add(parts) {
    if (parts.length != 3) {
      this.core.sendError(`add takes 2 args`);
      return;
    }

    let value = this.core.getValue(parts[2]);
    let found = parts[1].match(tableExprRegex);
    if (found) {
      this.core.tables[found[1]][found[2]] += value;
    } else {
      this.core.vars[parts[1]] += value;
    }
  }

  jumpif(parts) {
    if (parts.length != 5) {
      this.core.sendError(`jumpif takes 5 args`);
      return;
    }

    const value1 = this.core.getValue(parts[1]);
    const value2 = this.core.getValue(parts[3]);

    const compareChar = parts[2];
    let evalString = `${value1} ${compareChar} ${value2}`;
    if (eval(evalString)) {
      this.core.instructionPointer = this.core.nameToHeaderLine[parts[4]];
    }
  }

  clrsc(parts) {
    this.core.ctx.fillStyle = "black";
    this.core.ctx.fillRect(0, 0, 200, 200);
  }

  round(parts) {
    let value = this.core.getValue(parts[1]);

    let found = parts[1].match(tableExprRegex);
    if (found) {
      this.core.tables[found[1]][found[2]] = Math.round(value);
    } else {
      this.core.vars[parts[1]] = Math.round(value);
    }
  }

  mod(parts) {
    let value = this.core.getValue(parts[2]);

    let found = parts[1].match(tableExprRegex);
    if (found) {
      this.core.tables[found[1]][found[2]] %= value;
    } else {
      this.core.vars[parts[1]] %= value;
    }
  }

  pixel(parts) {
    let x = this.core.getValue(parts[1]);
    let y = this.core.getValue(parts[2]);
    this.core.ctx.fillStyle = "white";
    this.core.ctx.fillRect(x, y, 1, 1);
  }

  l2v(parts) {
    let tableName = parts[1];
    let index = this.core.getValue(parts[2]);
    let variableName = parts[3];
    this.core.vars[variableName] = this.core.tables[tableName][index];
  }

  v2l(parts) {
    let variableName = parts[1];
    let tableName = parts[2];
    let index = this.core.getValue(parts[3]);
    this.core.tables[tableName][index] = this.core.getValue(variableName);
  }

  
  line(parts) {
    let x1 = this.core.getValue(parts[1]);
    let y1 = this.core.getValue(parts[2]);
    let x2 = this.core.getValue(parts[3]);
    let y2 = this.core.getValue(parts[4]);
    ctx.beginPath();
    this.core.ctx.moveTo(x1,y1)
    this.core.ctx.lineTo(x2,y2);
    this.core.ctx.strokeStyle = "white";
    ctx.stroke()
  }
}

let EasyLang = new easyLang();
