<?php
// openaero.php 1.2.1

// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is Free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

// This file handles multiple functions that have to be executed in PHP to work
//

switch ($_REQUEST['f']) {
  case 'download':
    download();
    break;
  case 'version':
    version();
    break;
}

// download allows saving of files from OpenAero when running on a server (local or online)
// TO DO: add code to prevent unauthorised use
function download() {
  // Check if all data is present
  if(empty($_POST['name']) || empty($_POST['data']) || empty($_POST['format'])) {
    die ("ERROR: Missing data");
  }
  // Prevent sending very large files. Probably not originating from OpenAero
  foreach ($_POST as $postString) {
    if (strlen ($postString > 500000)) die ("ERROR: File too large");
  }
  
  // Sanitize the filename:
  $filename = preg_replace('/[^a-z0-9\-\_\.]/i','',$_POST['name']);
   
  // Output headers:
  header("Cache-Control: ");
  header("Content-type: ".$_POST['format']);
  header('Content-Disposition: attachment; filename="'.$filename.'"');
  
  // Create file output 
  echo $_POST['data'];
}

// version will check if the provided version number is the latest.
// If not, it will display the latest version in an svg image
function version() {
  $version = '';
  // Get the current latest version from config.js
  $lines = file ('config.js');
  foreach ($lines as $line) {
    if (preg_match ('/^var version[^0-9]+([0-9\.]+)/', $line, $matches)) {
      $version = $matches[1];
      break;
    }
  }
  // Build svg image
  header('Content-Type: image/svg+xml');
  if (($_REQUEST['version'] == $version) || ($version == '')) exit;
  // Version provided is different from latest version
  echo "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
  echo '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.2" width="200" height="16">';
  echo '<text x="195" y="16" text-anchor="end" font-family="Verdana" font-size="13" fill="blue">Download version '.$version.'</text>';
  echo '</svg>';
}
?>
