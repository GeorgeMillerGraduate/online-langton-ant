class AntWorld {

    constructor(width, height, rule = "LR") {
        this.width = width;
        this.height = height;

        this.rule = this.validateRule(rule);

        this.grid = this.createGrid();

        this.startX = Math.floor(width / 2);
        this.startY = Math.floor(height / 2);

        this.ant = new Ant(
            this.startX,
            this.startY,
            "N"
        );

        this.steps = 0;
    }


    // --------------------------------------------------
    // GRID
    // --------------------------------------------------

    createGrid() {
        const grid = [];

        for (let y = 0; y < this.height; y++) {
            const row = [];

            for (let x = 0; x < this.width; x++) {
                row.push(0);
            }

            grid.push(row);
        }

        return grid;
    }


    clearGrid() {
        this.grid = this.createGrid();
    }


    // --------------------------------------------------
    // RULE
    // --------------------------------------------------

    validateRule(rule) {
        rule = rule.toUpperCase().trim();

        if (rule.length === 0) {
            return "LR";
        }

        for (const character of rule) {
            if (character !== "L" && character !== "R") {
                return "LR";
            }
        }

        return rule;
    }


    setRule(rule) {
        this.rule = this.validateRule(rule);

        // Existing cell states might no longer be valid
        // for the new rule, so reset the simulation.
        this.reset();
    }


    getRule() {
        return this.rule;
    }


    getNumberOfStates() {
        return this.rule.length;
    }


    // --------------------------------------------------
    // CELL STATES
    // --------------------------------------------------

    getCell(x, y) {
        if (!this.isInsideWorld(x, y)) {
            return 0;
        }

        return this.grid[y][x];
    }


    setCell(x, y, state) {
        if (!this.isInsideWorld(x, y)) {
            return;
        }

        const numberOfStates = this.getNumberOfStates();

        state = Math.floor(state);

        if (state < 0) {
            state = 0;
        }

        this.grid[y][x] = state % numberOfStates;
    }


    cycleCell(x, y) {
        if (!this.isInsideWorld(x, y)) {
            return;
        }

        const currentState = this.grid[y][x];

        this.grid[y][x] =
            (currentState + 1) % this.getNumberOfStates();
    }


    // --------------------------------------------------
    // SIMULATION
    // --------------------------------------------------

    step() {

        const x = this.ant.getX();
        const y = this.ant.getY();

        // Get the current cell state
        const currentState = this.getCell(x, y);

        // Look up the instruction from the rule.
        //
        // Example:
        //
        // Rule = LRRL
        //
        // State 0 -> L
        // State 1 -> R
        // State 2 -> R
        // State 3 -> L

        const instruction = this.rule[currentState];

        // Turn the ant
        this.ant.turn(instruction);

        // Advance the cell to its next state
        const nextState =
            (currentState + 1) % this.getNumberOfStates();

        this.setCell(x, y, nextState);

        // Move forward
        this.ant.moveForward();

        // Wrap around the board
        this.wrapAnt();

        this.steps++;
    }


    runSteps(amount) {
        for (let i = 0; i < amount; i++) {
            this.step();
        }
    }


    // --------------------------------------------------
    // WORLD BOUNDARIES
    // --------------------------------------------------

    isInsideWorld(x, y) {
        return (
            x >= 0 &&
            x < this.width &&
            y >= 0 &&
            y < this.height
        );
    }


    wrapAnt() {

        let x = this.ant.getX();
        let y = this.ant.getY();

        if (x < 0) {
            x = this.width - 1;
        }

        if (x >= this.width) {
            x = 0;
        }

        if (y < 0) {
            y = this.height - 1;
        }

        if (y >= this.height) {
            y = 0;
        }

        this.ant.setPosition(x, y);
    }


    // --------------------------------------------------
    // RESET
    // --------------------------------------------------

    reset() {

        this.clearGrid();

        this.ant.reset(
            this.startX,
            this.startY,
            "N"
        );

        this.steps = 0;
    }


    // --------------------------------------------------
    // GETTERS
    // --------------------------------------------------

    getGrid() {
        return this.grid;
    }


    getAnt() {
        return this.ant;
    }


    getWidth() {
        return this.width;
    }


    getHeight() {
        return this.height;
    }


    getSteps() {
        return this.steps;
    }
}