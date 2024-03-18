'use strict'
const str = "おはようございます";
let answer = "";
for (let i = 0; i < str.length; i++) {
    answer += str[str.length - i - 1];
}

let form = [];  // 現在編集・表示している計算式
let formList = []; //計算式の履歴を保存しておく配列（配列の配列になる）
let nowIndex = -1;  // 表示する履歴の番号
let isNum = false;  //式の最後の要素が数字かどうか
let isPoint = false;  //式の最後の要素が小数かどうか
let isResultMode = false;
let isMemoryMode = false;
//  isResultMode &&  isMemoryMode  履歴の表示
//  isResultMode && !isMemoryMode　現在の計算結果の表示
// !isResultMode &&  isMemoryMode　履歴を使用した再計算 
// !isResultMode && !isMemoryMode　通常の計算

function Fix(n) { //nの小数第10位を四捨五入する関数
    n = Number(n);
    const fix = 10 ** 10;
    return Math.round(n * fix) / fix;
}
function PQ(formula) {  //掛け算と割り算の計算
    let index;
    const index1 = formula.indexOf('×');
    const index2 = formula.indexOf('÷');
    if (index1 === index2) {  //掛け算も割り算もやり切ったとき
        return formula;
    } else if (index1 * index2 < 0) {  //どちらか片方だけ残っている時
        index = Math.max(index1, index2);
    } else {  // 両方残っている時
        index = Math.min(index1, index2);
    }
    const pq = formula[index];
    if (pq === '×') {
        formula[index] = Fix(Number(formula[index - 1]) * Number(formula[index + 1]));
    } else if (pq === '÷') {
        formula[index] = Fix(Number(formula[index - 1]) / Number(formula[index + 1]));
    }
    formula.splice(index + 1, 1);
    formula.splice(index - 1, 1);
    return PQ(formula);
}

function SD(formula) {  //足し算と引き算の計算
    const index1 = formula.indexOf('+');
    const index2 = formula.indexOf('-');
    if (index1 === index2) {  //足し算も引き算も両方やり切ったとき
        return formula;
    }
    const index = Math.max(index1, index2);

    const sd = formula[index];
    if (sd === '+') {
        formula[index] = Fix(Number(formula[index - 1]) + Number(formula[index + 1]));
    } else if (sd === '-') {
        formula[index] = Fix(Number(formula[index - 1]) - Number(formula[index + 1]));
    }
    formula.splice(index + 1, 1);
    formula.splice(index - 1, 1);
    return SD(formula);
}

function Format() {  //入力した式を画面表示用に成型する関数
    if (isMemoryMode && isResultMode) {  //履歴モード中は、表示中の履歴の式を表示する
        form = formList[nowIndex].slice();
    }
    const len = form.length;
    const tail = form[len - 1];
    const display = [];
    for (let i = 0; i < len - 1; i++) {
        if (!isNaN(form[i])) {
            form[i] = Number(form[i]);
            if (form[i] * 1 < 0) {
                display.push('(' + form[i] + ')');
            } else {
                display.push(form[i]);
            }
        } else {
            display.push([form[i]]);
        }
    }
    display.push(tail);
    if (isNum && String(tail)[0] === '-') {
        display[len - 1] = '(' + form[len - 1];
    }
    if (isResultMode && String(tail)[0] === '-') {
        display[len - 1] += ')';

    }
    return display.join(' ');
};

