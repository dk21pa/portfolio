'use strict';

$(document).ready(() => {
    const resistBtn = document.getElementById('resistBtn');  //登録ボタンの要素
    // const notEmptyRex = /^(!?=).{1, 100}$/;
    const emailRegex = /^\w+@\w+\.[a-zA-Z]{2,}$/;   //(英数字)@(英数字).(英字2字以上)
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,100}$/;    //英字と数字を含む6文字以上

    //idからそのvalueを得る関数
    const val = (idName) => {
        return document.getElementById(idName).value;
    }

    //phpの関数でメールアドレスの被りチェック
    const canUseEmail1 = async () => {
        const email = val('email');
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '../common/function.php',
                method: 'POST',
                data: {
                    function: 'canUseEmail',
                    email: email
                },
                dataType: 'json',
                success: res => resolve(res),
                error: xhr => {
                    reject(new Error(xhr.responseText));
                }
            });
        });
    }

    const canUseEmail = async () => {
        const email = val('email');
        const formData = new FormData();
        formData.append('function', 'canUseEmail');
        formData.append('email', email);
        try {
            const response = await fetch('../common/function.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new Error('Request failed: ' + error.message);
        }
    }

    //入力確認ボタン押下時の処理
    const resistBtnClickHandler = async (event) => {
        event.preventDefault();

        const email = val('email');
        const email1 = val('email1');
        let alertMsg = '';

        //空白でないかチェック
        if (/^\s*$/.test(val('name')) ||
            /^\s*$/.test(val('furigana')) ||
            /^\s*$/.test(val('address'))) {
            // window.alert('すべて入力してください。');
            // return;
        }

        //郵便番号チェック
        if (!/^\d{3}$/.test(val('post1')) ||
            !/^\d{4}$/.test(val('post2'))) {
            alertMsg += '郵便番号が正しくありません。\n';
        }

        //メールアドレスチェック
        if (!await canUseEmail()) {
            alertMsg += '既に登録済みのメールアドレスです\n';
        } else if (!emailRegex.test(email)) {
            alertMsg += '無効なメールアドレスです。\n';
        } else if (email != email1) {
            alertMsg += '確認用メールアドレスが一致しません。\n';
        }

        //PWチェック
        if (!pwRegex.test(val('pw'))) {
            alertMsg += 'パスワードは英字と数字を含む6文字以上で入力して下さい。\n'
        } else if (val('pw') !== val('pw1')) {
            alertMsg += '確認用パスワードが一致しません。\n';
        }

        if (alertMsg === '') {
            resistBtn.removeEventListener('click', resistBtnClickHandler);
            resistBtn.click();
        } else {
            window.alert(alertMsg);
        }
    };

    resistBtn.addEventListener('click', resistBtnClickHandler);
});