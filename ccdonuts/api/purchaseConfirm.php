<?php
session_start();
require '../common/function.php';
require '../header.php';

$card = readCardRecord();
$products = readProductsTabel();
$name = getCustomerName();
$total = 0;
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='cart.php'>カート</a>＞購入確認</div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="purchase">
        <p>ご購入確認</p>

        <?php if (!isset($_SESSION['customer'])) : ?>
            <form action="login.php">
                <p>購入にはログインが必要です</p>
                <button>ログイン</button>
            </form>
        <?php elseif (!isset($_SESSION['cart']) || array_sum($_SESSION['cart']) === 0) : ?>
            <form action="../products.php">
                <p>カートの中に商品がありません</p>
                <button>買物を続ける</button>
            </form>
        <?php elseif (empty($card)) : ?>
            <form action="cardResist.php">
                <p>購入にはクレジットカードの登録が必要です</p>
                <button>カード情報登録</button>
            </form>
        <?php else :
            $custmer = $_SESSION['customer']; ?>
            <form action="purchaseResult.php" method="post">
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
                        <span><?= $custmer['name'] ?></span>
                    </div>
                    <div>
                        <span>郵便番号</span>
                        <span><?= $custmer['postcode_a'] . '-' . $custmer['postcode_b'] ?></span>
                    </div>
                    <div>
                        <span>住所</span>
                        <span><?= $custmer['address'] ?></span>
                    </div>
                </div>
                <p>お支払方法</p>
                <div class="item">
                    <div>
                        <span>お支払い</span>
                        <span>クレジットカード</span>
                    </div>
                    <div>
                        <span>ブランド</span>
                        <span>ブランド：<?= $card['brand'] ?></span>
                    </div>
                </div>
                <div class="item last">
                    <div>セキュリティコード</div>
                    <div><input type="number" name="security"></div>
                </div>
                <button name="purchase">購入を確定する</button>
            </form>
        <?php endif ?>
    </section>
</main>
<?php require '../footer.php' ?>