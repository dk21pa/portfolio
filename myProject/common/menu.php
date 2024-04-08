<div id='menu'>
    <button><a href="index.php">トップ</a></button>
    <?php if (isset($_SESSION['user'])) : ?>
        <a href="mypage.php">マイページ</a>
        <a href="logout.php">ログアウト</a>
        <?php if ($_SESSION['user']['login'] !== 'guest') : ?>
            <a href="user-edit.php">登録情報変更</a>
        <?php endif ?>
    <?php else : ?>
        <a href="login.php">ログイン</a>
        <a href="user-resist.php">新規登録</a>
    <?php endif ?>
</div>
<hr>