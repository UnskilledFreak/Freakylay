<?php

header("Access-Control-Allow-Origin: *");

$pulsoidType = $_GET['pType'];
$pulsoidUrl = $_GET['pFeed'];
$contextOptions = [
    "ssl" => [
        "verify_peer" => false,
        "verify_peer_name" => false,
    ]
];
switch ($pulsoidType) {
    case 'JSON':
        if (substr($pulsoidUrl, 0, 32) == 'https://pulsoid.net/v1/api/feed/') {
            echo file_get_contents($pulsoidUrl, false, stream_context_create($contextOptions));
            exit();
        }
        break;
    case 'Token':
        if (strlen($pulsoidUrl) == 36) {
            $contextOptions['http'] = [
                'method' => 'GET',
                'header' => 'Authorization: Bearer ' . $pulsoidUrl
            ];
            echo file_get_contents('https://dev.pulsoid.net/api/v1/data/heart_rate/latest?response_mode=json', false, stream_context_create($contextOptions));
            exit();
        }
        break;
}
echo '{"bpm":0}';
