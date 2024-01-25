'use strict';
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = '/taiwan/common/style.css';
document.head.appendChild(cssLink);

/* /// ページTopへbtn /// */
function setBackToPageTopBtn() {
    const menuBtnCheckBox = document.querySelector('input#menuBtn'); // ドロワーのチェックボックス
    const backToPageTopBtn = document.querySelector('div.backToPageTopBtn'); // トップへボタン
    let isTopPageBtn = false; // ボタン表示フラグ

    function checkScroll() {
        let myScrollY = window.scrollY;
        if (!isTopPageBtn && myScrollY > 775 && !menuBtnCheckBox.checked) {
            // ボタン非表示で、スクロールが700をこえてたら...
            backToPageTopBtn.style.bottom = `${backToPageTopBtn.clientHeight}px`; // 画面内へ
            isTopPageBtn = true;
        } else if ((isTopPageBtn && myScrollY <= 775) || menuBtnCheckBox.checked) {
            // ボタン表示で、スクロールが700以下なら...
            backToPageTopBtn.style.bottom = `-${100 + 20}px`; // 画面外へ
            isTopPageBtn = false;
        }
    }

    function checkResize() {
        checkScroll(); // スクロールボタンの表示の再考
        if (isTopPageBtn) {
            // 画面がリサイズされた時に、ボタンが表示されていたら...
            backToPageTopBtn.style.bottom = `${backToPageTopBtn.clientHeight}px`; // 表示位置を再設定
        }
        // レスポンシブでのドロワー挙動対応
        if (window.innerWidth > 768) {
            menuBtnCheckBox.checked = false;
        }
    }

    window.addEventListener('scroll', checkScroll); // スクロール時のリスナー
    window.addEventListener('resize', checkResize); // リサイズ時のリスナー
    menuBtnCheckBox.addEventListener('change', checkScroll); // ドロワー開閉のリスナー
}

const fetchHeader = async () => {
    const response = await fetch("/taiwan/common/header.html");
    const data = await response.text();
    document.querySelector("header").insertAdjacentHTML('afterbegin', data);
}

const fetchfFooter = async () => {
    const response = await fetch("/taiwan/common/footer.html");
    const data = await response.text();
    document.querySelector("footer").insertAdjacentHTML('afterbegin', data);
}

const loading = async () => {
    await fetchHeader();
    await fetchfFooter();

    const loadingScreen = document.getElementById('loadingScreen');

    function openThisPage() {
        // ローディングアニメーションの停止
        document.body.querySelector('div#loadingImage').style.animationName = 'none';
        // 表示
        document.body.style.backgroundColor = '#fff'; // 背景を白に戻す
        document.querySelector('header').style.visibility = 'visible'; // headerを表示
        document.querySelector('main').style.visibility = 'visible'; // mainを表示
        document.querySelector('footer').style.visibility = 'visible'; // footerを表示

        function aClick(evt) {
            evt.preventDefault();
            loadingScreen.style.display = 'block';
            loadingScreen.style.opacity = 1;
            loadingScreen.style.backgroundColor = '#007ab7'
            if (evt.target.href !== undefined) {
                location.href = evt.target.href;
            }
            else if (evt.target.offsetParent.href !== undefined) {
                location.href = evt.target.offsetParent.href;
            }
        }
        // ローディングスクリーンのフェード
        setTimeout(function () {
            loadingScreen.style.display = 'none';
        }, 1000);
        // アンカーの設定
        const anchorTags = document.querySelectorAll('a:not([href="#"])');
        for (let anchor of anchorTags) {
            anchor.addEventListener('click', aClick);
        }
    }
    openThisPage();
    setBackToPageTopBtn();
}
window.onload = loading;