<?php
// download.php 1.1.1

// This file is part of OpenAero.

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

// FILE IS DEPRECATED BUT KEPT UNTIL 2014 FOR COMPATIBILITY
// WITH OPENAERO VERSIONS PRIOR TO 1.1.1
// FUNCTIONS NOW PROVIDED BY OPENAERO.PHP

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
