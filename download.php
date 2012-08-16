<?php
// download.php
// Allows saving of files from OpenAero when running on a server (local or online)

// TO DO: add code to prevent unauthorised use

// Check if all data is present
if(empty($_POST['name']) || empty($_POST['data']) || empty($_POST['format'])) {
  die ("ERROR: Missing data");
}
// Prevent sending very large files. Probably not originating from OpenAero
foreach ($_POST as $postString) {
  if (strlen ($postString > 500000)) die ("ERROR: File too large");
}

// Sanitizing the filename:
$filename = preg_replace('/[^a-z0-9\-\_\.]/i','',$_POST['name']);
 
// Outputting headers:
header("Cache-Control: ");
header("Content-type: ".$_POST['format']);
header('Content-Disposition: attachment; filename="'.$filename.'"');

// Create file output 
echo $_POST['data'];
?>