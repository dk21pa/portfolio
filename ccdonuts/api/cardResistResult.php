<?php
session_start();
require '../header.php';
require '../common/function.php';

if (!isset($_SESSION['customer']))
    header('Location: login.php');
if (!isset($_SESSION['card']))
    header('Location: resist.php');

insertCardRecord();
unset($_SESSION['card']);
$name = getCustomerName();
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='cart.php'>カート</a>
        ＞<a href='purchase.php'>購入確認</a>＞<a href="cardResist.php">カード情報</a>＞登録完了
    </div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="resist">
        <p>カード情報登録完了</p>
        <div>
            <p>支払情報登録が完了しました。</p>
            <p>続けて購入確認ページへお進みください。</p>
        </div>
        <a href="purchaseConfirm.php">購入確認ページへ進む</a>
    </section>
</main>
<?php require '../footer.php' ?>