<?php
session_start();
require '../header.php';
require '../common/function.php';
unset($_SESSION['tempCustomer']);
$name = getCustomerName();

?>
<main>
    <div><a href="../index.php">TOP</a>＞ログイン</div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="login">
        <p>ログイン</p>
        <div>
            <form action="loginResult.php" method="post">
                <?php if (isset($_SESSION['customer'])) : ?>
                    <div class="input"><?= $name ?>様として既にログインしています。</div>
                <?php else : ?>
                    <div class="input">
                        <p>メールアドレス</p>
                        <input type="email" name="mail">
                    </div>
                    <div class="input">
                        <p>パスワード</p>
                        <input type="password" name="password">
                    </div>
                    <button>ログインする</button>
                <?php endif; ?>
            </form>
        </div>
        <?php if (!isset($_SESSION['customer'])) : ?>
            <a href="resist.php">会員登録はこちら</a>
        <?php endif ?>
    </section>
</main>
<?php require '../footer.php' ?>