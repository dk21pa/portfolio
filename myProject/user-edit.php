<?php
require 'common/header.php';
require 'common/menu.php';

if (!isset($_SESSION['user'])) {
    echo '<p>ログインしてください</p>';
    endScript();
} else if ($_SESSION['user']['login'] === 'guest') {
    echo '<p>ゲスト情報は変更できません</p>';
    endScript();
}
$login = $_SESSION['user']['login'];
?>
<p>変更する情報を入力してください（空白の場合は変更されません）</p>
<form action='user-edit-result.php' method='post'>
    <div id="userEdit">
        <div class="row1">
            <span>現在のログイン名</span>
            <span></span>
            <span>新しいログイン名</span>
            <span></span>
        </div>
        <div class="row2">
            <span><?= $login ?></span>
            <span>→</span>
            <span><input type='text' name='login' id='login'></span>
            <span id='loginMsg'>※4文字以上の半角英数字</span>
        </div>
        <div class="row1">
            <span>現在の表示名</span>
            <span></span>
            <span>新しい表示名</span>
            <span></span>
        </div>
        <div class="row2">
            <span><?= $_SESSION['user']['name'] ?></span>
            <span>→</span>
            <span><input type='text' name='name' id='name'></span>
            <span id='nameMsg'>※空白のみはNG</span>
        </div>
        <div class="row1">
            <span>新しいパスワード</span>
            <span></span>
            <span>確認用パスワード</span>
            <span></span>
        </div>
        <div class="row2">
            <span><input type='password' name='password1' id='password1'></span>
            <span></span>
            <span><input type='password' name='password2' id='password2'></span>
            <span id='pwMsg2'>※6文字以上の半角英数字</span>
        </div>
    </div>
    <p>
        パスワード入力: <input type='password' name='oldpassword' id='oldpassword'>
        <input type='submit' value='変更' id='update' disabled>
        <span id='submitMsg'></span>
    </p>
</form>
<script src='scripts/script.js'></script>
<?php require 'common/footer.php'; ?>