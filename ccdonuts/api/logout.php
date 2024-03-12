<?php
session_start();
require '../common/function.php';
unset($_SESSION['tempCustomer']);

$login = true;
if (isset($_POST['logout'])) {
    unset($_SESSION['customer'], $_SESSION['cart']);
    $login = false;
}
require '../header.php';
$name = getCustomerName();

?>
<main>
    <div><a href="../index.php">TOP</a>＞ログアウト</div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="login">
        <p>ログアウト</p>
        <div>
            <form action="logout.php" method="post">
                <?php if ($login) : ?>
                    <div class="input">ログアウトしますか？</div>
                    <button name="logout">ログアウト</button>
                <?php else : ?>
                    <div class="input">ログアウトしました。</div>
                <?php endif ?>
            </form>
        </div>
        <a href="../index.php">TOPページへもどる</a>
    </section>
</main>
<?php require '../footer.php' ?>