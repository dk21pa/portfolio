<?php
session_start();
require '../common/function.php';

unset($_SESSION['tempCustomer']);
if (isset($_SESSION['customer']) || empty($_POST))
    header('Location: resist.php');

$name     = h($_POST['name']);
$furigana = h($_POST['furigana']);
$post1    = h($_POST['post1']);
$post2    = h($_POST['post2']);
$address  = h($_POST['address']);
$email    = h($_POST['email']);

$canResist = false;
if (
    preg_match('/^\S.{0,99}$/', $name) &&
    preg_match('/^\S.{0,99}$/', $furigana) &&
    preg_match('/^\d{3}$/', $post1) &&
    preg_match('/^\d{4}$/', $post2) &&
    preg_match('/^\S.{0,199}$/', $address) &&
    preg_match('/^(?=.*[a-zA-Z])(?=.*\d).{6,100}$/', $_POST['password']) &&
    preg_match('/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,100}$/', $email)
) {
    $canResist = true;
    $_SESSION['tempCustomer'] = [
        'name'     => $name,
        'furigana' => $furigana,
        'post1'    => $post1,
        'post2'    => $post2,
        'address'  => $address,
        'password' => $_POST['password'],
        'email'    => $email,
    ];
    $tempCust = $_SESSION['tempCustomer'];
}
require '../header.php';
?>

<body>
    <main>
        <div><a href="../index.php">TOP</a>＞<a href='login.php'>ログイン</a>＞
            <a href="resist.php">会員登録</a>＞入力確認
        </div>
        <hr>
        <div>ようこそゲスト様</div>
        <hr>
        <section id="resist" class="confirm">
            <?php if ($canResist) : ?>
                <p>入力確認</p>
                <div>
                    <form action="resistResult.php" method="post">
                        <div class="input">
                            <p>お名前</p>
                            <p><?= $tempCust['name'] ?></p>
                        </div>
                        <div class="input">
                            <p>お名前（フリガナ）</p>
                            <p><?= $tempCust['furigana'] ?></p>
                        </div>
                        <div class="input">
                            <p>郵便番号</p>
                            <p><?= $tempCust['post1'] . " - " . $tempCust['post2'] ?></p>
                        </div>
                        <div class="input">
                            <p>住所</p>
                            <p><?= $tempCust['address'] ?></p>
                        </div>
                        <div class="input">
                            <p>メールアドレス</p>
                            <p><?= $tempCust['email'] ?></p>
                        </div>
                        <div class="input">
                            <p>パスワード</p>
                            <p>※セキュリティ上表示できません</p>
                        </div>
                        <button name="resist">登録する</button>
                    </form>
                </div>
            <?php else : ?>
                <p>入力不備</p>
                <div>
                    <p>入力に不備があります。</p>
                    <form action="resist.php">
                        <button>会員登録へ戻る</button>
                    </form>
                </div>
            <?php endif ?>
            <form action="resistResult.php">
        </section>
    </main>
    <?php require '../footer.php' ?>