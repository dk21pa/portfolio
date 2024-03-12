<?php
session_start();
require '../common/function.php';
require '../header.php';
if (!isset($_POST['purchase']))
    header('Location: purchaseConfirm.php');

$securityCheck = false;
if (intval($_POST['security']) === readCardRecord()['security'])
    $securityCheck = true;

$name = getCustomerName();
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='cart.php'>カート</a>
        ＞購入確認＞購入完了
    </div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="purchase">
        <?php if ($securityCheck) :
            updateSalesTable();
            unset($_SESSION['cart']);
        ?>
            <p>ご購入完了</p>
            <div>
                <p>ご購入ありがとうございました。</p>
                <p>今後ともご愛顧の程、宜しくお願いいたします。</p>
            </div>
            <a href="../index.php">TOPページへすすむ</a>
        <?php else : ?>
            <p>ご購入未完了</p>
            <div>
                <p>ご購入できませんでした。</p>
                <p>セキュリティコードが違います。</p>
            </div>
            <a href="purchaseConfirm.php">購入確認ページへもどる</a>

        <?php endif ?>
    </section>
</main>
<?php require '../footer.php' ?>