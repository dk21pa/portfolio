<?php
session_start();
require '../header.php';
require '../common/function.php';

if (!isset($_SESSION['customer']))
    header('Location : login');
$name = getCustomerName();
?>
<main>
    <div><a href="../index.php">TOP</a>＞<a href='cart.php'>カート</a>
        ＞<a href='purchase.php'>購入確認</a>＞カード情報
    </div>
    <hr>
    <div>ようこそ <?= $name ?>様</div>
    <hr>
    <section id="card">
        <p>カード情報登録</p>
        <div>
            <div class="caution">※当サイトは模擬サイトですので、実際のクレジットカード情報は登録しないでください※</div>
            <form action="cardResistConfirm.php" method="post">
                <div class="input">
                    <p>お名前<span>（必須）</span></p>
                    <input type="text" name="name">
                </div>
                <div class="input">
                    <p>カード番号<span>（必須）</span></p>
                    <input type="number" name="number">
                </div>
                <div class="input" id="brand">
                    <p>カード会社<span>（必須）</span></p>
                    <input type="radio" name="brand" value="JCB" id="jcb">
                    <label for="jcb"> JCB</label>
                    <input type="radio" name="brand" value="Visa" id="visa">
                    <label for="visa"> Visa</label>
                    <input type="radio" name="brand" value="Mastercard" id="mastercard">
                    <label for="mastercard"> Mastercard</label>
                </div>
                <div class="input" id="expiration">
                    <p>有効期限<span>（必須）</span></p>
                    <input type="number" name="month"><span>月</span><br>
                    <input type="number" name="year"><span>年</span>
                </div>
                <div class="input">
                    <p>セキュリティコード<span>（必須）</span></p>
                    <input type="number" name="security">
                </div>
                <button>入力確認する</button>
            </form>
            <div class="caution">※当サイトは模擬サイトですので、実際のクレジットカード情報は登録しないでください※</div>
        </div>
    </section>
</main>
<?php require '../footer.php' ?>