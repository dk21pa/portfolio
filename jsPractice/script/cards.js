
'use strict'
//画像のプリロード
const suits = ['_club_', '_diamond_', '_heart_', '_spade_'];
const cardPaths = [];
for (let i = 0; i < 4; i++) {
    let suit = [];
    for (let j = 1; j <= 13; j++) {
        suit.push('img/Img_cardDeck/card' + suits[i] + `${j}`.padStart(2, 0) + '.png');
    }
    cardPaths.push(suit);
}
cardPaths.push(['img/Img_cardDeck/card_joker.png']);
cardPaths.push(['img/Img_cardDeck/card_back.png']);

cardPaths.forEach(function (sameSuitCards) {
    sameSuitCards.forEach(function (card) {
        let imgTag = document.createElement('img');
        imgTag.src = card;
    })
});

function random(a, b) {  //a～b（両端含む）のランダムな整数を返す関数
    return Math.floor(Math.random() * (Math.abs(b - a) + 1)) + Math.min(a, b);
}

function addCard(i, j) {  //cardPaths[i][j]の画像を追加する
    $('#hand').append(`<img src=${cardPaths[i][j]}>`);
}

function replaceWithJoker(a, b = a) {  //a番目からb番目のカードのうち一つを一定確率でジョーカーに変える
    if (random(0, 9) < 7) return;  //70%の確率で何もしない
    const targets = document.getElementById('hand').querySelectorAll('img');
    targets[random(a - 1, b - 1)].src = cardPaths[4][0];
}

function display() {  //役名、カード、説明を表示する
    $('#handName').text(`${hands[hand].name}`);
    $('#description').text(`${hands[hand].description}`);
    hands[hand].showCards();
}

