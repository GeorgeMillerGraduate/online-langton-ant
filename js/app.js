$(document).ready(function () {

    // --------------------------------------------------
    // CONFIGURATION
    // --------------------------------------------------

    const WORLD_WIDTH = 120;
    const WORLD_HEIGHT = 80;
    const DEFAULT_RULE = "LR";
    const DEFAULT_CELL_SIZE = 8;
    const DEFAULT_SPEED = 20;


    // --------------------------------------------------
    // DOM ELEMENTS
    // --------------------------------------------------

    const canvas = document.getElementById("antCanvas");

    const startButton = $("#startButton");
    const pauseButton = $("#pauseButton");
    const stepButton = $("#stepButton");
    const resetButton = $("#resetButton");
    const clearButton = $("#clearButton");

    const ruleInput = $("#ruleInput");
    const applyRuleButton = $("#applyRuleButton");

    const speedInput = $("#speedInput");
    const speedValue = $("#speedValue");

    const cellSizeInput = $("#cellSizeInput");
    const cellSizeValue = $("#cellSizeValue");

    const gridCheckbox = $("#gridCheckbox");

    const stepCounter = $("#stepCounter");
    const directionDisplay = $("#directionDisplay");
    const ruleDisplay = $("#ruleDisplay");


    // --------------------------------------------------
    // CREATE SIMULATION
    // --------------------------------------------------

    let world = new AntWorld(
        WORLD_WIDTH,
        WORLD_HEIGHT,
        DEFAULT_RULE
    );

    let renderer = new BoardRenderer(
        canvas,
        world,
        DEFAULT_CELL_SIZE
    );


    // --------------------------------------------------
    // ANIMATION STATE
    // --------------------------------------------------

    let running = false;

    let stepsPerFrame = DEFAULT_SPEED;

    let animationFrameId = null;


    // --------------------------------------------------
    // INITIAL DISPLAY
    // --------------------------------------------------

    ruleInput.val(DEFAULT_RULE);

    speedInput.val(DEFAULT_SPEED);
    speedValue.text(DEFAULT_SPEED);

    cellSizeInput.val(DEFAULT_CELL_SIZE);
    cellSizeValue.text(DEFAULT_CELL_SIZE);

    renderer.render();

    updateDisplay();


    // --------------------------------------------------
    // ANIMATION LOOP
    // --------------------------------------------------

    function animationLoop() {

        if (!running) {
            return;
        }

        for (let i = 0; i < stepsPerFrame; i++) {
            world.step();
        }

        renderer.render();

        updateDisplay();

        animationFrameId =
            requestAnimationFrame(animationLoop);
    }


    // --------------------------------------------------
    // START
    // --------------------------------------------------

    startButton.on("click", function () {

        if (running) {
            return;
        }

        running = true;

        updateButtonStates();

        animationFrameId =
            requestAnimationFrame(animationLoop);
    });


    // --------------------------------------------------
    // PAUSE
    // --------------------------------------------------

    pauseButton.on("click", function () {

        running = false;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        updateButtonStates();
    });


    // --------------------------------------------------
    // SINGLE STEP
    // --------------------------------------------------

    stepButton.on("click", function () {

        if (running) {
            return;
        }

        world.step();

        renderer.render();

        updateDisplay();
    });


    // --------------------------------------------------
    // RESET
    // --------------------------------------------------

    resetButton.on("click", function () {

        stopSimulation();

        world.reset();

        renderer.render();

        updateDisplay();
    });


    // --------------------------------------------------
    // CLEAR
    // --------------------------------------------------

    clearButton.on("click", function () {

        stopSimulation();

        world.clearGrid();

        world.getAnt().reset(
            Math.floor(world.getWidth() / 2),
            Math.floor(world.getHeight() / 2),
            "N"
        );

        world.steps = 0;

        renderer.render();

        updateDisplay();
    });


    // --------------------------------------------------
    // APPLY RULE
    // --------------------------------------------------

    applyRuleButton.on("click", function () {
        applyRule();
    });


    ruleInput.on("keydown", function (event) {

        if (event.key === "Enter") {
            applyRule();
        }
    });


    function applyRule() {

        let rule = ruleInput.val()
            .toUpperCase()
            .trim();

        if (rule.length === 0) {
            rule = DEFAULT_RULE;
        }

        /*
         * Only L and R are currently supported.
         */

        if (!/^[LR]+$/.test(rule)) {

            ruleInput.addClass("invalid");

            return;
        }

        ruleInput.removeClass("invalid");

        stopSimulation();

        world.setRule(rule);

        ruleInput.val(world.getRule());

        renderer.render();

        updateDisplay();

        updateLegend();
    }


    // --------------------------------------------------
    // SPEED
    // --------------------------------------------------

    speedInput.on("input", function () {

        stepsPerFrame =
            parseInt($(this).val());

        if (
            Number.isNaN(stepsPerFrame) ||
            stepsPerFrame < 1
        ) {
            stepsPerFrame = 1;
        }

        speedValue.text(stepsPerFrame);
    });


    // --------------------------------------------------
    // CELL SIZE / ZOOM
    // --------------------------------------------------

    cellSizeInput.on("input", function () {

        let size =
            parseInt($(this).val());

        if (Number.isNaN(size)) {
            return;
        }

        renderer.setCellSize(size);

        cellSizeValue.text(size);
    });


    // --------------------------------------------------
    // GRID TOGGLE
    // --------------------------------------------------

    gridCheckbox.on("change", function () {

        renderer.setShowGrid(
            $(this).is(":checked")
        );
    });


    // --------------------------------------------------
    // CANVAS EDITING
    // --------------------------------------------------

    $(canvas).on("click", function (event) {

        if (running) {
            return;
        }

        const cell =
            renderer.getCellFromMouse(event);

        if (cell === null) {
            return;
        }

        world.cycleCell(
            cell.x,
            cell.y
        );

        renderer.render();
    });


    // --------------------------------------------------
    // RIGHT CLICK - MOVE ANT
    // --------------------------------------------------

    $(canvas).on("contextmenu", function (event) {

        event.preventDefault();

        if (running) {
            return;
        }

        const cell =
            renderer.getCellFromMouse(event);

        if (cell === null) {
            return;
        }

        world.getAnt().setPosition(
            cell.x,
            cell.y
        );

        renderer.render();

        updateDisplay();
    });


    // --------------------------------------------------
    // KEYBOARD CONTROLS
    // --------------------------------------------------

    $(document).on("keydown", function (event) {

        /*
         * Don't trigger keyboard shortcuts while
         * typing into an input field.
         */

        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
        ) {
            return;
        }


        // SPACE = Start / Pause

        if (event.code === "Space") {

            event.preventDefault();

            if (running) {
                pauseButton.trigger("click");
            } else {
                startButton.trigger("click");
            }
        }


        // S = Single step

        if (
            event.key === "s" ||
            event.key === "S"
        ) {
            stepButton.trigger("click");
        }


        // R = Reset

        if (
            event.key === "r" ||
            event.key === "R"
        ) {
            resetButton.trigger("click");
        }
    });


    // --------------------------------------------------
    // STOP
    // --------------------------------------------------

    function stopSimulation() {

        running = false;

        if (animationFrameId !== null) {

            cancelAnimationFrame(
                animationFrameId
            );

            animationFrameId = null;
        }

        updateButtonStates();
    }


    // --------------------------------------------------
    // DISPLAY
    // --------------------------------------------------

    function updateDisplay() {

        stepCounter.text(
            world.getSteps().toLocaleString()
        );

        directionDisplay.text(
            world.getAnt().getDirection()
        );

        ruleDisplay.text(
            world.getRule()
        );
    }


    // --------------------------------------------------
    // BUTTON STATES
    // --------------------------------------------------

    function updateButtonStates() {

        startButton.prop(
            "disabled",
            running
        );

        pauseButton.prop(
            "disabled",
            !running
        );

        stepButton.prop(
            "disabled",
            running
        );
    }


    // --------------------------------------------------
    // STATE LEGEND
    // --------------------------------------------------

    function updateLegend() {

        const legend =
            $("#stateLegend");

        legend.empty();

        const rule =
            world.getRule();

        for (
            let state = 0;
            state < rule.length;
            state++
        ) {

            const item =
                $("<div>")
                    .addClass("legend-item");

            const color =
                $("<span>")
                    .addClass("legend-color")
                    .css(
                        "background-color",
                        renderer.getStateColor(state)
                    );

            const text =
                $("<span>")
                    .text(
                        "State " +
                        state +
                        " — Turn " +
                        (rule[state] === "L"
                            ? "Left"
                            : "Right")
                    );

            item.append(color);
            item.append(text);

            legend.append(item);
        }
    }


    // --------------------------------------------------
    // INITIAL UI STATE
    // --------------------------------------------------

    updateButtonStates();
    updateLegend();

});