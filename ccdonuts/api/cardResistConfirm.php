<?php
session_start();
require '../header.php';
require '../common/function.php';

unset($_SESSION['card']);
if (!isset($_SESSION['customer']))
    header('Location: login');
if (empty($_POST))
    header('Location: cardResist.php');

$_SESSION['card'] = [
    'name'     => h($_POST['name']),
    'number'   => h($_POST['number']),
    'brand'    => h($_POST['brand']),
    'month'    => h($_POST['month']),
    'year'     => h($_POST['year']),
    'security' => h($_POST['security']),
];
$card = $_SESSION['card'];

$name = getCustomerName();
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='cart.php'>カート</a>
        ＞<a href='purchase.php'>購入確認</a>＞<a href="cardResist.php">カード情報</a>＞情報確認
    </div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="card" class="confirm">
        <p>入力情報確認</p>
        <div>
            <form action="cardResistResult.php" method="post">
                <div class="caution">※当サイトは模擬サイトですので、実際のクレジットカード情報は登録しないでください※</div>

                <div class="input">
                    <p>お名前</p>
                    <p><?= $card['name'] ?></p>
                </div>
                <div class="input">
                    <p>カード番号</p>
                    <p><?= $card['number'] ?></p>
                </div>
                <div class="input" id="brand">
                    <p>カード会社</p>
                    <p><?= $card['brand'] ?></p>
                </div>
                <div class="input" id="expiration">
                    <p>有効期限</p>
                    <p><?= $card['month'] ?>&nbsp;&nbsp;&nbsp;&nbsp;月</p>
                    <p><?= $card['year'] ?>&nbsp;&nbsp;&nbsp;&nbsp;年</p>
                </div>
                <div class="input">
                    <p>セキュリティコード</p>
                    <p><?= $card['security'] ?></p>
                </div>
                <button name="resist">登録する</button>
                <div class="caution">※当サイトは模擬サイトですので、実際のクレジットカード情報は登録しないでください※</div>

            </form>
        </div>
    </section>
</main>
<?php require '../footer.php' ?>