import ajaxToPHP from "./mypage.js";
import Laser from "./laser.js";

const pi2 = 2 * Math.PI;
const sin = (a) => Math.sin(a);
const cos = (a) => Math.cos(a);

const container = document.getElementById("game");
const scoreElement = document.getElementById('score');
const newGameBtn = document.getElementById('newGame');
const ranking = document.getElementById('ranking');

const width = container.offsetWidth;
const height = container.offsetHeight;
const heroSize = 25;
let heroElement;

let heroX = width / 2;
let heroY = (height * 3) / 4;
const bulletSize = 10;
const bulletstartX = width / 2;
const bulletstartY = height / 4;
const bulletSpeed = 6;
let bulletList = [];
let laserList = [];

let startTime;
let score = 0;
let bulletBonus = 0;
let laserBonus = 0;

let recordNumber;
let gameover = true;

//数字をカラーコードに変換
function getRainbowCode(ratio) {
    //startから
    function grad(ratio, start, up = true) {
        const sign = up ? -1 : 1;
        const code = Math.floor(sign * 127 * cos((ratio - start) * 5 / 2 * pi2) + 127);
        return code.toString(16).padStart(2, '0');
    }
    const percentage = ratio % 1;
    let r, g, b;
    if (percentage < 0.2) {
        r = 'FF';
        g = grad(ratio, 0);
        b = '00';
    } else if (percentage < 0.4) {
        r = grad(ratio, 0.2, false);
        g = 'FF';
        b = '00';
    } else if (percentage < 0.6) {
        r = '00';
        g = grad(ratio, 0.4, false);
        b = grad(ratio, 0.4);
    } else if (percentage < 0.8) {
        r = grad(ratio, 0.6);
        g = '00';
        b = 'FF';
    } else {
        r = 'FF';
        g = '00';
        b = grad(ratio, 0.8, false);
    }
    const colorCode = "#" + r + g + b;
    return colorCode;
}

async function sleep(duration) {
    if (gameover) return;
    await new Promise(resolve => setTimeout(resolve, duration));
};

async function enemyManager() {
    // await danmaku1();
    // await danmaku2();
    await randomLaser(100);
    while (!gameover) {
        // await danmaku3();
        for (let i = 10; i <= 20; i++) {
            await multiLaser(i);
        }
        await sleep(1000);
        await danmaku4();
        await danmaku5();
        danmaku2();
        await sleep(500);
        await danmaku1();
        await sleep(500);
    }
};

//弾が発生する座標を事前にマーキングする
async function createCaution(x, y, duration = 1500, color = '#e66') {
    const div = document.createElement('div');
    div.classList.add('caution');
    container.appendChild(div);
    const size = div.offsetWidth;
    div.style.left = x - size / 2 + 'px';
    div.style.top = y - size / 2 + 'px';
    div.style.borderColor = color;
    div.style.animationDuration = duration + 'ms';
    await sleep(duration);
    div.remove();
}

async function multiLaser(laserNum) {
    const promises = [];
    const rand = Math.random();
    for (let i = 0; i < laserNum; i++) {
        if (gameover) return;
        const laser = shootLaser(i);
        promises.push(laser);
    }
    await Promise.all(promises);

    async function shootLaser(number) {
        const radius = 50;
        const centerX = rand * width / 2 + width / 4;
        const centerY = rand * height / 3 + height / 8;
        const x = centerX + radius * cos(pi2 * (rand + number / laserNum));
        const y = centerY + radius * sin(pi2 * (rand + number / laserNum))
        const color = getRainbowCode(rand);
        await createCaution(x, y, 500, color);

        let angle = pi2 * (rand + number / laserNum);
        if (rand < 0.5)
            angle = Math.atan2(heroY - y, heroX - x) + pi2 * number / laserNum;

        const laser = new Laser(container, x, y, angle, color);
        laser.speed = 10;
        laserList.push(laser);

        while (laser.width < 250 && !gameover) {
            laser.expand();
            await sleep(16);
        }
        while (!gameover && laserList.length > 0) {
            laser.move(angle);
            await sleep(16);
        }
    }
}

