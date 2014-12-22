<?php

function createRule ($line, $comment) {
  // replace \ with \\ in rules
  $line = str_replace ("\\", "\\\\", $line);
  // escape all "
  $line = str_replace ('"', '\"', $line);
  return "rules.push(\"" . trim($line) ."\");".$comment."\n";
}

if (count($argv) < 4) {
  echo "Syntax:\n";
  echo "php rules2js.php <rules> <infile> <outfile>\n";
  echo "rules:   name for rules, e.g. CIVA\n";
  echo "infile:  input filename\n";
  echo "outfile: output filename\n";
  exit;
}

$rules = $argv[1];
$infile = $argv[2];
$outfile = $argv[3];

$lines = file ($infile);
$out = "// OpenAero rulesYY-".$rules." file

// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.

// This file defines year (YY) and rule type specific rules

";

foreach ($lines as $line) {
  // remove newlines
  $line = str_replace ("\r", '', $line);
  $line = str_replace ("\n", '', $line);
  // Transform tabs to spaces and remove whitespace at start and end
  $line = trim(str_replace("\t", " ", $line));
  if ($line != '') {
    // find any comments
    $cp = strpos ($line, '#');
    if ($cp === 0) {
      // comment only
      $out .= "//".substr($line, 1)."\n";
    } else {
      if ($cp > 0) {
        // comment after rule
        $comment = '//' . substr($line, $cp + 1);
        $line = substr($line, 0, $cp);
      } else {
        // no comment
        $comment = '';
      }
        // add rules to [category program]        
        if (preg_match('/^\[([^\]]+)\]/', $line, $matchRules)) {
          // [*...] will be translated to (...)
          if (substr ($matchRules[1], 0, 1) === '*') {
            $out .= createRule ('(' . $rules . ' ' . substr ($matchRules[1], 1) . ')', $comment);
          } else {
            $out .= createRule ('[' . $rules . ' ' . $matchRules[1] . ']', $comment);
          }
        } else if (preg_match('/^([0-8]\.)([0-9][0-9]+)(\.[0-9\-]+( |$).*)/', $line, $matchRules)) {
          // check match "[0-9].xx[x].y[y] ". This is old OLAN family code
          $mid = substr ($matchRules[2], 0, 1) . '.' . substr ($matchRules[2], 1);
          $out .= createRule ($matchRules[1] . $mid . $matchRules[3], $comment);
        } else if (preg_match('/^more[ ]*=[ ]*(.*)/', $line, $matchRules)) {
          // prepend $rules to more=xxx rules
          $out .= createRule ('more=' . $rules . ' ' .$matchRules[1], $comment);
        } else {
          // no changes, just create rule
          $out .= createRule ($line, $comment);
        }
      //}
    }
  } else {
    // add newline
    $out .= "\n";
  }
}

file_put_contents ($outfile, $out);

?>
