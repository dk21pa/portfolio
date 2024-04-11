import ajaxToPHP from "./mypage.js";
import { Bullet, Laser, Matter } from "./Enemy.js";

export const pi2 = 2 * Math.PI;
export const sin = (a) => Math.sin(a);
export const cos = (a) => Math.cos(a);

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

const bulletstartX = width / 2;
const bulletstartY = height / 4;
let bulletList = [];
let laserList = [];
let matterList = [];
let startTime;
let score = 0;
let bulletBonus = 0;
let laserBonus = 0;

let recordNumber;
let gameover = true;
let islookMode = false;

//数字をカラーコードに変換
export function getRainbowCode(ratio) {
    const percentage = ratio % 1;
    function grad(percentage, start, up = true) {
        const sign = up ? -1 : 1;
        const code = Math.floor(sign * 127.5 * cos((percentage - start) * 3 * pi2) + 127.5);
        return code.toString(16).padStart(2, '0');
    }
    //赤、紫、青、水色、緑、黄、赤1の順
    let r, g, b;
    if (percentage < 0.1667) {
        r = 'FF';
        g = '00';
        b = grad(ratio, 0);
    } else if (percentage < 0.3333) {
        r = grad(ratio, 0.1667, false);
        g = '00';
        b = 'FF';
    } else if (percentage < 0.5) {
        r = '00';
        g = grad(ratio, 0.3333);
        b = 'FF';
    } else if (percentage < 0.6667) {
        r = '00';
        g = 'FF';
        b = grad(ratio, 0.5, false);
    } else if (percentage < 0.8333) {
        r = grad(ratio, 0.6667);
        g = 'FF';
        b = '00';
    } else {
        r = 'FF';
        g = grad(ratio, 0.8333, false);
        b = '00';
    }
    const colorCode = "#" + r + g + b;
    return colorCode;
}

async function sleep(duration) {
    if (gameover) return;
    await new Promise(resolve => setTimeout(resolve, duration));
};

async function enemyManager() {
    await danmaku1();
    await danmaku2();
    while (!gameover) {
        await randomLaser(100);
        await danmaku3();
        for (let i = 10; i <= 20; i++) {
            await multiLaser(i);
        }
        await matterBullet();
        await danmaku4();
        await danmaku5();
        danmaku2();
        await danmaku1();
        await sleep(1000);
    }
};

async function matterBullet() {
    if (gameover) return;
    const radius = 50;
    const vartex = 5
    const centerX = width / 2;
    const centerY = height / 4
    const matter = await createMatter(centerX, centerY, radius, vartex);
    const rand = Math.random();
    for (let i = vartex; i <= 10; i++) {
        matter.setShape(i);
        matter.setColor(rand + i / 6);
        await sleep(3000);
        const shotsPerVartex = 20;
        for (let j = 0; j < shotsPerVartex; j++) {
            for (let k = 0; k < i; k++) {
                if (gameover) return;
                const x = centerX + radius * cos(matter.angle + pi2 * k / i);
                const y = centerY + radius * sin(matter.angle + pi2 * k / i);
                createBullet(x, y, matter.angle + (pi2 * k / i), matter.color);
            }
            await sleep(200);
        }
        matter.rpm *= 1.1
    }
    await sleep(1000);
    matter.element.style.opacity = 0;
    await sleep(1000);
    matter.delete();
    matterList = [];
}

async function matterLaser() {
    if (gameover) return;
    const radius = 50;
    const vertex = 5
    const centerX = width / 2;
    const centerY = height / 2

    const matter = await createMatter(centerX, centerY, radius, vertex);
    await sleep(4000);
    const lasers = matter.shootLaser(container, 400);
    laserList.push(...lasers);
    await sleep(3000);

}

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
    const radius = 50;

    for (let i = 0; i < laserNum; i++) {
        if (gameover) return;
        const laser = shootLaser(i);
        promises.push(laser);
    }
    await Promise.all(promises);

    async function shootLaser(number) {
        const centerX = rand * width / 2 + width / 4;
        const centerY = rand * height / 3 + height / 8;
        let angle = pi2 * (rand / 2 + number / laserNum);
        const x = centerX + radius * cos(angle);
        const y = centerY + radius * sin(angle);
        const color = getRainbowCode(rand);

        await createCaution(x, y, 500, color);
        if (rand > 0.5)
            angle = Math.atan2(heroY - y, heroX - x) + pi2 * number / laserNum;

        const laser = createLaser(x, y, angle, color);
        laser.moveSpeed = 10;
        const targetLength = 250;
        laser.extend(targetLength);
        while (laser.length < targetLength && !gameover) {
            await sleep(16);
        }
        laser.modeList = ['move'];
        while (!gameover && laserList.length > 0) {
            await sleep(16);
        }
    }
}

