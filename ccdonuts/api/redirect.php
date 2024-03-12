<?php
session_start();
require '../common/function.php';
$products = readProductsTabel();
$productsCount = count($products);
setSessionCart($productsCount);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    for ($i = 1; $i <= $productsCount; $i++) {
        if (!isset($_POST["cart" . $i])) continue;

        $count = max(1, intval($_POST["cart" . $i]));
        $_SESSION['cart'][$i . "count"] += $count;
        break;
    }
}
header("Location: cart.php");
