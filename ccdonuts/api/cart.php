<?php
session_start();
require '../header.php';
require '../common/function.php';
$name = getCustomerName();
$products = readProductsTabel();

//$_SESSION['cart']がなければすべて0個で初期化
setSessionCart(count($products));

$total = 0;
//前ページの操作によってカート内の個数を変える
for ($i = 1; $i <= count($products); $i++) {
    if (isset($_POST["delete" . $i])) {
        $_SESSION['cart'][$i . "count"] = 0;
    } else if (isset($_POST["reCalc" . $i])) {
        $_SESSION['cart'][$i . "count"] = max(0, intval($_POST['reCalc' . $i]));
    }
    $total += $products[$i - 1]['price'] * $_SESSION['cart'][$i . "count"];
}
?>

<body>
    <main>
        <div><a href="../index.php">TOP</a>＞カート</div>
        <hr>
        <div>ようこそ <?= $name ?>様</div>
        <hr>
        <section id="cart">
            <?php if ($total > 0) { ?>
                <div class="confirm">
                    <div>現在 商品<?= array_sum($_SESSION['cart']) ?>点</div>
                    <div>ご注文小計：税込<span> &yen;<?= number_format($total) ?> </span></div>
                    <a href="purchaseConfirm.php">購入確認へ進む</a>
                </div>
                <?php
                for ($i = 1; $i <= count($products); $i++) :
                    $count = $_SESSION['cart'][$i . 'count'];
                    if ($count === 0) continue;
                ?>
                    <div class='item'>
                        <a href="detail.php?id=<?= $i ?>"><img src='../images/donuts<?= $i ?>.jpg' alt='ドーナツ'></a>
                        <div>
                            <h3><?= $products[$i - 1]['name'] ?></h3>
                            <form method='POST' action='/ccdonuts/api/cart.php'>
                                <div>
                                    <div class='price'>税込 &yen;<?= number_format($products[$i - 1]['price']) ?></div>
                                    <div class="num">
                                        数量
                                        <input type='number' name='reCalc<?= $i ?>' value='<?= $count ?>'>
                                        個
                                    </div>
                                </div>
                                <button class='reCalc'>再計算</button>
                            </form>
                            <form method="POST" action="/ccdonuts/api/cart.php">
                                <button name='delete<?= $i ?>' class='delete'>削除する</button>
                            </form>
                        </div>
                    </div>
                <?php endfor ?>
                <div class="confirm">
                    <div>現在 商品<?= array_sum($_SESSION['cart']) ?>点</div>
                    <div>ご注文小計：税込<span> &yen;<?= number_format($total) ?></span></div>
                    <a href="purchaseConfirm.php">購入確認へ進む</a>
                </div>
            <?php
            } else {
                echo "<p>カートの中身は空です</p>";
            }
            ?>
            <a href="../products.php">買い物を続ける</a>
        </section>
    </main>
    <?php require '../footer.php' ?>