//ランダムな箇所から自機を狙う。50%で少し外す。
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
        //発生個所は、12.5% < x < 87.5%、10% < y < 50%
        const x = Math.random() * width * 0.75 + width * 0.125;
        const y = Math.random() * height * 0.4 + height * 0.1;

        //自機からずれる角度の範囲は90°（-45°～45°）;
        const angleRange = pi2 / 4;
        //50%の確率で自機から外して狙う
        const zero_or_one = rand < 0.5 ? 0 : 1;
        const angle = Math.atan2(heroY - y, heroX - x) + zero_or_one * (1.5 - 2 * rand) * angleRange;
        const laser = createLaser(x, y, angle, color);
        while (laser.length < 100 && !gameover) {
            await sleep(16);
        }
        laser.modeList = ['move'];
        while (laserList.length > 0 && !gameover) {
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
            createBullet(bulletstartX, bulletstartY, angle);
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
                const angle = startAngle + pi2 / armCounts * (k + 0.5);
                const ratio = k / armCounts;
                const color = getRainbowCode((ratio + i / cycles) % 1);
                createBullet(bulletstartX, bulletstartY, angle, color);
            }
            await sleep(100);
        }
        await sleep(500);
    }
    await sleep(1000);
}

//うねうねする回転軌道
async function danmaku3() {
    const cycles = 5;
    //初めは自機を狙う
    const initialAngle = Math.atan2(heroY - bulletstartY, heroX - bulletstartX);
    for (let i = 0; i < cycles; i++) {
        const armLength = 40;
        const steps = cycles * armLength;
        for (let j = 0; j < armLength; j++) {
            const armCounts = 12;
            const armAngle = initialAngle + pi2 / armCounts * Math.sin(pi2 * j / armLength);

            const currentStep = i * armLength + j;
            const ratio = currentStep / steps;
            const color = getRainbowCode(ratio);
            for (let k = 0; k < armCounts; k++) {
                if (gameover) return;
                const angle = armAngle + pi2 * k / armCounts;
                createBullet(bulletstartX, bulletstartY, angle, color);
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
            const x = bulletstartX + ampritudeX * sin(pi2 * ratio);
            const y = bulletstartY - amplitudeY * sin(pi2 * ratio * 2)
            const targetAngle = Math.atan2(heroY - y, heroX - x);
            const armCounts = 14;
            for (let k = 0; k < armCounts; k++) {
                if (gameover) return;
                const angle = targetAngle + pi2 * k / armCounts;
                const color = getRainbowCode(ratio);
                createBullet(x, y, angle, color);
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
            let x, y;
            if (j < width) {
                x = j;
                y = 0;
            } else if (j < width + height) {
                x = width;
                y = j - width;
            } else if (j < 2 * width + height) {
                x = steps - height - j;
                y = height;
            } else {
                x = 0;
                y = steps - j;
            }

            //中心にある仮想の円周上を狙う
            const targetCirclelRadius = 20;
            const targetX = width / 2 + targetCirclelRadius * cos(pi2 * ratio * j / steps);
            const targetY = height / 2 + targetCirclelRadius * sin(pi2 * ratio * j / steps);
            const angle = Math.atan2(targetY - y, targetX - x);
            const color = getRainbowCode(ratio);

            const shotCount = 10;
            lateShot(shotCount);
            await sleep(70);

            //その位置から遅延した弾を出す関数
            async function lateShot(shotCount) {
                if (gameover) return;
                for (let i = 0; i < shotCount; i++) {
                    createBullet(x, y, angle, color);
                    await sleep(250);
                }
            }
        }
    }
    await sleep(4000);
}

function createBullet(x, y, angle, color) {
    const bullet = new Bullet(x, y, angle, color);
    container.appendChild(bullet.element);
    bulletList.push(bullet);
    return bullet;
}

function createLaser(x, y, angle, color) {
    const laser = new Laser(x, y, angle, color);
    container.appendChild(laser.element);
    laserList.push(laser);
    return laser;
}

async function createMatter(x, y, radius, n) {
    const matter = new Matter(x, y, radius, n);
    container.appendChild(matter.element);
    matterList.push(matter);
    await sleep(100);
    matter.element.style.opacity = 1;
    return matter;
}

function updateBullet() {
    for (let i = 0; i < bulletList.length; i++) {
        const bullet = bulletList[i];
        bullet.update();
        //画面外判定とスコアの加算
        if (bullet.x < -bullet.size / 2 || bullet.x > width + bullet.size / 2 ||
            bullet.y < -bullet.size / 2 || bullet.y > height + bullet.size / 2) {
            bullet.delete();
            bulletBonus += 1;
        }

        if (islookMode) continue;
        //自機との衝突判定
        const dist = (heroX - bullet.x) ** 2 + (heroY - bullet.y) ** 2;
        if (dist < ((heroSize / 2 + bullet.size / 2) * 0.44) ** 2) {
            gameover = true;
        }
    }

};

function updateLaser() {
    for (let i = 0; i < laserList.length; i++) {
        const laser = laserList[i];
        laser.update();
        //画面外判定
        if (laser.x < -laser.length / 2 || laser.x > laser.length / 2 + width ||
            laser.y < -laser.length / 2 || laser.y > laser.length / 2 + height) {
            laser.delete();
            laserBonus += 50;
        }

        if (islookMode) continue;
        //レーザーと自機の当たり判定
        //レーザーの始点->終点のベクトルvec1
        const vec1X = laser.length * cos(laser.angle);
        const vec1Y = laser.length * sin(laser.angle);
        //レーザーの始点->自機の中心のベクトルvec2
        const vec2X = heroX - (laser.x - vec1X / 2);
        const vec2Y = heroY - (laser.y - vec1Y / 2);
        //レーザーの終点->自機の中心のベクトルvec3
        const vec3X = heroX - (laser.x + vec1X / 2);
        const vec3Y = heroY - (laser.y + vec1Y / 2);

        //レーザー直線と自機の最短距離 = ベクトルの外積 / レーザーの長さ
        //正負が存在し、レーザーに対して自機がどちら側にいるかがわかる
        const dist = (vec1X * vec2Y - vec2X * vec1Y) / laser.length;
        //レーザー直線と、始点・終点->自機の内積： 正負で角度がわかる
        const dotProduct1 = vec1X * vec2X + vec1Y * vec2Y;
        const dotProduct2 = vec1X * vec3X + vec1Y * vec3Y;

        //以下すり抜け判定
        //すり抜け判定用フラグの更新
        laser.side = Math.sign(dist);
        //vec2とvec3が（鋭角・鈍角）の組み合わせのとき(レーザー始点・終点を通る2法線の内側にいるとき)
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
    }
}

function updateMatter() {
    for (let i = 0; i < matterList.length; i++) {
        const matter = matterList[i];
        matter.update();
        //自機との衝突判定
        if (islookMode) continue;
        const dist = (heroX - matter.x) ** 2 + (heroY - matter.y) ** 2;
        if (dist < (matter.radius * 0.6) ** 2) {
            gameover = true;
        }
    }
};

function eraseEnemy() {
    bulletList = bulletList.filter(bullet => !bullet.modeList.includes('delete'));
    laserList = laserList.filter(laser => !laser.modeList.includes('delete'));
}

function updateHero() {
    heroX = Math.max(heroSize / 2, Math.min(width - heroSize / 2, heroX));
    heroY = Math.max(heroSize / 2, Math.min(height - heroSize / 2, heroY));
    heroElement.style.left = `${heroX - heroSize / 2}px`;
    heroElement.style.top = `${heroY - heroSize / 2}px`;
};

function updateScore() {
    if (islookMode) return;
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
                bulletList.forEach(bullet => bullet.element.style.opacity = 0);
                laserList.forEach(laser => laser.element.style.opacity = 0);
                matterList.forEach(matter => matter.element.style.opacity = 0);
                if (score !== 0) {
                    recordNumber = await ajaxToPHP('insertRanking', { score });
                    await updateRankingDOM();
                }
                $('#islookMode').prop('disabled', false);
                newGameBtn.disabled = false;
                return;
            }
            updateBullet();
            updateLaser();
            updateMatter();
            eraseEnemy();
            if (!islookMode) updateScore();
            requestAnimationFrame(animate);
        }
    });

    //鑑賞モード切替
    $('#islookMode').on('click', function (e) {
        //ゲーム中に鑑賞モードには変更できない
        if (!gameover && !islookMode) {
            e.preventDefault();
            return;
        }
        //鑑賞モードでのゲーム中に解除するとゲームリセット
        if (!gameover && islookMode) {
            gameover = true;
        }
        islookMode = $(this).prop('checked');
    });
    scoreElement.textContent = `SCORE: 0`;
    updateRankingDOM();
};

function resetGame() {
    gameover = false;
    newGameBtn.disabled = true;
    if (!islookMode) {
        $('#islookMode').prop('disabled', true);
    }
    //DOM整理
    bulletList.forEach(bullet => bullet.element.remove());
    laserList.forEach(laser => laser.element.remove());
    matterList.forEach(matter => matter.element.remove());

    bulletList = [];
    laserList = [];
    matterList = [];

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

        await sleep(300);
        countDown.style.opacity = 0;
        await sleep(700);
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