$(document).ready(function () {
    //テンキー入力した時
    $('#tenkey button:not(#equal)').on('click', function () {
        $('#ans').text('');
        const input = $(this).text();
        const isCalc = (input === '÷' || input === '×' || input === '-' || input === '+');
        //  isResultMode &&  isMemoryMode  履歴の表示      数字は更新、記号は継続
        //  isResultMode && !isMemoryMode　計算結果の表示   数字は更新、記号は継続
        // !isResultMode &&  isMemoryMode　履歴の再計算     数字も記号も継続
        // !isResultMode && !isMemoryMode　通常の計算      数字も記号も継続

        if (isResultMode) { //履歴の再計算中以外では履歴モードを解除する
            isMemoryMode = false;
        }
        if (isResultMode && !isCalc) {  // 結果モード中に数字を入力したら新しい計算式に移行する
            form = [];
        }

        isResultMode = false;
        nowIndex = formList.length - 1;
        if (form.length === 0) {
            if (input === '-') {
                form = [input];
                isNum = true;
                isPoint = false;
            } else if (input === '.' || input === '0') {
                form = ['0.'];
                isNum = true;
                isPoint = true;
            } else if (!isCalc) {
                form.push(input);
                isNum = true
                isPoint = false;
            }
        } else {
            const tail = form.length - 1;
            if (isNum && !isPoint) {  //最後の要素が小数点なしの数字の時
                if (!isNaN(input)) {  //入力が数字の時
                    if (input === '0') {  //入力が0の時
                        if (form[tail] === '-') {  //最後の要素が単独のマイナス符号の時
                            form[tail] += '0.';
                            isPoint = true;
                        } else if (form[tail] === '0' || form[tail] === '-0') { // 最後の要素が単独の0の時
                            form[tail] += '.0';
                            isPoint = true;
                        } else {
                            form[tail] += input;
                        }
                    } else {  //入力が0以外の数字の時
                        form[tail] += input;
                    }
                } else if (input === '.') {
                    if (form[tail] === '-') {
                        form[tail] += '0.';
                    } else {
                        form[tail] += input;
                    }
                    isPoint = true;
                } else if (isCalc) {
                    if (form[tail] === '-') {  //最後の要素が単独のマイナス符号の時
                        if (input === '+') {
                            form.pop();
                        } else if (input === '×' || input === '÷') {
                            form[tail] += '1';
                            form.push(input);
                        }
                    } else {
                        form.push(input);
                    }
                    isNum = false;
                }
            } else if (isNum && isPoint) {  //最後の要素が小数の時
                if (!isNaN(input)) {
                    form[tail] += input;
                } else if (isCalc) {
                    form.push(input);
                    isPoint = false;
                    isNum = false;
                }
            } else if (!isNum) {  //最後の要素が計算記号の時
                if (!isNaN(input)) {
                    if (input === '0') {
                        form.push('0.');
                        isPoint = true;
                    } else {
                        form.push(input);
                    }
                    isNum = true;
                } else if (input === '.') {
                    form.push('0.');
                    isNum = true;
                    isPoint = true;
                } else if (isCalc) {
                    if (input === '-' && (form[tail] === '×' || form[tail] === '÷')) {
                        form.push(input);
                        isNum = true;
                        isPoint = false;
                    } else {
                        form[tail] = input;
                    }
                }
            }
        }
        return $('#form').text(Format());
    });

    //イコールボタンを押した時
    $('#equal').on('click', function () {
        if (isResultMode) {  //結果表示中は何もしない
            return;
        }
        isResultMode = true;
        isMemoryMode = false;
        const tail = form[form.length - 1];
        if (!isNum || tail === '-') {  //最後の要素が数字でないとき
            $('#ans').text('式が不完全だよ');
        } else {
            form[form.length - 1] = Number(tail);
            $('#form').text(Format());
            const temp = form.slice();  //formの参照を切るためにslpice();を記述する
            SD(PQ(form));
            if (Math.abs(form) === Infinity || isNaN(form)) {
                $('#ans').text('0で割るのは数学の禁忌ぞ');
                form = [];
                return;
            }
            nowIndex++;
            formList.push(temp);
            $('#ans').text(`= ${form}`);
        }
    });

    //クリアボタンを押した時
    $('#clear').on('click', function () {
        isMemoryMode = false;
        if (form.length === 0) {
            return;
        }
        form = [];
        isNum = false;
        isPoint = false;
        $('#form').text('');
        $('#ans').text('');
    });

    //backspaceを押した時
    $('#backspace').on('click', function () {
        let len = form.length;
        if (len === 0) {
            return;
        }

        if (isResultMode && isMemoryMode && nowIndex >= 0) {  //履歴表示中
            form = formList[nowIndex].slice();
        }
        isResultMode = false;
        len = form.length;
        const tail = form[len - 1];
        if (isNum) {  //最後の要素が数字の時
            if (String(tail).length === 1 || tail === '0.') {  //消したい数字が1桁の時
                form.pop();
                isNum = false;
                isPoint = false;
            } else if (tail === '-0.') {
                form[len - 1] = '-';
                isPoint = false;
            }
            else {  //消したい数字が2桁以上の時
                form[len - 1] = String(tail).slice(0, -1);  //最後尾を削除
                isPoint = String(tail).includes('.') ? true : false;  //削除後の数字が小数かどうかを判定
            }
        } else {  //最後の要素が記号の時
            form.pop();
            isNum = true;
            isPoint = [len - 2] % 1 === 0 ? false : true;
        }
        $('#form').text(Format());
        $('#ans').text('');
    });

    //履歴の戻るボタンを押した時
    $('#back').on('click', function () {
        if (nowIndex < 1) {
            return;
        }
        if (isResultMode) {
            nowIndex = Math.max(0, nowIndex - 1)
        } else {
            nowIndex = formList.length - 1;
        }
        isMemoryMode = true;
        isResultMode = true;
        isNum = true;
        const nowForm = formList[nowIndex];
        const tail = nowForm[nowForm.length - 1]
        isPoint = String(tail).includes('.') ? true : false;  //現在選択している式の最後尾が小数かどうか判定
        $('#form').text(Format());
        $('#ans').text(`= ${SD(PQ(form))}`);
    });

    //履歴の進むボタンを押した時
    $('#forward').on('click', function () {
        if (!isMemoryMode) {
            return;
        }
        nowIndex = Math.min(nowIndex + 1, formList.length - 1);
        const nowForm = formList[nowIndex];
        const tail = nowForm[nowForm.length - 1]
        isPoint = String(tail).includes('.') ? true : false;  //現在選択している式の最後尾が小数かどうかを判定
        $('#form').text(Format());
        $('#ans').text(`= ${SD(PQ(form))}`);
    });

    //履歴削除ボタンを押した時
    $('#clearMemory').on('click', function () {
        isMemoryMode = false;
        formList = [];
        nowIndex = -1;
    });
});