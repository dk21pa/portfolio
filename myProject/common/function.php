<?php
require __DIR__ . "/config.php";
$dsn = "mysql:host=" . DB_HOST . "; dbname=" . DB_NAME . "; charset=utf8";
$pdo = new PDO($dsn, DB_USER, DB_PASS);

//JavaScriptとの非同期通信
if (isset($_POST['function'])) {
    session_start();
    $response;
    switch ($_POST['function']) {
        case 'canUseLogin':
            $login = $_POST['login'];
            $response = canUseLogin($login);
            break;
        case 'isCorrectPW':
            $login = $_SESSION['user']['login'];
            $response = isCorrectPW($login, $_POST['oldpassword']);
            break;
        case 'readProfile':
            $response = readProfile();
            break;
        case 'updateProfileTable':
            $profileData = array_map('h', $_POST);
            $response = updateProfileTable($profileData);
            break;
        case 'translate':
            $text  = $_POST['text'];
            $lang = $_POST['lang'];
            $response = deeplTranslate($text, $lang);
            break;
        case 'chatGPT':
            $prompt = $_POST['prompt'];
            $option = $_POST['option'];
            $response = chatGPT($prompt, $option);
            break;
        case 'NinjasApi':
            $directory = $_POST['directory'] ?? "";
            $option = $_POST['option'] ?? "";
            $response = NinjasApi($directory, $option);
            break;
        case 'insertTrivia':
            $response = insertTrivia();
            break;
        case 'getIconPath':
            $response = getIconPath();
            break;
        case 'insertRanking':
            $score = $_POST['score'];
            $response = insertRankingRecord($score);
            break;
        case 'getRanking':
            $limit = $_POST['limit'] ?? 5;
            $response = getRanking($limit);
            break;
        case 'uploadIconImage':
            if (isset($_FILES['image'])) {
                $iconFile = $_FILES['image'];
                $response = uploadIconImage($iconFile);
            }
            break;
    }
    echo json_encode($response);
    exit();
}

function h($str)
{
    return htmlspecialchars($str);
}

function debug($var)
{
    echo '<pre>';
    var_dump($var);
    echo '</pre>';
}

//新規ユーザー登録
function insertUserRecord($userData)
{
    global $pdo;
    $stmt1 = $pdo->prepare('INSERT INTO users VALUES(null, ?, ?, ?)');
    $stmt1->execute([$userData["login"], $userData["name"], $userData["hash"]]);
    $userID = $pdo->lastInsertId();

    // $stmt2 = $pdo->prepare("INSERT INTO profile (profile_id) VALUES(?)");
    // $stmt2->execute([intval($userID)]);
    return $userID;
}
function insertProfile($userID)
{
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO profile (profile_id) VALUES(?)");
    $stmt->execute([intval($userID)]);
}

//DBからユーザー情報を取得してセッションに格納
function setSessionUser($login)
{
    global $pdo;
    $userTable = $pdo->prepare('SELECT * FROM users WHERE login = ?');
    $userTable->execute([$login]);
    foreach ($userTable as $row) {
        $_SESSION['user'] = ['id' => intval($row['id']), 'login' => $row['login'], 'name' => $row['name']];
    }
}

//DBからプロフィールを取得してセッションに格納
function setSessionProfile()
{
    global $pdo;
    $profileTable = $pdo->prepare('SELECT * FROM profile WHERE profile_id = ?');
    $profileTable->execute([$_SESSION['user']['id']]);
    foreach ($profileTable as $row) {
        $_SESSION['profile'] = [
            'message' => $row['message'],
            'color'   => $row['iconBgColor'],
            'radius'  => $row['iconRadius'],
        ];
    }
}

//ログイン名の重複チェック
function canUseLogin($newLogin)
{
    try {
        global $pdo;
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = $pdo->prepare("SELECT COUNT(*) FROM users WHERE login = ?");
        $sql->execute([$newLogin]);
        $canUse = $sql->fetchColumn() === 0;
        return $canUse;
    } catch (PDOException $e) {
        return array('error' => $e->getMessage());
    }
}

