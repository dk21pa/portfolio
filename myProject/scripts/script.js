'use strict';
let pw1OK = false;
let pw2OK = false;
let loginOK = false;
let nameOK = false;
$(document).ready(() => {
    const loginRegex = new RegExp(/^[a-zA-Z0-9]{4,}$/);
    const loginMsg = $('#loginMsg').text();
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
    const pwMsg1 = $('#pwMsg1').text();
    const nameRegex = /\S/;
    const nameMsg = $('#nameMsg').text();

    //login名の被りチェック
    const checkLogin = async () => {
        const login = $('#login').val();
        if (!loginRegex.test(login)) {
            $('#loginMsg').text(loginMsg);
            $('#loginMsg').css('color', '#000');
            loginOK = false;
            return;
        }
        await $.ajax({
            url: 'common/function.php',
            method: 'POST',
            data: {
                function: 'canUseLogin',
                login,
            },
            dataType: 'json',
            success: res => {
                if (res) {
                    $('#loginMsg').text('OK!');
                    $('#loginMsg').css('color', '#e22');
                    loginOK = true;
                } else {
                    $('#loginMsg').text('既に使われているログイン名です');
                    $('#loginMsg').css('color', '#000');
                    loginOK = false;
                }
            },
            error: xhr => {
                console.error(xhr.responseText);
                loginOK = false;
            }
        });
    }

    const checkName = () => {
        const name = $('#name').val();
        if (nameRegex.test(name)) {
            $('#nameMsg').text('OK!');
            $('#nameMsg').css('color', '#e22');
            nameOK = true;
        } else {
            $('#nameMsg').text(nameMsg);
            $('#nameMsg').css('color', '#000');
            nameOK = false;
        }
    }

    //ログイン名の入力検証
    $('#login').on('input', async () => {
        await checkLogin();
        toggleResistSubmitable();
        toggleUpdateSubmitable();
    });

    //表示名の入力検証
    $('#name').on('input', () => {
        checkName();
        toggleResistSubmitable();
        toggleUpdateSubmitable();
    });

    //パスワードの入力検証
    $('#password1').on('input', function () {
        const pw1 = $(this).val();
        if (pwRegex.test(pw1)) {
            $('#pwMsg1').text('OK!');
            $('#pwMsg1').css('color', '#e22');
            pw1OK = true;
        } else {
            $('#pwMsg1').text(pwMsg1);
            $('#pwMsg1').css('color', '#000');
            pw1OK = false;
        }
        toggleResistSubmitable();
        toggleUpdateSubmitable();
    });
    //確認用パスワードの入力検証
    $('#password2').on('input', function () {
        const pw2 = $(this).val();
        const pw1 = $('#password1').val();
        if (pw1 === pw2 && pw1OK) {
            $('#pwMsg2').text('OK!');
            $('#pwMsg2').css('color', '#e22');
            pw2OK = true;
        } else {
            $('#pwMsg2').text('パスワードが一致しません');
            $('#pwMsg2').css('color', '#000');
            pw2OK = false;
        }
        toggleResistSubmitable();
        toggleUpdateSubmitable();
    });

    //送信ボタンを押した時、パスワードの検証
    $('#update').on('click', e => {
        e.preventDefault();
        const pw = $('#oldpassword').val();
        $.ajax({
            url: 'common/function.php',
            method: 'POST',
            data: {
                function: 'isCorrectPW',
                oldpassword: pw
            },
            dataType: 'json',
            success: res => {
                if (res) {
                    $('form').submit();
                } else {
                    $('#submitMsg').text('パスワードが違います');
                    // $('#submitMsg').css('color', '#000');
                }
            },
            error: xhr => console.error(xhr.responseText)
        });
    });

    //送信用パスワードをbackspaceした時
    $('#oldpassword').on('keydown', e => {
        if (e.which === 8) {
            $('#submitMsg').text('');
        }
    });

    // "登録" 送信ボタンの有効/無効切り替え
    const toggleResistSubmitable = () => {
        if (loginOK && nameOK && pw1OK && pw2OK)
            return $('#resist').prop('disabled', false);
        return $('#resist').prop('disabled', true);
    }

    // "変更" 送信ボタンの有効/無効切り替え
    const toggleUpdateSubmitable = () => {
        const login = $('#login').val();
        const name = $('#name').val();
        const pw1 = $('#password1').val();
        const pw2 = $('#password2').val();
        const pwOK = pw1OK && pw2OK || pw1 === '' && pw2 === '' && (login != '' || name != '');
        // letj oldpwOK 
        if ((loginOK || login === '') &&
            (nameOK || name === '') &&
            (pwOK) &&
            !(login === '' && name === '' && pw1 === '' && pw2 === ''))
            return $('#update').prop('disabled', false);
        return $('#update').prop('disabled', true);
    }
    checkLogin();
    checkName();
});