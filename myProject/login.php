<?php
require 'common/header.php';
require 'common/menu.php';

if (isset($_SESSION['user'])) {
    header("Location: mypage.php");
    exit();
}
?>
<p id="loginTitle">ログイン</p>
<p>↓アカウントを持っている方はこちらから↓</p>
<div class="container">
    <form action="mypage.php" method="post">
        <p>ログイン名<input type="text" name="login" id='login'><br><span id='loginMsg'>※半角英数字4文字以上</span></p>
        <p> パスワード<input type="password" name="password" id='password'><br><span id='pwMsg'>※英字と数字を含む6文字以上の文字列</span></p>
        <input type="submit" value="ログイン" id="submit">
    </form>
</div>
<hr>
<p>↓アカウントを作らずにログイン↓</p>
<div class="container">
    <form action="mypage.php">
        <input type="submit" value="ゲストログイン">
    </form>
</div>
<hr>
<div class="container">
    <p>↓新しくアカウントを作る方はこちらから↓</p>
    <p><a href="user-resist.php">新規ユーザー登録</a></p>
</div>
<?php require 'common/footer.php'; ?>