<?php

$src = $_POST["src"];
$imname = end(explode("/", $src));

$host_dir = './images/';
$annoted_dir = './annoted_images/';

$img_width = 640;
$img_height = 480;

if ($imname != "NULL") {
	// save new annotations to txt
	$filename = $_POST["filename"];
	$annotations = $_POST["annotations"];
	$myfile = fopen($filename, "a") or die("Unable to open file!");
	fwrite($myfile, $imname);
	foreach ($annotations as $anno) {
		$x1 = strval(floatval($anno["shapes"][0]["geometry"]["x"])*$img_width);
		$y1 = strval(floatval($anno["shapes"][0]["geometry"]["y"])*$img_height);
		$width = strval(floatval($anno["shapes"][0]["geometry"]["width"])*$img_width);
		$height = strval(floatval($anno["shapes"][0]["geometry"]["height"])*$img_height);
		$x2 = $x1 + $width;
		$y2 = $y1 + $height;
		$txt = " " . $x1 . " " . $y1 . " " . $x2 . " " . $y2;
		fwrite($myfile, $txt);
	}
	fwrite($myfile, "\n");
	fclose($myfile);

	// move current image
	rename($host_dir . $imname, $annoted_dir . $imname);
}


// generate new image
$filesnames = scandir($host_dir);
$next_img = "";
foreach ($filesnames as $imname) {
	if (substr($imname, -4)==".jpg") {
		$next_img = $imname;
		break;
	}
}
$res = array();
$res["src"] = $host_dir . $next_img;

echo json_encode($res);


?>