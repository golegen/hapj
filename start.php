<?php
$opts = getopt('p:dh');
if (isset($opts['h'])) {
    help();
}
if (!isset($opts['p'])) {
    $port = 10050;
} else {
    $port = intval($opts['p']);
}

$demeon = false;
if (isset($opts['d'])) {
    $demeon = true;
}

ob_start();
$ip = system("ifconfig|grep '192.168.'|awk '{print $2}'|awk -F ':' '{print $2}'");
ob_end_clean();



$num = 0;
while(true) {
    $url = "{$ip}:{$port}";

    $cmd = 'php -S '.$url;
    if ($demeon) {
        $cmd .= ' &';
    }
    echo "请访问：http://{$url}/\r";

    system($cmd, $code);

    if ($code === 0) {
        break;
    }
    $num++;
    if ($num > 5) {
        break;
    }
    $port++;
}

function help()
{
    echo <<<HELP
php ./start.php
  -p 端口号，默认为10050
  -h 显示本帮助文档
  -d 后台运行，默认不

HELP;
    exit(0);
}
