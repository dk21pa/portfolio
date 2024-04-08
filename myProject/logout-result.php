<?php require 'common/header.php'; ?>
<?php
$islogouted = true;
if (isset($_SESSION['user'])) {
    unset($_SESSION['user']);
    $islogouted = false;
}
require 'common/menu.php';
if ($islogouted)
    echo 'すでにログアウトしています';
else
    echo 'ログアウトしました';
?>
<?php require 'common/footer.php'; ?>
