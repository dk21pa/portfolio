<?php
require 'common/header.php';
require 'common/menu.php';

if (isset($_SESSION['user'])) {
    header("Location: ./mypage.php");
    exit();
}
?>
<p>※登録内容は後から変更できます。</p>
<form action='user-resist-result.php' method='post'>
    <div id="userResist">
        <div>
            <span>ログイン名</span>
            <span><input type='text' name='login' id='login'></span><br>
            <span id='loginMsg'>※4文字以上の半角英数字</span>
        </div>
        <div>
            <span>表示名</span>
            <span><input type='text' name='name' id='name'></span><br>
            <span id='nameMsg'>※空白のみはNG</span>
        </div>
        <div>
            <span>パスワード</span>
            <span><input type='password' name='password1' id='password1'></span><br>
            <span id='pwMsg1'>※数字と英字を含む6文字以上の文字列</span>
        </div>
        <div>
            <span>確認用パスワード</span>
            <span><input type='password' name='password2' id='password2'></span><br>
            <span id='pwMsg2'></span>
        </div>
    </div>
    <p>※パスワードの再発行はできません。</p>
    <input type='submit' value='確定' id='resist' disabled>
</form>
<div id='test'></div>
<script src='scripts/script.js'></script>
<?php require 'common/footer.php'; ?>