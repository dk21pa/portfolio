'use strict'

const aside = document.getElementsByTagName('aside');
[...aside].forEach(element => {
    element.innerHTML =
        '<h3> 各ページへのリンク</h3>\
        <ul>\
        <li> <a href="index.html">Top</a> </li>\
        <li> <a href="calcurater.html">計算機</a> </li>\
        <li> <a href="cards.html">ポーカー</a> </li>\
        <li> <a href="prime.html">素数の列挙</a> </li>\
        <li> <a href="radix.html">基数変換</a> </li>\
        </ul>';
});

const footer = document.getElementsByTagName('footer');
[...footer].forEach(element => {
    element.innerHTML = '\
    <p class="ffDotGothixc16">\
        <small> Kudo Daiki </small>\
    </p>'
        ;
});


