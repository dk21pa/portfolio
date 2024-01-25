'use strict';

let headerLoadFlg = false; // headerの読み込み完了フラグ
let footerLoadFlg = false; // footerの読み込み完了フラグ
let windowLoadFlg = false; // onloadの受け取り

const headerElement = document.querySelector( 'header' );
const mainElement = document.querySelector( 'main' );
const footerElement = document.querySelector( 'footer' );

document.body.style.backgroundColor = '#007ab7';

const loadingScreenHTML = `
    <div id="loadingScreen">
        <div id='loadingImage'>
            <img src="/images/01logo.svg">
        </div>
    </div>`;
const tempElement = document.createElement( 'div' );
tempElement.innerHTML = loadingScreenHTML;
const loadingScreenElement = tempElement.querySelector( 'div#loadingScreen' );
const loadingImage = tempElement.querySelector('div#loadingImage >img');

//window.onload
window.onload = (evt) => {
    windowLoadFlg = true;
}
// ページ遷移対応
window.addEventListener( 'pageshow', (evt) => {
    if( headerLoadFlg && footerLoadFlg && windowLoadFlg){
        // ページが開いた時にパーツが読み込まれて入れば...
        setBackToPageTopBtn();
        openThisPage();
    }
});

// ローディング画像の読み込みができたら...(リスナー)
loadingImage.addEventListener('load',function() {
    document.body.appendChild(loadingScreenElement);
    loadingImage.style.width = '100%';
    loadingImage.style.height = '100%';
    loadingImage.style.objectFit = 'contain';
    
    loadingScreenElement.style.display = 'block';

    viewCheck();
});

function viewCheck() {
    if( headerLoadFlg && footerLoadFlg && windowLoadFlg){
        // 全てのパーツの読み込みが終われば..
        setBackToPageTopBtn();
        openThisPage();
    }
    else{
        // パーツの読み込み待ち
        setTimeout(viewCheck, 1000);
    }
}

function openThisPage() {
    // ローディングアニメーションの停止
    document.body.querySelector('div#loadingImage').style.animationName = 'none';
    // 表示
    document.body.style.backgroundColor = '#fff'; // 背景を白に戻す
    headerElement.style.visibility = 'visible'; // headerを表示
    mainElement.style.visibility = 'visible'; // mainを表示
    footerElement.style.visibility = 'visible'; // footerを表示
    // ローディングスクリーンのフェード
    loadingScreenElement.style.opacity = 0;
    loadingScreenElement.style.transitionProperty = 'opacity';
    loadingScreenElement.style.transitionDuration = '1.0s';
    loadingScreenElement.style.transitionTimingFunction = 'ease';
    setTimeout(
        function(){
            loadingScreenElement.style.display = 'none';
        }, 1000);
    // アンカーの設定
    const anchorTags = document.querySelectorAll('a:not([href="#"])');
    for(let anchor of anchorTags) {
        anchor.addEventListener('click',aClick);
    }
    function aClick(evt) {
        evt.preventDefault();
        //
        loadingScreenElement.style.display = 'block';
        loadingScreenElement.style.opacity = 1;
        //
        if( evt.target.href !== undefined ){
            location.href = evt.target.href;
        }
        else if( evt.target.offsetParent.href !== undefined) {
            location.href = evt.target.offsetParent.href;
        }
    }
}


/* /// header,footerの読み込み /// */
fetch("/common/header.html")
    .then((response) => response.text())
    .then((data) => {
            document.querySelector("header").insertAdjacentHTML('afterbegin', data);
            headerLoadFlg = true; // フラグの追加
        })
    .catch((error) => {
        console.log('served等を経由して表示させてください。');
        console.log('headerLoad:',error); // エラーログの追加
    });

fetch("/common/footer.html")
    .then((response) => response.text())
    .then((data) => {
        document.querySelector("footer").insertAdjacentHTML('afterbegin', data);
        footerLoadFlg = true; // フラグの追加
    })
    .catch((error) => {
        console.log('served等を経由して表示させてください。');
        console.log('footerLoad:',error); // エラーログの追加
    });

const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = '/common/style.css';
document.head.appendChild(cssLink);

/* /// ページTopへbtn /// */
// headerとfooterの読み込み後にBackToPageTopBtnの設定
function setBackToPageTopBtn() {
    const menuBtnCheckBox = document.querySelector('input#menuBtn'); // ドロワーのチェックボックス
    const backToPageTopBtn = document.querySelector('div.backToPageTopBtn'); // トップへボタン
    let backToPageTopBtnIs = false; // ボタン表示フラグ
    //
    window.addEventListener('scroll', checkScrollFunc); // スクロール時のリスナー
    window.addEventListener('resize', checkResizeFunc); // リサイズ時のリスナー
    menuBtnCheckBox.addEventListener('change', checkScrollFunc); // ドロワー開閉のリスナー
    //
    function checkScrollFunc(evt) {
        let myScrollY = window.scrollY;
        //console.log( myScrollY );
        if (!backToPageTopBtnIs && myScrollY > 775 && !menuBtnCheckBox.checked) {
            // ボタン非表示で、スクロールが700をこえてたら...
            backToPageTopBtn.style.bottom = `${backToPageTopBtn.clientHeight}px`; // 画面内へ
            backToPageTopBtnIs = true;
        }
        else if ( (backToPageTopBtnIs && myScrollY <= 775) || menuBtnCheckBox.checked ) {
            // ボタン表示で、スクロールが700以下なら...
            backToPageTopBtn.style.bottom = `-${100 + 20}px`; // 画面外へ
            backToPageTopBtnIs = false;
        }
    }
    //
    function checkResizeFunc(evt) {
        checkScrollFunc(); // スクロールボタンの表示の再考
        if (backToPageTopBtnIs) {
            // 画面がリサイズされた時に、ボタンが表示されていたら...
            backToPageTopBtn.style.bottom = `${backToPageTopBtn.clientHeight}px`; // 表示位置を再設定
        }
        // レスポンシブでのドロワー挙動対応
        if (window.innerWidth > 768) {
            menuBtnCheckBox.checked = false;
        }
    }
}
