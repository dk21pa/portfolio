<?php
require 'config.php';

if (isset($_POST['function'])) {
    $result = null;
    if ($_POST['function'] === 'canUseEmail') {
        $result =  canUseEmail($_POST['email']);
    }
    echo json_encode($result);
    return;
}

function h($str)
{
    return htmlspecialchars($str);
}

function getCustomerRecord($mail, $password)
{
    global $pdo;
    $stmt = $pdo->prepare("select * from customers where mail = ?");
    $stmt->execute([$mail]);
    $customerRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$customerRecord) return null;

    if (password_verify($password, $customerRecord['hash'])) {
        unset($customerRecord['hash']);
        return $customerRecord;
    } else {
        return null;
    }
}

function getCustomerName()
{
    $customerName = 'ゲスト';
    if (isset($_SESSION['customer']))
        $customerName = $_SESSION['customer']['name'];
    return h($customerName);
}

function readProductsTabel($word = '')
{
    global $pdo;
    $productsTable = $pdo->prepare("SELECT * FROM products WHERE NAME LIKE ? OR introduction LIKE ?");
    $productsTable->execute(array_fill(0, 2, "%{$word}%"));

    $products = [];
    foreach ($productsTable as $product) {
        $products[] = [
            'id'     => $product['id'],
            'name'   => $product['name'],
            'price'  => $product['price'],
            'intro'  => $product['introduction'],
            'is_new' => intval($product['is_new'])
        ];
    }
    return $products ? $products : null;
}

function fetchTopSalesIDs()
{
    global $pdo;
    $ranking = $pdo->query(
        "SELECT products.id, sales.count * products.price AS revenue
        FROM products
        JOIN sales  ON products.id = sales.id
        ORDER BY revenue DESC, id;"
    );
    $result = [];
    foreach ($ranking as $product) {
        $result[] = $product['id'];
    }
    return $result;
}

function insertCustomerRecord()
{
    global $pdo;
    $customersTable = $pdo->prepare("insert into customers 
    (name, furigana, postcode_a, postcode_b, address, mail, hash) VALUES
    (?, ?, ?, ?, ?, ?, ?)");

    $tc = $_SESSION['tempCustomer'];
    $hash = password_hash($tc['password'], PASSWORD_DEFAULT);
    $customersTable
        ->execute([$tc['name'], $tc['furigana'], $tc['post1'], $tc['post2'], $tc['address'], $tc['email'], $hash]);
    unset($_SESSION['tempCustomer'], $hash);
}

function setSessionCart($count)
{
    if (isset($_SESSION['cart'])) return;
    for ($i = 1; $i <= $count; $i++) {
        $_SESSION['cart'][$i . "count"] = 0;
    }
}

function insertCardRecord()
{
    global $pdo;
    $cardsTable = $pdo->prepare("insert into cards (id, name, number, brand, year, month, security) VALUES (?, ?, ?, ?, ?, ?, ?)");

    $c = $_SESSION['card'];
    $cardsTable
        ->execute([$_SESSION['customer']['id'], $c['name'], $c['number'], $c['brand'], $c['year'], $c['month'], $c['security']]);
}

function readCardRecord()
{
    global $pdo;
    $cardsTable = $pdo->prepare("select * from cards where id = ?");
    if (!isset($_SESSION['customer']))
        return null;
    $cardsTable->execute([$_SESSION['customer']['id']]);
    return $cardsTable->fetch(PDO::FETCH_ASSOC);
}

function updateSalesTable()
{
    global $pdo;
    $salesTable = $pdo->prepare("UPDATE sales SET count = count + ? WHERE id = ?");
    $cart = $_SESSION['cart'];
    for ($i = 1; $i <= count($cart); $i++) {
        $count = $cart[$i . "count"];
        if ($count === 0) continue;
        $salesTable->execute([$count, $i]);
    }
}

function canUseEmail($newEmail)
{
    global $pdo;
    $stmt = $pdo->prepare('SELECT COUNT(*) AS count FROM customers WHERE mail = ?');
    $stmt->execute([$newEmail]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['count'] === 0;
}
