<?php
require 'common/header.php';
require 'common/menu.php';
if (isset($_SESSION['user'])) : ?>
    <p><?= $_SESSION['user']['name'] ?>さん、ログアウトしますか？</p>
    <p><a href="logout-result.php">ログアウトする</a></p>
    <p><a href="mypage.php">やっぱりマイページに戻る</a></p>
<?php else : ?>
    <p>すでにログアウトしています</p>
<?php
endif;
require 'common/footer.php'; ?>