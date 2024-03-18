'use strict'
const decToHexa = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'
}
const hexaToDec = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15
}
const digitList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

$(document).ready(function () {
    const from = document.getElementById('radixFrom');
    const to = document.getElementById('radixTo');
    for (let i = 2; i <= 16; i++) {
        from.append(new Option(`${i}進数`, i));
        to.append(new Option(`${i}進数`, i));
    }
    $('#transForm').on('click', function () {
        const inputNumber = document.getElementById('number').value;
        const originalRadix = Number(document.getElementById('radixFrom').value);
        const targetRadix = Number(document.getElementById('radixTo').value);
        const numArr = inputNumber.split('').map(n => n.replace(/[a-z]/g, function (string) {
            return string.toUpperCase();
        }));

        const isDisable = numArr.some(n => !digitList.slice(0, originalRadix).includes(n));
        if (isDisable) {
            window.alert(`入力した数字は${from}進数表記ではありません。\n0～${digitList[originalRadix - 1]}の数字のみ使用可能です。`);
            return;
        }

        //初めにinputNumberをoriginalRadix進数から10進数に変換  
        const len = inputNumber.length;
        let ten = 0;
        for (let i = 0; i < len; i++) {
            ten += hexaToDec[numArr[i]] * (originalRadix ** (len - i - 1));
        }

        //ten(10進数)の数字をtargetRadix進数に変換する
        //まずtargetRadix進数で何桁になるかを調べる
        let digit = 1;
        while (Math.floor(ten / (targetRadix ** digit)) !== 0) {
            digit++;
        }
        let ans = [];
        for (let i = digit - 1; i >= 0; i--) {
            ans.push(decToHexa[Math.floor(ten / (targetRadix ** i))]);
            ten %= (targetRadix ** i);
        }

        $("#result").text(ans.join(''));
        $("#descriptionRadix").text(`${numArr.join('')}(${originalRadix}進数)を${targetRadix}進数表記に変換すると${ans.join('')}になります`);
    });

    $('#radixTo').on('change', function () {
        $("#result").text('');
    });

});