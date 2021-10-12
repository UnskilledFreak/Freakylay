<?php

header("Access-Control-Allow-Origin: *");

$pulsoidUrl = $_GET['pFeed'];

if (substr($pulsoidUrl, 0, 32) == 'https://pulsoid.net/v1/api/feed/') {

    $contextOptions = [
        "ssl" => [
            "verify_peer" => false,
            "verify_peer_name" => false,
        ]
    ];

    $data = file_get_contents($pulsoidUrl, false, stream_context_create($contextOptions));
    echo $data;
    exit();
}
echo '{"bpm":0}';
