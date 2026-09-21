class BoardRenderer {

    constructor(canvas, world, cellSize = 8) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.world = world;
        this.cellSize = cellSize;

        this.showGrid = true;

        this.stateColors = [
            "#111827",
            "#f8fafc",
            "#38bdf8",
            "#f472b6",
            "#facc15",
            "#4ade80",
            "#a78bfa",
            "#fb923c"
        ];

        this.antColor = "#ef4444";

        this.resizeCanvas();
    }


    // --------------------------------------------------
    // CANVAS
    // --------------------------------------------------

    resizeCanvas() {
        this.canvas.width =
            this.world.getWidth() * this.cellSize;

        this.canvas.height =
            this.world.getHeight() * this.cellSize;
    }


    setCellSize(size) {
        this.cellSize = Math.max(1, size);

        this.resizeCanvas();
        this.render();
    }


    // --------------------------------------------------
    // MAIN RENDER
    // --------------------------------------------------

    render() {
        this.clear();

        this.drawCells();

        if (this.showGrid && this.cellSize >= 5) {
            this.drawGrid();
        }

        this.drawAnt();
    }


    clear() {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    // --------------------------------------------------
    // CELLS
    // --------------------------------------------------

    drawCells() {
        const grid = this.world.getGrid();

        for (let y = 0; y < this.world.getHeight(); y++) {

            for (let x = 0; x < this.world.getWidth(); x++) {

                const state = grid[y][x];

                this.context.fillStyle =
                    this.getStateColor(state);

                this.context.fillRect(
                    x * this.cellSize,
                    y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }


    getStateColor(state) {

        if (state < this.stateColors.length) {
            return this.stateColors[state];
        }

        /*
         * Generate colours automatically if the rule
         * contains more states than our predefined palette.
         */

        const hue = (state * 137.508) % 360;

        return `hsl(${hue}, 70%, 55%)`;
    }


    // --------------------------------------------------
    // GRID LINES
    // --------------------------------------------------

    drawGrid() {
        const ctx = this.context;

        ctx.beginPath();

        ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = 1;

        for (
            let x = 0;
            x <= this.canvas.width;
            x += this.cellSize
        ) {
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.canvas.height);
        }

        for (
            let y = 0;
            y <= this.canvas.height;
            y += this.cellSize
        ) {
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.canvas.width, y + 0.5);
        }

        ctx.stroke();
    }


    // --------------------------------------------------
    // ANT
    // --------------------------------------------------

    drawAnt() {
        const ant = this.world.getAnt();

        const centerX =
            ant.getX() * this.cellSize +
            this.cellSize / 2;

        const centerY =
            ant.getY() * this.cellSize +
            this.cellSize / 2;

        /*
         * At very small cell sizes an arrow becomes
         * difficult to see, so just draw a solid square.
         */

        if (this.cellSize < 5) {

            this.context.fillStyle = this.antColor;

            this.context.fillRect(
                ant.getX() * this.cellSize,
                ant.getY() * this.cellSize,
                this.cellSize,
                this.cellSize
            );

            return;
        }

        this.drawAntArrow(
            centerX,
            centerY,
            ant.getDirection()
        );
    }


    drawAntArrow(centerX, centerY, direction) {
        const ctx = this.context;

        const size = this.cellSize * 0.42;

        ctx.save();

        ctx.translate(centerX, centerY);

        /*
         * Arrow is initially drawn pointing north.
         * Rotate it for the ant's current direction.
         */

        switch (direction) {

            case "E":
                ctx.rotate(Math.PI / 2);
                break;

            case "S":
                ctx.rotate(Math.PI);
                break;

            case "W":
                ctx.rotate(-Math.PI / 2);
                break;
        }

        ctx.beginPath();

        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.75, size);
        ctx.lineTo(0, size * 0.55);
        ctx.lineTo(-size * 0.75, size);

        ctx.closePath();

        ctx.fillStyle = this.antColor;
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = Math.max(
            1,
            this.cellSize * 0.08
        );

        ctx.stroke();

        ctx.restore();
    }


    // --------------------------------------------------
    // MOUSE POSITION
    // --------------------------------------------------

    getCellFromMouse(event) {

        const rect =
            this.canvas.getBoundingClientRect();

        const scaleX =
            this.canvas.width / rect.width;

        const scaleY =
            this.canvas.height / rect.height;

        const mouseX =
            (event.clientX - rect.left) * scaleX;

        const mouseY =
            (event.clientY - rect.top) * scaleY;

        const x =
            Math.floor(mouseX / this.cellSize);

        const y =
            Math.floor(mouseY / this.cellSize);

        if (!this.world.isInsideWorld(x, y)) {
            return null;
        }

        return { x, y };
    }


    // --------------------------------------------------
    // DISPLAY OPTIONS
    // --------------------------------------------------

    setShowGrid(show) {
        this.showGrid = show;
        this.render();
    }


    setStateColors(colors) {
        this.stateColors = colors;
        this.render();
    }


    setAntColor(color) {
        this.antColor = color;
        this.render();
    }
}