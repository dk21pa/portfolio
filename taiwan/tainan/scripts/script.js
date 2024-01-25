'use strict'
$(document).ready(function () {
    let index;
    const buttons = $('.card div button');  //モーダル表示させるボタンの取得（配列）
    const modals = $('.modal');  //ボタンを押すと表示される要素の取得（配列）
    const over = $('.overLay');  //モーダルが表示されるときの背景
    const close = $('.mcloseBtn');  //モーダルを閉じるボタン（配列）

    $(buttons).on('click', function () {
        index = buttons.index(this);  //クリックしたボタンの番号
        $("body").css("overflow", "hidden");  //スクロールを無効にする
        $(modals[index]).add(over).fadeIn().css("display", "flex");  //モーダルと背景を表示
    });

    $(over).add(close).on('click', function () {
        $(modals).add(over).fadeOut();  //モーダルと背景を消す
        $("body").css("overflow", "auto");  //スクロールを有効にする
    });
});