async function randomLaser(count) {
    for (let i = 0; i < count; i++) {
        if (gameover) return;
        shootLaser();
        await sleep(200);
    }
    await sleep(2000);

    async function shootLaser() {
        const rand = Math.random();
        const color = getRainbowCode(rand);
        const x = Math.random() * width * 0.75 + width * 0.125;
        const y = Math.random() * height * 0.4 + height * 0.1;

        const angleRange = pi2 / 4;
        const a = rand < 0.5 ? 0 : 1;
        const angle = Math.atan2(heroY - y, heroX - x) + a * (0.5 - rand) * angleRange;

        const laser = new Laser(container, x, y, angle, color);
        laserList.push(laser);

        while (laser.width < 100 && !gameover) {
            laser.expand();
            await sleep(16);
        }
        while (laser.element && !gameover) {
            laser.move();
            await sleep(16);
        }
    }
}

//自機を狙ってくる
async function danmaku1() {
    const cycles = 25;
    for (let i = 0; i < cycles; i++) {
        const armCounts = 10;
        for (let j = 0; j < armCounts; j++) {
            if (gameover) return;
            const startAngle = Math.atan2(heroY - bulletstartY, heroX - bulletstartX);
            const angle = startAngle + pi2 * j / armCounts;
            const dx = cos(angle) * bulletSpeed;
            const dy = sin(angle) * bulletSpeed;
            createBullet(dx, dy);
        }
        await sleep(200);
    }
    await sleep(1000);
}

//自機を狙わない
async function danmaku2(cycles = 3) {
    for (let i = 0; i < cycles; i++) {
        const startAngle = Math.atan2(heroY - bulletstartY, heroX - bulletstartX);
        const armLength = 16;
        for (let j = 0; j < armLength; j++) {
            const armCounts = 14;
            for (let k = 0; k < armCounts; k++) {
                if (gameover) return;
                const ratio = k / armCounts;
                const color = getRainbowCode(ratio + i / cycles);

                const angle = startAngle + pi2 / armCounts * (k + 0.5);
                const dx = cos(angle) * bulletSpeed;
                const dy = sin(angle) * bulletSpeed;
                createBullet(dx, dy, color);
            }
            await sleep(100);
        }
        await sleep(500);
    }
    await sleep(1000);
}

//蛇行する回転軌道
async function danmaku3() {
    const cycles = 5;
    const initialAngle = Math.atan2(heroY - bulletstartY, heroX - bulletstartX);
    for (let i = 0; i < cycles; i++) {
        const armLength = 40;
        const steps = cycles * armLength;
        for (let j = 0; j < armLength; j++) {
            const armCounts = 12;
            const armAngle = initialAngle + pi2 / armCounts * Math.sin(pi2 * j / armLength)

            const currentStep = i * armLength + j;
            const ratio = currentStep / steps;
            const color = getRainbowCode(ratio);
            for (let k = 0; k < armCounts; k++) {
                if (gameover) return;
                const angle = armAngle + pi2 * k / armCounts;
                const dx = Math.cos(angle) * bulletSpeed * 0.8;
                const dy = Math.sin(angle) * bulletSpeed * 0.8;
                createBullet(dx, dy, color);
            }
            await sleep(100);
        }
    }
    await sleep(2000);
}

//発射位置が∞の字に変化しながら自機を狙う
async function danmaku4() {
    const cycles = 3;
    const ampritudeX = width * 0.35;
    const amplitudeY = ampritudeX / 2;
    for (let i = 0; i < cycles; i++) {
        const steps = 50;
        for (let j = 0; j < steps; j++) {
            const ratio = j / steps;
            const sx = bulletstartX + ampritudeX * sin(pi2 * ratio);
            const sy = bulletstartY - amplitudeY * sin(pi2 * ratio * 2)
            const shotAngle = Math.atan2(heroY - sy, heroX - sx);
            const armCounts = 14;
            for (let k = 0; k < armCounts; k++) {
                const angle = shotAngle + pi2 * k / armCounts;
                const dx = cos(angle) * bulletSpeed * 0.8;
                const dy = sin(angle) * bulletSpeed * 0.8;
                const color = getRainbowCode(ratio);
                createBullet(dx, dy, color, sx, sy);
            }
            await sleep(200);
        }
    }
    await sleep(2000);
}

