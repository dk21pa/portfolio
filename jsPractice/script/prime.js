'use strict'
$(document).ready(function () {
    $("#isPrime").focus();

    $('#output').on('click', function (e) {
        e.preventDefault();
        const inputNumber = Number(document.getElementById('isPrime').value);

        if (isNaN(inputNumber)) {
            window.alert('数字を入力してください');
            $('#isPrime').val('');
            return
        } else if (inputNumber <= 0) {
            window.alert('正の数を入力してください');
            $('#isPrime').val('');
            return;
        } else if (inputNumber === 1) {
            $('#result').text('1は素数ではありません');
            return;
        }
        else if (inputNumber >= 10 ** 7) {
            window.alert('9,999,999以下の数字を入力してください');
            $('#isPrime').val('');
            return;
        }

        //以下、エラトステネスの篩（ふるい）で行う
        const primeTable = Array(inputNumber + 1).fill(true);
        primeTable[0] = primeTable[1] = false;
        const result = [2];
        for (let i = 3; i <= inputNumber; i += 2) {
            if (!primeTable[i]) continue;
            for (let j = 2 * i; j <= inputNumber; j += i) {
                primeTable[j] = false;
            }
            result.push(i);
        }
        $('#result').text(`${inputNumber}以下の素数は全部で${result.length}個です`);
        $('#result').append(`<p style ='margin-top: 12px'>${result.join(' ')}</p>`);
    });
});