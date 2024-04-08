'use strict';

const pi2 = 2 * Math.PI;
const sin = (a) => Math.sin(a);
const cos = (a) => Math.cos(a);

class Laser {
    constructor(container, x, y, angle, color = '#f00') {
        this.x = x;
        this.y = y;
        this.width = 3;
        this.angle = angle;
        this.color = color;
        this.speed = 6;
        this.available = true;
        //すり抜け判定のためのフラグ
        this.side = 0;
        this.preside = 0;

        this.element = document.createElement('div');
        this.element.classList.add('laser');
        this.element.style.backgroundColor = this.color;
        this.element.style.transformOrigin = 'center'
        container.appendChild(this.element);
        this.update();
    }

    //レーザー更新
    update() {
        this.element.style.left = this.x - this.width / 2 + 'px';
        this.element.style.top = this.y - 1.5 + 'px';
        this.element.style.width = `${this.width}px`
        this.element.style.transform = `rotate(${this.angle * 360 / pi2}deg)`;
    }

    move(angle = this.angle, speed = this.speed) {
        this.x += cos(angle) * speed;
        this.y += sin(angle) * speed;
    }

    spin(rotateSpeed = 1) {
        this.angle += pi2 * rotateSpeed / 36;
    }

    expand() {
        this.width += this.speed;
        this.x += cos(this.angle) * this.speed / 2;
        this.y += sin(this.angle) * this.speed / 2;
    }

    shrink() {
        if (this.width - this.speed < 0) {
            this.delete();
            return;
        }
        this.width -= this.speed;
        this.move(this.angle, this.speed / 2);
    }

    delete() {
        this.element.remove();
    }

}
export default Laser;