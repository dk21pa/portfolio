<?php
require 'common/header.php';
require 'common/function.php';
require 'common/menu.php';

$login = h($_POST['login']);
$name = h($_POST['name']);
if (!canUseLogin($login)) {
    //login名に被りがある時(作れないとき)
    echo 'ログイン名「' . $login . '」は既に使用されているので変更してください。<br>';
    echo '<a href="user-resist.php">ユーザー登録へ戻る</a>';
    endScript();
}

$loginpPattern = '/^[a-zA-Z\d]{4,}$/';
$namePattern = '/\S+/';
$pwPattern =  '/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/';
$isResistable = true;
if (!preg_match($loginpPattern, $login)) {
    $isResistable = false;
    echo '<p>ログイン名は4文字以上の英数字で入力して下さい</p>';
}
if (!preg_match($namePattern, $name)) {
    $isResistable = false;
    echo '<p>空白のみの名前は使えません</p>';
}
if (!preg_match($pwPattern, $_POST['password1'])) {
    $isResistable = false;
    echo '<p>パスワードは6文字以上で数字と英字を含めて下さい</p>';
}
if (!$_POST['password1'] === $_POST['password2']) {
    $isResistable = false;
    echo '<p>確認用パスワードが違います</p>';
}
if (!$isResistable) {

    endScript();
}
unset($_SESSION['user']);

try {
    //ユーザー情報登録
    $hash = password_hash($_POST['password1'], PASSWORD_DEFAULT);
    $userData = [
        'login' => $login,
        'name'  => $name,
        'hash'  => $hash,
    ];

    //ユーザー登録(DB)
    $userID = insertUserRecord($userData);
    insertProfile($userID);

    //ユーザー登録(session)
    $_SESSION['user'] = ['id' => $userID, 'login' => $login, 'name' => $name];

    //初期アイコンの作成
    $defaultIcon = "image/icon/default_icon_" . rand(0, 3) . ".png";
    $directory = "image/icon/";
    $iconNumber = str_pad($userID, 3, '0', STR_PAD_LEFT);
    $fileName = "icon_$iconNumber.png";
    copy($defaultIcon, $directory . $fileName);
?>

    <?= $name ?> さんのアカウントを登録しました。
    <a href="mypage.php">マイページへ</a>

<?php
} catch (error) {
    echo 'エラー発生';
}
?>
<?php require 'common/footer.php'; ?>