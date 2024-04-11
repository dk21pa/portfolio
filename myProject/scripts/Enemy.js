'use strict';
import { pi2, sin, cos, getRainbowCode } from './game.js';
const r = n => Math.round(n * 100) / 100;

export class Enemy {
    constructor(x, y, direction, color = '#F00') {
        this.x = x;
        this.y = y;
        this.direction = direction; //進行方向の角度
        this.color = color;
        this.rpm = 30;
        this.moveSpeed = 6;
        //オブジェクトの移動制御のための配列
        this.modeList = ['move'];
        this.element = document.createElement('div');
        this.element.style.backgroundColor = color;
        this.update();
    }

    move(speed = this.moveSpeed) {
        this.x += cos(this.direction) * speed;
        this.y += sin(this.direction) * speed;
    }

    spin() {
        //60fpsに対してrpm回転/分
        this.angle += pi2 * this.rpm / 3600;
    }

    delete() {
        this.modeList.push('delete');
        this.element.remove();
    }

    update() {
        if (this.modeList.includes('stay')) {
            return;
        } else if (this.modeList.includes('shrink')) {
            this.shrink();
        } else if (this.modeList.includes('extend')) {
            this.extend();
        } else if (this.modeList.includes('move')) {
            this.move();
        }
        if (this.modeList.includes('spin')) {
            this.spin();
        }
        if (this.modeList.includes('revolveLaser')) {
            this.revolveLaser();
        }
    }
}

export class Bullet extends Enemy {
    constructor(x, y, direction, color = '#FFF') {
        super(x, y, direction, color);
        this.size = 10;

        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.classList.add('bullet');
    }
    update() {
        this.move();
        this.element.style.left = this.x - this.size / 2 + 'px';
        this.element.style.top = this.y - this.size / 2 + 'px';
    }
}

export class Laser extends Enemy {
    constructor(x, y, direction, color) {
        super(x, y, direction, color);

        this.element.classList.add('laser');
        this.length = 3;
        this.targetLength = 100;
        //レーザーの傾き。進行方向とは別に回転するとき用。
        this.angle = direction;
        this.modeList = ['extend'];
        //すり抜け判定のためのフラグ
        this.side = 0;
        this.preside = 0;
    }

    update() {
        super.update();
        this.element.style.left = this.x - this.length / 2 + 'px';
        this.element.style.top = this.y - 1.5 + 'px';
        this.element.style.width = `${this.length}px`
        this.element.style.transform = `rotate(${this.angle * 360 / pi2}deg)`;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    extend(targetLength = this.targetLength) {
        if (targetLength !== this.targetLength) {
            //新規セットの時
            this.modeList = this.modeList.filter(mode => mode !== 'shrink');
            this.modeList.push('extend');
            this.targetLength = targetLength;
            return;
        }
        if (this.length > this.targetLength) {
            this.modeList = this.modeList.filter(mode => mode !== 'extend');
            return;
        }
        this.length += this.moveSpeed;
        this.move(this.moveSpeed / 2);
    }

    shrink(targetLength = this.targetLength) {
        if (targetLength !== this.targetLength) {
            //新規セットの時
            this.modeList = this.modeList.filter(mode => mode !== 'expand');
            this.modeList.push('shrink');
            this.targetLength = targetLength;
            return;
        }

        if (this.length - this.moveSpeed < 0) {
            this.delete();
            return;
        }
        if (this.length < this.targetLength) {
            this.modeList = this.modeList.filter(mode => mode !== 'shrink');
            return;
        }
        this.length -= this.moveSpeed;
        this.move(this.moveSpeed / 2);
    }
}

export class Matter extends Enemy {
    constructor(x, y, radius, vertexCount, color) {
        super(x, y, 0, color);
        this.radius = radius;
        this.vartexCount = this.vartexCount;
        this.angle = 0;
        this.rpm = 10;
        this.modeList = ['spin'];
        this.laserList = [];

        this.element.style.width = radius * 2 + 'px';
        this.element.style.height = radius * 2 + 'px';
        this.element.classList.add('matter');
        this.setShape(vertexCount);
        this.setColor(0);
    }

    update() {
        this.element.style.left = this.x - this.radius + 'px';
        this.element.style.top = this.y - this.radius + 'px';
        this.element.style.transform = `rotate(${this.angle * 360 / pi2}deg)`;
        super.update();
    }

    setShape(n) {
        this.vartexCount = n;
        //クリップパス数: パス数が違うとcssのtransitionが効かないから揃える
        //20角形より上は使わないだろうからとりあえずこれで
        const pathCount = Math.max(n, 20);
        let clipPath = '';
        for (let i = 0; i < pathCount; i++) {
            const newI = Math.ceil(i * n / pathCount);
            const angle = pi2 * newI / n;
            //正n角形の頂点の座標(％)
            const x = 50 * (1 + cos(angle));
            const y = 50 * (1 + sin(angle));
            //正n角形の頂点の間(へこんでる部分)の座標（％）
            const ratio = cos(pi2 / n) / cos(pi2 / n / 2);
            const x1 = 50 * (1 + ratio * cos(angle + pi2 / n / 2));
            const y1 = 50 * (1 + ratio * sin(angle + pi2 / n / 2));
            clipPath += `${r(x)}% ${r(y)}%, ${r(x1)}% ${r(y1)}%`;
            if (i !== pathCount - 1) {
                clipPath += ', ';
            }
        }
        this.element.style.clipPath = `polygon(${clipPath})`;
    }

    setColor(n) {
        this.color = getRainbowCode(n);
        const centerColor = getRainbowCode(n + 0.8);
        this.element.style.background = `radial-gradient(circle at center, ${centerColor} 20%, ${this.color} 80%)`;
    }

    shootLaser(container, targetLength) {
        targetLength = 100;
        this.rpm = 10;
        for (let i = 0; i < this.vartexCount; i++) {
            const angle = this.angle + pi2 * i / this.vartexCount;
            const x = this.x + this.radius * cos(angle) * 0.8;
            const y = this.y + this.radius * sin(angle) * 0.8;
            const laser = new Laser(x, y, angle, this.color);
            laser.rpm = this.rpm;
            laser.modeList = ['spin', 'extend'];
            laser.targetLength = targetLength;
            container.appendChild(laser.element);
            this.laserList.push(laser);
        }
        this.modeList.push('revolveLaser');
        return this.laserList;
    }

    revolveLaser() {
        const laserX = this.laserList[0].x;
        const laserY = this.laserList[0].y;
        const radius = Math.sqrt((laserX - this.x) ** 2 + (laserY - this.y) ** 2);
        for (let i = 0; i < this.laserList.length; i++) {
            const x = this.x + radius * cos(this.angle + pi2 * i / this.laserList.length);
            const y = this.y + radius * sin(this.angle + pi2 * i / this.laserList.length);
            const laser = this.laserList[i];
            laser.setPosition(x, y);
        }
    }
}