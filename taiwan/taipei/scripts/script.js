'use strict'
$(document).ready(function () {
    const buttons = $('.nightMarket .item3 button');  //モーダル表示させるボタンの取得（配列）
    const modals = $('.nightMarket .modal');  //ボタンを押すと表示される要素の取得（配列）
    const over = $('.nightMarket .overLay');  //モーダルが表示されるときの背景

    $(buttons).on('click', function () {
        const index = buttons.index(this);  //クリックしたボタンの番号
        $('body').css('overflow', 'hidden');  //スクロールを無効にする
        $(modals[index]).add(over).fadeIn();  //モーダルと背景を表示
    });

    $(over).add('.nightMarket .closeBtn').on('click', function () {
        $(modals).add(over).fadeOut();  //モーダルと背景を消す
        $('body').css('overflow', 'auto');  //スクロールを有効にする
    });
});