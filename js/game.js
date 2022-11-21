class Drawable {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offsets = {
            x:0,
            y:0
        }
    }
    createElement(){
        this.element = this.stringToHTML('<div class="element ' + this.constructor.name.toLowerCase() +'"'+'></div>');
        $('.elements').append(this.element);
    }
    stringToHTML(str) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.querySelector('.element');
    }
    draw(){
        this.element.style = `
        left: ${this.x}px;
        top: ${this.y}px;
        width: ${this.w}px;
        height: ${this.h}px;
        `;
    }
    update(){
        this.x += this.offsets.x;
        this.y += this.offsets.y;
    }

    removeElement(){
        this.element.remove();
    }

    isCollision(element){
        let a = {
            x1: this.x,
            x2: this.x + this.w,
            y1: this.y,
            y2: this.y + this.h
        };
        let b = {
            x1: element.x,
            x2: element.x + element.w,
            y1: element.y,
            y2: element.y + element.h
        };
        return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    }
}
class Fruits extends Drawable {
    constructor(game) {
        super(game);
        this.w = 70;
        this.h = 70;
        this.x = random(0, window.innerWidth - this.w);
        this.y = 60;
        this.offsets.x = 3; //awd adawdaawd aw
        this.createElement();
    }
    update() {
        if(this.isCollision(this.game.player) && this.offsets.y > 0) this.takePoint(this.game.element);
        if(this.y > window.innerHeight) this.takeDamage(this.game.element);
        super.update();
    }

    takePoint() {
        if(this.game.remove(this)) {
        this.removeElement();
        this.game.points++;
        }
    }

    takeDamage() {
        if(this.game.remove(this)) {
            this.removeElement();
            this.game.hp--;
            this.game.points--;
        }
    }
}

class Apple extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 7;
    }
}

class Banana extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 7;
    }
}

class Orange extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 7;
    }
}

class Player extends Drawable {
    constructor(game){
        super(game);
        this.w = 244;
        this.h = 109;
        this.x = window.innerWidth / 2 - this.w / 2;
        this.y = window.innerHeight - this.h;
        this.speedPerFrame = 20;
        this.skillTimer = 0;
        this.cdTimer = 0;
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        };
        this.createElement();
        this.bindKeyEvents();
    }

    bindKeyEvents() {
        document.addEventListener('keydown', ev => this.changeKeyStatus(ev.code, true));
        document.addEventListener('keyup', ev => this.changeKeyStatus(ev.code, false));
    }
    changeKeyStatus(code, value) {
        if(code in this.keys) {
            this.keys[code] = value;
        }
    }

    update() {
        if(this.keys.ArrowLeft && this.x > 0) this.offsets.x = -this.speedPerFrame;
        else if(this.keys.ArrowRight && this.x < window.innerWidth - this.w) this.offsets.x= this.speedPerFrame;
        else this.offsets.x = 0;
        if(this.keys.Space && this.cdTimer === 0){
            this.skillTimer++;
            $('#skill').innerHTML = `Time left: ${Math.ceil((240 - this.skillTimer) / 60)}`;
            this.applySkill();
        }
        if(this.skillTimer > 240 || (!this.keys.Space && this.skillTimer > 1)){
            this.cdTimer++;
            $('#skill').innerHTML = `On CD : ${Math.ceil((300 - this.cdTimer) / 60)}`;
            this.keys.Space = false;
        }
        if(this.cdTimer > 300){
            this.cdTimer = 0;
            this.skillTimer = 0;
            $('#skill').innerHTML = 'Ready'
        }
        super.update();
    }

    applySkill() {
        for(let i = 1; i < this.game.elements.length; i++){
            if(this.game.elements[i].x < this.x + (this.w / 2)) this.game.elements[i].x +=15;
            else if(this.game.elements[i].x > this.x + (this.w / 2)) this.game.elements[i].x -=15;
        }
    }
}
class Game {
    constructor() {
        this.name = name;
        this.elements = [];
        this.player = this.generate(Player);
        this.counterForTimer = 0;
        this.fruits = [Apple, Banana, Orange];
        this.points = 0;
        this.hp = 3;
        this.time = {
            m1: 0,
            m2: 0,
            s1: 0,
            s2: 0
        };
        this.ended = false;
        this.pause = false;
        this.keyEvents();

    }
    start(){
        this.loop();
    }
    generate(className){
        let element = new className(this);
        this.elements.push(element);
        return element;
    }

    keyEvents() {
        addEventListener('keydown', e => {
            if (e.key === "Escape") this.pause = !this.pause;
        });
    }

    loop() {
        requestAnimationFrame(() => {
            if(this.pause) {
            this.counterForTimer++;
            if(this.counterForTimer % 60 === 0) {
                this.timer();
                this.randomFruitGenerate();
            }
            if(this.hp < 0){
                this.end();
                $('.pause').style.display = 'none';
            }
            this.updateElements();
            this.setParams();
        } else if(this.pause)
            $('.pause').style.display = 'flex';
            if(!this.ended) this.loop();
        })
    }

    timer() {
        let time = this.time;
        time.s2++;
        if(time.s2 >= 10) {
            time.s2 = 0;
            time.s1++;
        }
        if(time.s1 >= 6) {
            time.s1 = 0;
            time.m2++;
        }
        if(time.m2 >= 10){
            time.m2 = 0;
            time.m1++;
        }
        $('#timer').innerHTML = `${time.m1}${time.m2}:${time.s1}${time.s2}`;
    }

    randomFruitGenerate() {
        let ranFruit = random(0, 2);
        this.generate(this.fruits[ranFruit]);
    }

    updateElements() {
        this.elements.forEach(e => {
            e.update();
            e.draw();
        })
    }

    setParams() {
        let params = ['name', 'points', 'hp'];
        let values = [this.name, this.points, this.hp];

        params.forEach((e, i) => {
            $(`#${e}`).innerHTML = values[i];
        })
    }
    remove(el) {
        let idx = this.elements.indexOf(el);
        if(idx !== -1){
            this.elements.splice(idx, 1);
            return true;
        }
        return false;
    }
    end() {
        this.ended = true;
        let time = this.time;
        $('#timer').innerHTML = "00:00";
        $('#points').innerHTML = "0";
        $('#hp').innerHTML = "3";
        $('#skill').innerHTML = "Ready";
        if((time.s1 >= 1 || time.m2 >=1 || time.m1 >= 1) && this.points >= 10){
            $('#playerName').innerHTML = `Congratulations, ${this.name}!`;
            $('#endTime').innerHTML = `Your time : ${time.m1}${time.m2}:${time.s1}${time.s2}`
            $('#collectedFruits').innerHTML = `Your fruits summary : ${this.points}`;
            $('#congratulation').innerHTML = 'Winner winner';
        } else {
            $('#playerName').innerHTML = `Whoops, ${this.name}`;
            $('#endTime').innerHTML = `Your time : ${time.m1}${time.m2}:${time.s1}${time.s2}`
            $('#collectedFruits').innerHTML = `Your fruits summary : ${this.points}`;
            $('#congratulation').innerHTML = 'You are lost!';
        }
        go('end', 'panel d-flex justify-content-center align-items-center');
    }
}