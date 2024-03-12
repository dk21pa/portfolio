<?php
session_start();
require 'header.php';
require 'common/function.php';
$name = getCustomerName();
$products = readProductsTabel();

//売り上げランク上位からIDを配列で返す
$rankingList = fetchTopSalesIDs();
?>

<body>
    <main>
        <div>ようこそ <?= $name ?>様</div>
        <img src="images/hero.jpg" alt="ヒーロー画像" id="hero">
        <section id="introduction">
            <div id="item1">
                <img src="images/donuts5.jpg" alt="">
                <div id="newProduct">新商品</div>
                <div>サマーシトラス</div>
            </div>
            <div id="item2">
                <img src="images/donutsLife.jpg" alt="">
                <div>ドーナツのある生活</div>
            </div>
            <div id="banner">
                <a href="products.php">
                    <img src="images/productListBanner.jpg">
                    <div>商品一覧</div>
                </a>
            </div>
        </section>
        <section id="policy">
            <div>
                <h2>Philosophy</h2>
                <p>私たちの信念</p>
                <p>"Creating Connections"</p>
                <p>「ドーナツでつながる」</p>
            </div>
        </section>
        <section id="ranking">
            <h2>人気ランキング</h2>
            <div id="rankingWrap">
                <?php for ($i = 0; $i < 6; $i++) :
                    $rank = $products[$rankingList[$i] - 1] ?>
                    <div class="donuts">
                        <div class="rank"><?= $i + 1 ?></div>
                        <a href="api/detail.php?id=<?= $rank['id'] ?>"><img src="images/donuts<?= $rank['id'] ?>.jpg" alt=""></a>
                        <div class="donutsName"><?= $rank['name'] ?></div>
                        <div class="price">税込 &yen;<?= number_format($rank['price']) ?></div>
                        <form action="api/redirect.php" method="post">
                            <button name="cart<?= $rank['id'] ?>">カートに入れる</button>
                        </form>
                    </div>
                <?php endfor ?>
            </div>
        </section>
    </main>
    <?php require 'footer.php' ?>