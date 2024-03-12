<?php
session_start();
require '../common/function.php';

if (isset($_POST['resist']))
    header('Location: resist.php');

insertCustomerRecord();
unset($_SESSION['tempCustomer']);
require '../header.php';
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='login.php'>ログイン</a>＞
        <a href="resist.php">会員登録</a>＞会員登録完了
    </div>
    <hr>
    <div>ようこそ ゲスト様</div>
    <hr>
    <section id="resist">
        <p>会員登録完了</p>
        <div>
            <p>会員登録が完了しました。</p>
            <p>ログインページへお進みください。</p>
        </div>
        <a href="cardResist.php">クレジットカード登録へすすむ</a>
        <a href="purchase.php">購入確認ページへ進む</a>
    </section>
</main>
<?php require '../footer.php' ?>