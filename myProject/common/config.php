<?php
$env = parse_ini_file(__DIR__ . '/../.env');
foreach ($env as $key => $value) {
    putenv("$key=$value");
}

define("DeepL_API_KEY", getenv('DeepL_API_KEY') ?? "");
define("chatGPT_API_KEY", getenv('chatGPT_API_KEY') ?? "");
define("Ninjas_API_KEY", getenv('Ninjas_API_KEY') ?? "");
define("DB_HOST", getenv('DB_HOST') ?? "");
define("DB_NAME", getenv('DB_NAME') ?? "");
define("DB_USER", getenv('DB_USER') ?? "");
define("DB_PASS", getenv('DB_PASS') ?? "");

// $langList = [
//     "日本語" => "ja",
//     "英語" => "en",
//     "スペイン語" => "es",
//     "フランス語" => "fr",
//     "ドイツ語" => "de",
//     "ポルトガル語" => "pt",
//     "ロシア語" => "ru",
//     "韓国語" => "ko",
//     "中国語" => "zh",
// ];
