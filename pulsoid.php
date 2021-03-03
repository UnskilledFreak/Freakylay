<?php

header("Access-Control-Allow-Origin: *");

$pulsoidUrl = $_GET['pFeed'];

if (substr($pulsoidUrl, 0, 32) == 'https://pulsoid.net/v1/api/feed/') {
    $data = file_get_contents($pulsoidUrl);
    echo $data;
    exit();
}
echo '{"bpm":0}';