//ゲーム画面の外周から中心付近を狙う
async function danmaku5() {
    const cycle = 3;
    const steps = 2 * (width + height);
    for (let i = 0; i < cycle; i++) {
        for (let j = 0; j < steps; j += 25) {
            const ratio = j / steps;
            //弾の発射位置はゲーム画面の外周から
            let sx, sy;
            if (j < width) {
                sx = j;
                sy = 0;
            } else if (j < width + height) {
                sx = width;
                sy = j - width;
            } else if (j < 2 * width + height) {
                sx = steps - height - j;
                sy = height;
            } else {
                sx = 0;
                sy = steps - j;
            }

            //中心にある仮想の円周上を狙う
            const targetCirclelRadius = 20;
            // const targetCirclelRadius = 50 * sin(pi2 * ratio);
            const targetX = width / 2 + targetCirclelRadius * cos(pi2 * ratio * j / steps);
            const targetY = height / 2 + targetCirclelRadius * sin(pi2 * ratio * j / steps);
            const angle = Math.atan2(targetY - sy, targetX - sx);

            const dx = cos(angle) * bulletSpeed * 2;
            const dy = sin(angle) * bulletSpeed * 2;
            const color = getRainbowCode(ratio);

            const shotCount = 10;
            lateShot(shotCount);
            await sleep(70);

            //その位置から遅延した弾を出す関数
            async function lateShot(shotCount) {
                for (let i = 0; i < shotCount; i++) {
                    createBullet(dx, dy, color, sx, sy);
                    await sleep(250);
                }
            }
        }
    }
    await sleep(4000);
}


function createBullet(dx, dy, color = '#fff', sx = bulletstartX, sy = bulletstartY) {
    if (gameover) return;
    const bulletElement = document.createElement("div");
    bulletElement.classList.add('bullet');
    bulletElement.style.left = `${sx}px`;
    bulletElement.style.top = `${sy}px`;
    bulletElement.style.backgroundColor = color;

    bulletList.push({
        x: sx,
        y: sy,
        dx, dy,
        div: bulletElement,
        available: true,
    });
    container.appendChild(bulletElement);
};

function updateBullet() {
    bulletList.forEach(bullet => {
        const { x, y, dx, dy, div } = bullet;
        div.style.left = `${x - bulletSize / 2}px`;
        div.style.top = `${y - bulletSize / 2}px`;
        bullet.x += dx;
        bullet.y += dy;
        if (x < -bulletSize / 2 || x > width + bulletSize / 2 ||
            y < -bulletSize / 2 || y > height + bulletSize / 2) {
            bullet.available = false;
            div.remove();
            bulletBonus += 1;
        }
        const dist = (heroX - x) ** 2 + (heroY - y) ** 2;
        if (dist < (heroSize * 0.25) ** 2) {
            gameover = true;
        }
    });
};


function updateLaser() {
    laserList.forEach(laser => {
        laser.update();
        //画面外のレーザーを消す
        if (laser.x < -laser.width / 2 || laser.x > laser.width / 2 + width ||
            laser.y < -laser.width / 2 || laser.y > laser.width / 2 + height) {
            laser.available = false;
            laser.delete();
            laserBonus += 50;
        }
        //レーザーと自機の当たり判定
        //レーザーの始点->終点のベクトルvec1
        const vec1X = laser.width * cos(laser.angle);
        const vec1Y = laser.width * sin(laser.angle);
        //レーザーの始点->自機の中心のベクトルvec2
        const vec2X = heroX - (laser.x - vec1X / 2);
        const vec2Y = heroY - (laser.y - vec1Y / 2);
        //レーザーの終点->自機の中心のベクトルvec3
        const vec3X = heroX - (laser.x + vec1X / 2);
        const vec3Y = heroY - (laser.y + vec1Y / 2);

        //レーザー直線と自機の最短距離 = ベクトルの外積 / レーザーの長さ
        //正負が存在し、レーザーに対して自機がどちら側にいるかわかる
        const dist = (vec1X * vec2Y - vec2X * vec1Y) / laser.width;
        //レーザー直線と、始点・終点->自機の内積： 正負で角度がわかる
        const dotProduct1 = vec1X * vec2X + vec1Y * vec2Y;
        const dotProduct2 = vec1X * vec3X + vec1Y * vec3Y;

        //すり抜け判定用フラグの更新
        laser.side = Math.sign(dist);
        //vec2とvec3が（鋭角・鈍角）の組み合わせのとき(レーザーの横範囲内のとき)
        if (dotProduct1 * dotProduct2 < 0) {
            //接触判定
            if (Math.abs(dist) < 3) {
                gameover = true;
            }
            //すり抜け判定: side, presideは初期値が0
            if (laser.side !== 0 && laser.preside !== 0 && laser.side !== laser.preside) {
                gameover = true;
            }
        }
        laser.preside = laser.side;
    });

}

function eraseEnemy() {
    bulletList = bulletList.filter(bullet => bullet.available);
    laserList = laserList.filter(laser => laser.available);
}

