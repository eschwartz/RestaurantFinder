<?php
ini_set('auto_detect_line_endings',TRUE);
function renderJsonFromCSV($filename) {
  if(!file_exists($filename)) {
    throw new RuntimeException("Unable to load $filename: file does not exists");
  }

  $contents = array();
  ini_set('auto_detect_line_endings',TRUE);
  $handle = fopen($filename, "r");

  // Convert csv to 2d array, for easy processing
  $isFirstRow = true;
  $headerRow = array();
  while(($data = fgetcsv($handle, 50)) !== FALSE) {
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
  <title>Restaurant Finder</title>

  <link rel="stylesheet" href="css/reset.css"/>
  <link rel="stylesheet" href="css/style.css" />

  <?php include('includes/js_vendor_scripts.html.php'); ?>

  <?php include('includes/js_restaurantFinder_app_scripts.html.php'); ?>

  <script type="text/javascript">
    $(document).ready(function() {
      var options = {
        locations: <?=renderJsonFromCSV("data/restaurants.csv"); ?>
      }
      App.start(options);
    });
  </script>

  <script id="template-infoWindow" type="template/html">
    <h2><%=restaurant_name %></h2><small>Makers of delicious <%=cuisine_type %> food</small>
  </script>


</head>
<body>
  <div class="loading appLoading hide">
    <span class="loadingText">Geocoding location data...</span>
  </div>

  <div id="map_canvas" style="width:100%; height:100%"></div>

  <div id="searchRegion" class="overlay">
    <h4>Search:</h4>
    <input type="text" id="search" />
    <div id="searchResults"></div>
  </div>

  <p>Geocoding Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>

</body>
</html>