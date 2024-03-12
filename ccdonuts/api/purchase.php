<?php
session_start();
require '../header.php';
require '../common/function.php';

//ログインしてなければログインページに飛ばす
if (!isset($_SESSION['customer']))
    header('Location: login.php');
//カートに商品がなければ商品ページに飛ばす
if (!isset($_SESSION['cart']))
    header('Location: ../products.php');

$total = 0;
$products = readProductsTabel();
$name = getCustomerName();
$customer = $_SESSION['customer'];
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='cart.php'>カート</a>＞購入確認</div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="purchase">
        <p>ご購入確認</p>
        <form action="cardResist.php" method="post">
            <p>ご購入商品</p>
            <?php for ($i = 1; $i <= count($products); $i++) :
                $count = $_SESSION['cart'][$i . 'count'];
                if ($count === 0) continue;

                $p = $products[$i - 1];
                $subTotal = $p['price'] * $count;
                $total += $subTotal;
            ?>
                <div class="item">
                    <div>
                        <span>商品名</span>
                        <span><?= $p['name'] ?></span>
                    </div>
                    <div>
                        <span>数量</span>
                        <span><?= $count ?>個</span>
                    </div>
                    <div>
                        <span>金額</span>
                        <span>税込 &yen;<?= number_format($subTotal) ?></span>
                    </div>
                </div>
            <?php endfor ?>
            <div class="item sum">
                <div>
                    <span>数量合計</span>
                    <span><?= array_sum($_SESSION['cart']) ?>個</span>
                </div>
                <div>
                    <span>合計金額</span>
                    <span>税込 &yen;<?= number_format($total) ?></span>
                </div>
            </div>
            <p>お届け先</p>
            <div class="item">
                <div>
                    <span>お名前</span>
                    <span><?= $customer['name'] ?></span>
                </div>
                <div>
                    <span>郵便番号</span>
                    <span><?= $customer['postcode_a'] . '-' . $customer['postcode_b'] ?></span>
                </div>
                <div>
                    <span>住所</span>
                    <span><?= $customer['address'] ?></span>
                </div>
            </div>
            <p>お支払方法</p>
            <button name="purchase">カード登録する</button>
            <p id="note">カード情報登録がまだの方はこちらにお進みください</p>
        </form>
    </section>
</main>
<?php require '../footer.php' ?>