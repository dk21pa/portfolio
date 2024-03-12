<?php
session_start();
require '../common/function.php';
unset($_SESSION['tempCustomer']);
error_reporting(0);
if (!isset($_SESSION['customer'])) {
    if (empty($_POST['mail'] || empty($_POST['password'])))
        header('Location: login.php');
    $mail = $_POST['mail'];
    $password = $_POST['password'];
    $_SESSION['customer'] = getCustomerRecord($mail, $password);
}

$name = getCustomerName();
require '../header.php';
?>
<main>
    <div><a href="../index.php">TOP</a>＞ログイン</div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="login">
        <?php if (isset($_SESSION['customer'])) : ?>
            <p>ログイン完了</p>
            <div>
                <p>ログインが完了しました。</p>
                <p>引き続きお楽しみください。</p>
            </div>
            <a href="purchaseConfirm.php">購入確認ページへすすむ</a>
        <?php else : unset($_SESSION['customer']) ?>
            <p>ログイン失敗</p>
            <div>
                <p>ログインができませんでした。</p>
                <p>メールアドレスまたはパスワードが違います。</p>
            </div>
            <a href="login.php">ログインページへもどる</a>
        <?php endif ?>
        <a href="../index.php">TOPページへもどる</a>
    </section>
</main>
<?php require '../footer.php' ?>