const hands = {  //役の名前、カードを配置する関数、説明文のオブジェクトを役の種類数ぶん含むオブジェクト
    RSFlush: {
        name: 'ロイヤルストレートフラッシュ',
        showCards: function () {
            const suit = random(0, 3);
            for (let i = 0; i < 5; i++) {
                addCard(suit, (9 + i) % 13);
            }
            replaceWithJoker(1, 5);
        },
        description: '最強の手札。一生に一度は揃えてみたい。',
    },
    SFlush: {
        name: 'ストレートフラッシュ',
        showCards: function () {
            const suit = random(0, 3);
            const number = random(0, 8);
            for (let i = 0; i < 5; i++) {
                addCard(suit, number + i);
            }
            replaceWithJoker(1, 5);
        },
        description: '二番目に強い手札。'
    },
    FCards: {
        name: 'フォーカード',
        showCards: function () {
            const suit = random(0, 3);
            const number = random(0, 12);
            for (let i = 0; i < 4; i++) {
                addCard((suit + i) % 4, number);
            }
            addCard(random(0, 3), (number + random(1, 12)) % 13);
            replaceWithJoker(1, 4);
        },
        description: 'ほぼ勝てる。イカサマを疑われるかもしれない。'
    },
    FH: {
        name: 'フルハウス',
        showCards: function () {
            const suit1 = random(0, 3)
            const number1 = random(0, 12);
            for (let i = 0; i < 3; i++) {
                addCard((suit1 + i) % 4, number1);
            }

            let suit2 = random(0, 3)
            const number2 = (number1 + random(1, 12)) % 13;
            for (let i = 0; i < 2; i++) {
                suit2 = (suit2 + random(1, 3)) % 4
                addCard(suit2, number2);
            }
            replaceWithJoker(3);
        },
        description: 'かなり強い。大体勝てる。'
    },
    Flush: {
        name: 'フラッシュ',
        showCards: function () {
            const suit = random(0, 3);
            const gap = random(1, 3); //gap枚目とgap+1枚目の数字は連続させない
            let from = 0;
            let to = 3;
            for (let i = 0; i < 5; i++) {
                const number = random(from, to);
                addCard(suit, number);

                from = number + 1;
                to = random(from + 1, Math.min(from + 4, 7 + i));

                if (i === gap) {
                    to++;
                    from++;
                } else if (i === 3) {
                    to = 12;
                }
            }
        },
        description: '大富豪では強くない。'
    },
    Straight: {
        name: 'ストレート',
        showCards: function () {
            let preSuit;
            const number = random(0, 9);
            const dif = random(1, 4);  //少なくともdif枚目とdif+1枚目のスートは同じではない
            for (let i = 0; i < 5; i++) {
                let suit = random(0, 3);
                if (i === dif) {
                    suit = (preSuit + random(1, 3)) % 4
                }
                addCard(suit, (number + i) % 13);
                preSuit = suit;
            }
        },
        description: '揃ったら気持ちいい。大富豪でも強い。'
    },
    TCards: {
        name: 'スリーカード',
        showCards: function () {
            let suitList = [0, 1, 2, 3];
            let suit;
            let numberList = Array(13).fill().map((_, i) => i);
            let number = random(0, 12);
            for (let i = 0; i < 3; i++) {
                suitList = suitList.filter(n => n !== suit);
                suit = suitList[random(0, suitList.length - 1)];
                addCard(suit, number);
            }
            for (let i = 0; i < 2; i++) {
                numberList = numberList.filter(n => n !== number);
                number = numberList[random(0, numberList.length - 1)]
                suit = random(0, 3);
                addCard(suit, number);
            }
            replaceWithJoker(3);
        },
        description: '強いか弱いかよくわからない。'
    },
    TPairs: {
        name: 'ツーペア',
        showCards: function () {
            let suit = 0;
            let numberList = Array(13).fill().map((_, i) => i);
            let number = random(0, 12);
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    suit = (suit + random(1, 3)) % 4;
                    addCard(suit, number);
                }
                suit = random(0, 3);
                numberList = numberList.filter(n => n !== number);
                number = numberList[random(0, numberList.length - 1)]
            }
            addCard(suit, number);
            replaceWithJoker(1, 4);
        },
        description: '初心者はとりあえずこれ狙うとよい。'
    },
    Pair: {
        name: 'ワンペア',
        showCards: function () {
            let suit = random(0, 3);
            let numberList = Array(13).fill().map((_, i) => i);
            let number = random(0, 12);
            for (let i = 0; i < 2; i++) {
                suit = (suit + random(1, 3)) % 4;
                addCard(suit, number);
            }
            for (let i = 0; i < 3; i++) {
                numberList = numberList.filter(n => n !== number);
                number = numberList[random(0, numberList.length - 1)]
                suit = random(0, 3);
                addCard(suit, number);
            }
            replaceWithJoker(1, 2);
        },
        description: 'トイレットペーパーの方が価値が高いと言われている。'
    },
    NPair: {
        name: 'ノーペア',
        showCards: function () {
            const dif = random(1, 4); //少なくともdif枚目とdif+1枚目のスートは同じではない
            const gap = random(1, 3); //少なくともgap枚目とgap+1枚目の数字は連続させない

            let preSuit = -1;
            let from = 0;
            let to = 3;
            for (let i = 0; i < 5; i++) {
                let suit = random(0, 3);
                if (i === dif) {
                    suit = (preSuit + random(1, 3)) % 4
                }
                if (i === 4) to = 12;
                const number = random(from, to);
                addCard(suit, number);
                from = number + 1;
                to = random(from + 1, Math.min(from + 4, 7 + i));
                if (i === gap) {
                    to++;
                    from++;
                }
                preSuit = suit;
            }
        },
        description: '最弱。'
    }
}
const handsArray = Object.keys(hands);  //handsオブジェクト内にある役の名前が格納された配列
let hand = handsArray[Math.floor(Math.random() * handsArray.length)];  //ランダムに選択された役

$(document).ready(function () {
    display();
    $('#hand').on('click', function () {
        $('#hand').empty();
        hand = handsArray[Math.floor(Math.random() * handsArray.length)];
        display();
    });
});