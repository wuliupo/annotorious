<?php

$filename = $_POST["filename"];
$imname = $_POST["imname"];
$annotations = $_POST["annotations"];

echo $imname . '#';

$myfile = fopen($filename, "a") or die("Unable to open file!");
fwrite($myfile, $imname);
foreach ($annotations as $anno) {
	$x = strval(floatval($anno["shapes"][0]["geometry"]["x"]));
	$y = strval(floatval($anno["shapes"][0]["geometry"]["y"]));
	$width = strval(floatval($anno["shapes"][0]["geometry"]["width"]));
	$height = strval(floatval($anno["shapes"][0]["geometry"]["height"]));
	$txt = " " . $x . " " . $y . " " . $width . " " . $height;
	fwrite($myfile, $txt);
}
fwrite($myfile, "\n");
fclose($myfile);

echo sizeof($annotations) . " annotaions saved\n";

// foreach ($annotations as $anno) {
// 	echo "$anno.shapes[0].geometry.x"
// }


?>