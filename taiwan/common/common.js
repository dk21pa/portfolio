'use strict';
//ローディング画像の作成
const loadingImage = document.createElement('img');
loadingImage.id = 'loadingImage';
loadingImage.src = '/taiwan/images/01logo.svg';
document.body.appendChild(loadingImage);
setLoadingMode(true);

//共通CSSの読み込み
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = '/taiwan/common/style.css';
document.head.appendChild(cssLink);

//ローディングするか否かによって、要素の表示／非表示を変える
function setLoadingMode(bool) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (bool) {
        document.querySelector('header').style.visibility = 'hidden';
        document.querySelector('main').style.visibility = 'hidden';
        document.querySelector('footer').style.visibility = 'hidden';
        document.body.style.backgroundColor = '#007ab7';
        loadingImage ? loadingImage.style.display = 'block' : null;
        loadingScreen ? loadingScreen.style.display = 'block' : null;
    } else {
        loadingScreen.style.display = 'none';
        loadingImage.style.display = 'none';
        document.body.style.backgroundColor = 'transparent';
        document.querySelector('header').style.visibility = 'visible';
        document.querySelector('main').style.visibility = 'visible';
        document.querySelector('footer').style.visibility = 'visible';
    }
}

function setPageTopBtn() {
    const menuBtnCheckBox = document.querySelector('input#menuBtn');
    const backToPageTopBtn = document.querySelector('div.backToPageTopBtn');
    const responsiveBorder = 768;
    const maxScroll = 775;  //ページトップボタンが出現するスクロール量Yの基準値
    let isTopPageBtn = false;

    function updateButtonPosition() {
        if (window.scrollY > maxScroll && !menuBtnCheckBox.checked) {
            // 基準以上スクロールし、ドロワーが閉じてる時
            isTopPageBtn = true;
        } else {
            isTopPageBtn = false;
        }
        const plusOrMinus = isTopPageBtn ? 1 : -1;
        backToPageTopBtn.style.bottom = `${plusOrMinus * backToPageTopBtn.clientHeight}px`;
    }

    //PC表示でドロワーを閉じる
    function updateMenuBtn() {
        if (window.innerWidth > responsiveBorder)
            menuBtnCheckBox.checked = false;
    }

    window.addEventListener('scroll', updateButtonPosition);
    window.addEventListener('resize', updateMenuBtn, updateButtonPosition);
    menuBtnCheckBox.addEventListener('change', updateButtonPosition);
    updateButtonPosition();
}

async function fetchHeader() {
    const response = await fetch("/taiwan/common/header.html");
    const data = await response.text();
    document.querySelector("header").insertAdjacentHTML('afterbegin', data);
}

async function fetchfFooter() {
    const response = await fetch("/taiwan/common/footer.html");
    const data = await response.text();
    document.querySelector("footer").insertAdjacentHTML('afterbegin', data);
}

function openPage() {
    function aTagClick(e) {
        e.preventDefault();
        document.querySelector('.menu').style.visibility = 'hidden';
        document.querySelector('header').style.visibility = 'hidden';

        setLoadingMode(true);
        if (e.target.href) {
            location.href = e.target.href;
        } else if (e.target.offsetParent.href) {
            location.href = e.target.offsetParent.href;
        }
    }
    const anchorTags = document.querySelectorAll('a:not([href="#"])');

    setLoadingMode(false);
    for (let anchor of anchorTags) {
        anchor.addEventListener('click', aTagClick);
    }
}

const init = async () => {
    window.addEventListener('beforeunload', setLoadingMode(true));
    await Promise.all([fetchHeader(), fetchfFooter()]);
    await new Promise(r => setTimeout(r, 800));

    openPage();
    setPageTopBtn();
}

window.onload = () => {
    init();
} 