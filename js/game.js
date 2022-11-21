class Drawble {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offsets = {
            x: 0,
            y:  0
        }
    }

    createElement(){
        this.element = '<div class="element' + this.constructor.name.toLowerCase() + '"' + '></div>';
        $('.elements').append(this.element);
    }

    draw() {
        this.element.style = `
        left: ${this.x}px;
        top: ${this.y}px;
        width: ${this.w}px;
        height: ${this.h}px;
        `;
    }
}




class Game {
    constructor() {
        this.name = name;
    }
    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => {
            this.setParams();
        })
    }

    setParams () {
        let params = ['name'];
        let values = [this.name];
        params.forEach((e,i) => {
            $(`#${e}`).innerHTML = values[i];
        })
    }

}

