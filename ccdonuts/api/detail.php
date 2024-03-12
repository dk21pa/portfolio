<?php
session_start();
require '../header.php';
require '../common/function.php';

//GETメソッドの直打ち対策
$products = readProductsTabel();
$max = count($products);
$id = 1;
if (isset($_GET['id']) && is_numeric($_GET['id']))
    $id = min(max(1, intval($_GET['id'])), $max);

$product = $products[$id - 1];
$name = getCustomerName();
?>

<body>
    <main>
        <div><a href="../index.php">TOP</a>＞<a href="../products.php">商品一覧</a>＞<?= $product['name'] ?></div>
        <hr>
        <div>ようこそ <?= $name ?>様</div>
        <hr>
        <section id="detail">
            <a href="detail.php?id=<?= ($id + $max - 2) % $max + 1 ?>" method="get">
                <div class="arrow left"></div>
            </a>
            <img src='../images/donuts<?= $product['id'] ?>.jpg' alt='ドーナツ'>
            <div>
                <h3><?= $product["name"] ?></h3>
                <p><?= $product["intro"] ?></p>
                <div class='price'>税込 &yen;<?= number_format($product["price"]) ?></div>
                <form action="redirect.php" method="POST">
                    <div>
                        <input type='number' name="cart<?= $product['id'] ?>" value="1">個
                        <button>カートに入れる</button>
                        <div></div>
                    </div>
                </form>
            </div>
            <a href="detail.php?id=<?= $id % $max + 1 ?>" method="get">
                <div class="arrow right"></div>
            </a>
        </section>
    </main>
    <?php require '../footer.php' ?>