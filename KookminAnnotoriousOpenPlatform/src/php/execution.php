<?php

$getData = $_POST["item"];
$getCmd = $_POST["command"];

if (!empty($getData)) {

    executionShellCommand($getData, $getCmd);
}

// Execution Shell command
function executionShellCommand($item, $command){
   $commandArray = array("crop" => "cd /home/www-data/cropy/cropy && python3 cropy.py ".$item,);
   //$commandArray = array("test" => "test");

   // shell_exec return all, but exec only one.
   $dirlist = shell_exec($commandArray[$command]);
   echo "crop & upload";
}
?>
