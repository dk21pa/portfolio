<?php
//error_reporting(0);
require 'common/header.php';
require 'common/function.php';

$loginErrorMessage = 'ログイン名かパスワードが違います。';

//login名を入力したログイン時
if (isset($_POST['login'])) {
    $login = h($_POST['login']);
    setSessionUser($login);

    //ログイン名が存在しない時
    if (!isset($_SESSION['user'])) {
        require 'common/menu.php';
        echo $loginErrorMessage;
        endScript();
    }

    //パスワードが違う時
    if (!isCorrectPW($login, $_POST['password'])) {
        unset($_SESSION['user']);
        require 'common/menu.php';
        echo $loginErrorMessage;
        endScript();
    }
}

//url直打ち or ゲストログインの時
if (!isset($_SESSION['user'])) {
    setSessionUser('guest');
}

require 'common/menu.php';

$user = $_SESSION['user'];
setSessionProfile();
$profile = $_SESSION['profile'];

//アイコン画像の取得
$iconNum = str_pad($user['id'], 3, '0', STR_PAD_LEFT);
$iconPath = "image/icon/icon_$iconNum";
$extensions = array("jpg", "jpeg", "png", "gif");
foreach ($extensions as $ext) {
    $iconSrc = $iconPath . '.' . $ext;
    if (file_exists($iconSrc)) break;
}
?>
<div id='profile'>
    <div class='icon'>
        <div id="profileImage" class="hoverable">
            <img src="<?= $iconSrc ?>" alt="アイコン">
        </div>
        <p><?= $user['name'] ?></p>
    </div>
    <div>
        <span id='message'>
            <textarea maxlength="30" disabled><?= $profile['message'] ?></textarea>
        </span>
        <div id='messageBtn'>
            <button class="updateProfile">変更する</button><button class="undoProfile">元に戻す</button>
        </div>
    </div>
</div>
<div>
    <?php
    if ($fact = readTrivia()) {
        $fact = ': ' . $fact;
        $disabled = "disabled";
    } else {
        $fact = 'を表示する';
        $disabled = '';
    }
    ?>
    <button id="trivia" <?= $disabled ?>>今日の豆知識<span><?= $fact ?></span></button>
</div>

<div class="gameDisplay">
    <div id="game">
        <div id="score"></div>
    </div>
    <div>
        <button id="newGame">新しくゲームを始める</button>
        <table id="ranking"></table>
    </div>
</div>

<div class="modal">
    <img src="image/UI/cancelButton.png" alt="キャンセルボタン" class='undoProfile'>
    <div>
        <button class='updateProfile'>このアイコンを使う</button>
    </div>
    <div class="modalWrapper">
        <div>
            <label id="fileBtn" for="imageFile">
                画像を変更<input type="file" id="imageFile" accept="image/*">
            </label>
        </div>
        <div class="icon">
            <div id="imageContainer">
                <img src="<?= $iconSrc ?>" alt="アイコン">
            </div>
            <div id="radiusSlider">
                ■<input type="range" min="0" max="50" step="1" value="<?= $profile['radius'] ?>">●
            </div>
        </div>
        <div>
            <input type="color" id="colorPicker" value="<?= $profile['color'] ?>">
        </div>
    </div>
</div>
<div id='overLay'></div>
<script src="scripts/mypage.js" type="module"></script>
<script src="scripts/game.js" type="module"></script>
<?php require 'common/footer.php'; ?>