//パスワードの認証
function isCorrectPW($login, $password)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT hash FROM users WHERE login = ?");
    $stmt->execute([$login]);
    $userRecord = $stmt->fetch(PDO::FETCH_ASSOC);

    $hash = $userRecord['hash'];
    if (password_verify($password, $hash))
        return true;
    else
        return false;
}

//DBからユーザープロフィールを取得
function readProfile()
{
    global $pdo;
    $stmt = $pdo->prepare('SELECT * FROM profile WHERE profile_id = ?');
    $stmt->execute([$_SESSION['user']['id']]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    return $profile;
}

//表示名の更新
function updateName($id, $newName)
{
    global $pdo;
    try {
        $userTable = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");
        $userTable->execute([$newName, $id]);
    } catch (PDOException $e) {
        echo "トランザクション中にエラー発生：" . $e->getMessage();
    }
}
//ログイン名の変更
function updateLogin($id, $newLogin)
{
    global $pdo;
    try {
        $userTable = $pdo->prepare("UPDATE users SET login = ? WHERE id = ?");
        $userTable->execute([$newLogin, $id]);
    } catch (PDOException $e) {
        echo "トランザクション中にエラー発生：" . $e->getMessage();
    }
}

//パスワードの変更
function updatePW($id, $newPassword)
{
    global $pdo;
    try {
        $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $pdo->beginTransaction();
        $userTable = $pdo->prepare("UPDATE users SET hash = ? WHERE id = ?");
        $userTable->execute([$newHash, $id]);
        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo "トランザクション中にエラー発生：" . $e->getMessage();
    }
}

//プロフィールテーブルの変更
function updateProfileTable($profileData)
{
    global $pdo;
    try {
        $p = $profileData;
        $stmt = $pdo->prepare("UPDATE profile SET iconRadius = ?, message = ?, iconBgColor = ?, iconX = ?, iconY = ?, scale = ? WHERE profile_id = ?");
        $stmt->execute([$p["radius"], $p["message"], $p["color"], $p["iconX"], $p["iconY"], $p["scale"], $_SESSION['user']['id']]);
        return array('compleated' => true);
    } catch (PDOException $e) {
        return array('error' => $e->getMessage());
    }
}

//アイコンのファイル名を返す
function getIconPath()
{
    $extensions = array("jpg", "jpeg", "png", "gif");
    $num = str_pad($_SESSION['user']['id'], 3, '0', STR_PAD_LEFT);

    $iconPath = __DIR__ . "/../image/icon/icon_$num.";

    foreach ($extensions as $ext) {
        if (file_exists($iconPath . $ext))
            return "./image/icon/icon_$num.$ext";
    }
}

function insertRankingRecord($score)
{
    global $pdo;
    $id = $_SESSION['user']['id'];
    $stmt = $pdo->prepare('INSERT INTO ranking (number, user_id, score) VALUES(null, ?, ?)');
    $stmt->execute([$id, $score]);
    $newNumber = $pdo->lastInsertId();
    return $newNumber;
}

function getRanking($limit = 5)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT ranking.*, users.name FROM ranking JOIN users
                        ON user_id = users.id ORDER BY score DESC, user_id LIMIT $limit;");
    $stmt->execute();

    $ranking = [];
    foreach ($stmt as $row) {
        $ranking[] = [
            'number' => $row['number'],
            'id'    => $row['user_id'],
            'name'  => $row['name'],
            'score' => $row['score'],
        ];
    }
    return $ranking;
}

