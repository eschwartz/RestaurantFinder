<?php
ini_set('auto_detect_line_endings',TRUE);
function renderJsonFromCSV($filename) {
  if(!file_exists($filename)) {
    throw new \RuntimeException("Unable to load $filename: file does not exists");
  }

  $contents = array();
  ini_set('auto_detect_line_endings',TRUE);
  $handle = fopen($filename, "r");

  // Convert csv to 2d array, for easy processing
  $isFirstRow = true;
  $headerRow = array();
  while(($data = fgetcsv($handle)) !== FALSE) {
    if($isFirstRow) {
      $headerRow = $data;
      $isFirstRow = false;
      continue;
    }

    $row = array();
    for($i=0; $i<=count($data); $i++) {
      if(isset($headerRow[$i])) {
        $row[$headerRow[$i]] = $data[$i];
      }
    }
    array_push($contents, $row);
  }
  fclose($handle);

  return json_encode($contents);
}
?>

<!DOCTYPE html>
<html>
<head>
  <title></title>

  <link rel="stylesheet" href="css/style.css" />

  <?php include('includes/js_vendor_scripts.html.php'); ?>

  <?php include('includes/js_restaurantFinder_app_scripts.html.php'); ?>

  <script type="text/javascript">
    $(document).ready(function() {
      var options = {
        locations: <?=renderJsonFromCSV(__DIR__."/data/restaurants.csv"); ?>
      }
      App.start(options);
    });
  </script>


</head>
<body>
  <div class="loading appLoading hide">Loading...</div>

  <div id="map_canvas" style="width:800px; height:600px"></div>

  <div id="searchRegion">
    <input type="text" id="search" />
    <div id="searchResults"></div>
  </div>

  <p>Geocoding Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>

</body>
</html>