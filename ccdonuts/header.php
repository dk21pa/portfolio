<?php
// error_reporting(0);

//  "/ccdonuts/api/login.php" から "login" を取り出す
$fileName = (explode('.', basename($_SERVER['PHP_SELF']))[0]);
$isCardPage = preg_match("/^card/", $fileName);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php if ($isCardPage) : ?>
        <meta name="robots" content="noindex">
    <?php endif ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Serif+JP&family=Poppins&family=Roboto&display=swap" rel="stylesheet">
    <title>C.C.Donuts | <?= $fileName ?></title>
    <link rel="stylesheet" href="/ccdonuts/common/reset.css">
    <link rel="stylesheet" href="/ccdonuts/common/common.css">
    <link rel="stylesheet" href="/ccdonuts/styles/index.css">
    <link rel="stylesheet" href="/ccdonuts/styles/products.css">
    <link rel="stylesheet" href="/ccdonuts/api/api.css">
    <header>
        <div id="headerMain">
            <input type="checkbox" id="drawerBtn">
            <label for="drawerBtn">
                <div id="drawerIcon"></div>
            </label>
            <div id="drawerMenu">
                <label for="drawerBtn">
                    <img src="/ccdonuts/images/closeBtn.png" alt="" id="closeBtn">
                </label>
                <img src="/ccdonuts/images/logo.svg" alt="ロゴ" id="logo">
                <nav>
                    <ul>
                        <li> <a href="/ccdonuts/index.php">TOP</a></li>
                        <li> <a href="/ccdonuts/products.php">商品一覧</a></li>
                        <li> <a href="#">よくある質問</a></li>
                        <li> <a href="#">お問い合わせ</a></li>
                        <li> <a href="#">当サイトのポリシー</a></li>
                    </ul>
                </nav>
            </div>

            <a href="/ccdonuts/index.php"><img src="/ccdonuts/images/logo.svg" alt="ロゴ"></a>
            <div id="headerLink">
                <?php if (isset($_SESSION['customer'])) : ?>
                    <a href="/ccdonuts/api/logout.php">
                        <div>
                            <div></div>
                            <span></span>
                        </div>
                        <p> ログアウト </p>
                    </a>
                <?php else : ?>
                    <a href="/ccdonuts/api/login.php">
                        <img src="/ccdonuts/images/headerLoginLogo.svg" alt="ログイン">
                        <p> ログイン </p>
                    </a>
                <?php endif ?>
                <a href="/ccdonuts/api/cart.php">
                    <img src="/ccdonuts/images/headerCartLogo.svg" alt="カート">
                    <p> カート</p>
                </a>
            </div>
        </div>
        <form action="/ccdonuts/products.php" method="post">
            <div id="headerSub">
                <button id="searchBtn"></button>
                <input id="searchWord" name="word">
            </div>
        </form>
    </header>