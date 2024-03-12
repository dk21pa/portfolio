<?php
session_start();
if (isset($_SESSION['customer']))
    header('Location: ../index.php');

require '../common/function.php';
require '../header.php';
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='login.php'>ログイン</a>＞会員登録</div>
    <hr>
    <div>ようこそ <?= getCustomerName() ?>様</div>
    <hr>
    <section id="resist">
        <p>会員登録</p>
        <div>
            <form action="resistConfirm.php" method="post">
                <div class="input">
                    <p>お名前<span>（必須）</span></p>
                    <input type="text" name="name" id="name">
                </div>
                <div class="input">
                    <p>お名前（フリガナ）<span>（必須）</span></p>
                    <input type="text" name="furigana" id="furigana">
                </div>
                <div class="input postcode">
                    <p>郵便番号<span>（必須）</span></p>
                    〒<input type="text" name="post1" id='post1'> - <input type="text" name="post2" id="post2">
                </div>
                <div class="input">
                    <p>住所<span>（必須）</span></p>
                    <input type="text" name="address" id="address">
                </div>
                <div class="input">
                    <p>メールアドレス<span>（必須）</span></p>
                    <input type="email" name="email" id="email">
                </div>
                <div class="input">
                    <p>メールアドレス確認用<span>（必須）</span></p>
                    <input type="email" id="email1">
                </div>
                <div class="input">
                    <p>パスワード<span>（必須）</span></p>
                    <p id="pwNote">半角英数字8文字以上20文字以内で入力してください。※記号の使用はできません</p>
                    <input type="password" name="password" id="pw">
                </div>
                <div class="input">
                    <p>パスワード確認用<span>（必須）</span></p>
                    <input type="password" id="pw1">
                </div>
                <button id="resistBtn">入力確認する</button>
            </form>
        </div>
    </section>
</main>
<script src="../common/jquery-3.7.1.min.js"></script>
<script src="../scripts/script.js"></script>
<?php require '../footer.php' ?>