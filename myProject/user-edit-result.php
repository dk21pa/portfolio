<?php
require 'common/header.php';
require 'common/function.php';
require 'common/menu.php';
if (!isset($_SESSION['user'])) {
    echo '<p>ログインして下さい</p>';
    exit();
} else if ($_SESSION['user']['login'] === 'guest') {
    echo '<p>ゲスト情報は変更できません</p>';
} else if (!isset($_POST['oldpassword'])) {
    header("Location: user-edit.php");
    exit();
}
if (!isCorrectPW($_SESSION['user']['login'], $_POST['oldpassword'])) {
    echo 'パスワードが違います';
    exit();
}

$id = intval($_SESSION['user']['id']);
if ($_POST['login'] !== '') {
    $login = h($_POST['login']);
    $loginpPattern = '/^[a-zA-Z\d]{4,}$/';
    if (!canUseLogin($login)) {
        echo 'ログイン名「' . $login . '」は既に使用されております。大変お手数をおかけしますが変えろ。<br>';
        echo '<a href="user-resist.php">ユーザー登録に戻る</a>';
        require 'common/footer.php';
        exit();
    }
    if (!preg_match($loginpPattern, $_POST['login'])) {
        echo '<p>ログイン名は4文字以上の英数字で入力して下さい</p>';
    } else {
        updateLogin($id, $login);
        echo '<p>ログイン名を "' . $_SESSION['user']['login'] . '" から "' . $login . '" に変更しました</p>';
        $_SESSION['user']['login'] = $login;
    }
}

if ($_POST['name'] !== '') {
    $name = h($_POST['name']);
    $namePattern = '/\S+/';
    if (!preg_match($namePattern, $_POST['name'])) {
        echo '<p>空白のみの表示名は使えません</p>';
    } else {
        updateName($id, $name);
        echo '<p>表示名を「' . $_SESSION['user']['name'] . '」 から 「' . $name . '」に変更しました</p>';
        $_SESSION['user']['name'] = $name;
    }
}
if ($_POST['password1'] !== '') {
    $pwPattern =  '/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/';
    if (!preg_match($pwPattern, $_POST['password1'])) {
        echo '<p>パスワードは6文字以上で数字と英字を含めて下さい</p>';
    } else if ($_POST['password2'] === '') {
        echo '<p>確認用パスワードが入力されていません</p>';
    } else if ($_POST['password1'] !== $_POST['password2']) {
        echo '<p>確認用パスワードが違います</p>';
    } else {
        updatePW($id, $_POST['password1']);
        echo "<p>パスワードを変更しました</p>";
    }
}


?>
<?php require 'common/footer.php'; ?>
