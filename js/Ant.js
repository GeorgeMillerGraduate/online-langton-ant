class Ant {

    constructor(x, y, direction = "N") {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    turnLeft() {
        const directions = ["N", "W", "S", "E"];
        const index = directions.indexOf(this.direction);

        this.direction = directions[(index + 1) % directions.length];
    }

    turnRight() {
        const directions = ["N", "E", "S", "W"];
        const index = directions.indexOf(this.direction);

        this.direction = directions[(index + 1) % directions.length];
    }

    turn(instruction) {
        if (instruction === "L") {
            this.turnLeft();
        } else if (instruction === "R") {
            this.turnRight();
        }
    }

    moveForward() {
        switch (this.direction) {
            case "N":
                this.y--;
                break;

            case "E":
                this.x++;
                break;

            case "S":
                this.y++;
                break;

            case "W":
                this.x--;
                break;
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setDirection(direction) {
        if (["N", "E", "S", "W"].includes(direction)) {
            this.direction = direction;
        }
    }

    reset(x, y, direction = "N") {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getDirection() {
        return this.direction;
    }
}