//ユーザーがアップしたアイコンをサーバーに上書き保存する
function uploadIconImage($iconFile)
{
    $tempName = $iconFile['tmp_name'];
    $fileName = $iconFile['name'];
    $extension = pathinfo($fileName, PATHINFO_EXTENSION);

    $extensions = array("jpg", "jpeg", "png", "gif");
    if (!in_array($extension, $extensions)) {
        return "";
    }
    $num = str_pad($_SESSION['user']['id'], 3, '0', STR_PAD_LEFT);
    $newIconPath = __DIR__ . '/../image/icon/icon_' . $num . '.' . $extension;

    if (move_uploaded_file($tempName,  $newIconPath)) {
        foreach ($extensions as $ext) {
            if ($ext === $extension) continue;
            $oldFilePath = __DIR__  . '/../image/icon/icon_' . $num . '.' . $ext;
            if (file_exists($oldFilePath)) unlink($oldFilePath);
        }
        return 'image/icon/icon_' . $num . '.' . $extension;
    } else {
        return "";
    }
}

function deeplTranslate($deeplInput = "翻訳失敗", $lang = "en")
{
    $API_URL = "https://api-free.deepl.com/v2/translate";
    // リクエストパラメータ
    $param = array(
        'auth_key' => DeepL_API_KEY,
        'text' => $deeplInput,
        'target_lang' => $lang,
    );

    $curl = curl_init($API_URL);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($param));
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $json = curl_exec($curl);
    curl_close($curl);

    $res = json_decode($json, true);
    return $res["translations"][0]["text"];
}

function chatGPT($prompt, $option = "")
{
    //openAI APIエンドポイント
    $endpoint = 'https://api.openai.com/v1/chat/completions';

    $headers = array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . chatGPT_API_KEY,
    );

    // リクエストデータ
    $data = array(
        'model' => 'gpt-3.5-turbo',
        'messages' => [
            [
                "role" => "system",
                "content" => "Answer in a few words without using sentence " . $option,
            ],
            [
                "role" => "user",
                "content" => $prompt,
            ],
        ],
        "max_tokens" => 20,
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    $text   = $result['choices'][0]['message']['content'];
    $tokens = $result['usage']['total_tokens'];
    return array("text" => $text, "tokens" => $tokens);
}

function  NinjasApi($directory, $options = "")
{
    $endpoint = "https://api.api-ninjas.com/v1/$directory?$options";

    $headers = array(
        'X-Api-Key : ' . Ninjas_API_KEY,
        'Content-Type: application/json',
    );

    $curl = curl_init($endpoint);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $json = curl_exec($curl);
    curl_close($curl);

    return json_decode($json, true);
}

function readTrivia()
{
    global $pdo;
    $id = intval($_SESSION['user']['id']);
    $date = date("Y-m-d");
    try {
        $stmt1 = $pdo->prepare("SELECT content FROM trivia WHERE user_id = ? AND date = ?");
        $stmt1->execute([$id, $date]);
        $rowCount = $stmt1->rowCount();
        if ($rowCount === 0) return false;
        $fact = $stmt1->fetch(PDO::FETCH_ASSOC)["content"];
        return $fact;
    } catch (PDOException $e) {
        return $e->getMessage();
    }
}

function insertTrivia()
{
    global $pdo;
    try {
        //豆知識は一日一回まで
        $fact = readTrivia();
        if (!$fact) {
            $id = intval($_SESSION['user']['id']);
            $date = date("Y-m-d");

            $stmt2 = $pdo->prepare("DELETE FROM trivia WHERE user_id = ? AND date != ?");
            $stmt2->execute([$id, $date]);

            $fact = NinjasApi("facts")[0]['fact'];
            $fact = deeplTranslate($fact . '.', 'ja');

            $stmt3 = $pdo->prepare("INSERT into trivia (user_id, date, content) values(?, ?, ?)");
            $stmt3->execute([$id, $date, $fact]);
        }
        return $fact;
    } catch (PDOException $e) {
        http_response_code(500);
        return $e->getMessage();
    }
}

//そこでコードを終了する
function endScript()
{
    require __DIR__ . '/footer.php';
    exit();
}