function updateHero() {
    heroX = Math.max(heroSize / 2, Math.min(width - heroSize / 2, heroX));
    heroY = Math.max(heroSize / 2, Math.min(height - heroSize / 2, heroY));
    heroElement.style.left = `${heroX - heroSize / 2}px`;
    heroElement.style.top = `${heroY - heroSize / 2}px`;
};

function updateScore() {
    const now = Date.now();
    const timeBonus = Math.floor((now - startTime) * 0.01);
    score = bulletBonus + laserBonus + timeBonus;
    scoreElement.textContent = `SCORE: ${score}`;
}

function init() {
    //ゲーム画面
    container.style.maxWidth = `${width}px`;
    container.style.height = `${height}px`;

    //自機の設定
    heroElement = document.createElement("div");
    heroElement.textContent = "🍍";
    heroElement.style.position = "absolute";
    heroElement.style.width = `${heroSize}px`;
    heroElement.style.height = `${heroSize}px`;
    heroElement.style.display = "flex";
    heroElement.style.justifyContent = "center";
    heroElement.style.alignItems = "center";
    heroElement.style.fontSize = `${heroSize * 0.8}px`;
    container.appendChild(heroElement);
    updateHero();

    //自機の移動
    let originalX = -1,
        originalY,
        originalheroX,
        originalheroY;

    $(container).on('mousedown touchstart', (e) => {
        e.preventDefault();
        if (e.touches) {
            originalX = e.touches[0].clientX;
            originalY = e.touches[0].clientY;
        } else {
            originalX = e.clientX;
            originalY = e.clientY;
        }
        originalheroX = heroX;
        originalheroY = heroY;
    });

    $(document).on('mousemove touchmove', (e) => {
        if (gameover) return;
        if (originalX !== -1) {
            if (e.touches) {
                heroX = originalheroX + (e.touches[0].clientX - originalX);
                heroY = originalheroY + (e.touches[0].clientY - originalY);
            } else {
                heroX = originalheroX + (e.clientX - originalX);
                heroY = originalheroY + (e.clientY - originalY);
            }
            updateHero();
        }
    });
    $(document).on('mouseup touchend', () => originalX = -1);

    scoreElement.textContent = `SCORE: 0`;
    updateRankingDOM();

    //ゲーム開始ボタン
    $(newGameBtn).on('click touchstart', async () => {
        if (newGameBtn.disabled) return;
        resetGame();
        await countDown();
        enemyManager();
        const animationId = requestAnimationFrame(animate);
        async function animate() {
            if (gameover) {
                cancelAnimationFrame(animationId);
                bulletList.forEach(bullet => bullet.div.style.opacity = 0);
                laserList.forEach(laser => laser.element.style.opacity = 0);
                recordNumber = await ajaxToPHP('insertRanking', { score });
                await updateRankingDOM();
                newGameBtn.disabled = false;
                return;
            }
            updateBullet();
            updateLaser();
            eraseEnemy();
            updateScore();
            requestAnimationFrame(animate);
        }
    });
};

function resetGame() {
    gameover = false;
    newGameBtn.disabled = true;

    bulletList.forEach(bullet => bullet.div.remove());
    laserList.forEach(laser => laser.element.remove());
    bulletList = [];
    laserList = [];
    score = 0;
    bulletBonus = 0;
    laserBonus = 0;
    scoreElement.textContent = `SCORE: ${score}`;

    heroX = container.offsetWidth / 2;
    heroY = (container.offsetHeight * 3) / 4;
    updateHero();
}

async function countDown() {
    for (let i = 3; i > 0; i--) {
        const countDown = document.createElement('div');
        countDown.classList.add('countDown');
        container.appendChild(countDown);
        const countDownSize = countDown.offsetWidth;
        countDown.style.top = bulletstartY - countDownSize / 2 + 'px';
        countDown.textContent = i;

        await sleep(500);
        countDown.style.opacity = 0;
        await sleep(500);
        countDown.remove();
    }
    startTime = Date.now();
}

async function updateRankingDOM() {
    const rankList = await ajaxToPHP('getRanking', { limit: 10 });
    ranking.innerHTML = '<tr><th>順位</th><th>名前</th><th>SCORE</th></tr>'
    rankList.forEach((rank, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${index + 1}</td><td>${rank.name}</td><td>${rank.score}</td>`;
        if (recordNumber == rank.number) {
            tr.classList.add('newRecord');
        } else {
            tr.classList.remove('newRecord');
        }
        ranking.appendChild(tr);
    });
}

$(document).ready(async () => {
    init();
});