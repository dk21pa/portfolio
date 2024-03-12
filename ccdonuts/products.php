<?php
session_start();
require 'header.php';
require 'common/function.php';

$name = getCustomerName();
$word = '';
if (isset($_POST['word']))
    $word = h($_POST['word']);
$products = readProductsTabel($word);
?>

<body>
    <main>
        <div><a href="index.php">TOP</a>＞商品一覧</div>
        <hr>
        <div>ようこそ <?= $name ?>様</div>
        <hr>
        <section id="list">
            <h2>商品一覧</h2>
            <?php if ($word === '') : ?>
                <h3>メインメニュー</h3>
            <?php else : ?>
                <h3>"<?= $word ?>"での検索結果</h3>
            <?php endif ?>

            <div class="listWrap">
                <?php if (empty($products)) : ?>
                    <h3>該当する商品はありません。</h3>
                <?php else : ?>
                    <?php for ($i = 0; $i < count($products); $i++) :
                        $p = $products[$i]; ?>
                        <?php if ($i === 6 && $word === '') {
                            echo <<<END
                                </div>
                                <h3>バラエティセット</h3>
                                <div class='listWrap'>
                            END;
                        } ?>
                        <div class='donuts'>
                            <a href='api/detail.php?id=<?= $p['id'] ?>'>
                                <img src='images/donuts<?= $p['id'] ?>.jpg' alt='ドーナツ'>
                            </a>
                            <div class='donutsName'><?= $p['name'] ?></div>
                            <div class='price'>税込 &yen;<?= number_format($p['price']) ?></div>
                            <form action="api/redirect.php" method="POST">
                                <button name="cart<?= $p['id'] ?>">カートに入れる</button>
                            </form>
                        </div>
                    <?php endfor; ?>
                <?php endif;  ?>
            </div>
        </section>
    </main>
    <?php require 'footer.php' ?>