<?php include('includes/js_vendor_scripts.html.php'); ?>

<!-- Jasmine Spec Runner -->
<link rel="stylesheet" type="text/css" href="js/vendor/jasmine-1.3.1/jasmine.css">
<script type="text/javascript" src="js/vendor/jasmine-1.3.1/jasmine.js"></script>
<script type="text/javascript" src="js/vendor/jasmine-1.3.1/jasmine-html.js"></script>

<?php include('includes/js_restaurantFinder_app_scripts.html.php'); ?>

<!-- RestraurantFinder Tests -->
<script type="text/javascript" src="js/Tests/FinderApp/App.Locations.spec.js"></script>

<script type="text/javascript">
  /**
   * Bootstrap Jasmine SpecRunnier
   */
  $(document).ready(function() {
    (function() {
      var jasmineEnv = jasmine.getEnv();
      jasmineEnv.updateInterval = 250;

      var htmlReporter = new jasmine.HtmlReporter();
      jasmineEnv.addReporter(htmlReporter);

      jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
      };

      var currentWindowOnload = window.onload;
      window.onload = function() {
        if (currentWindowOnload) {
          currentWindowOnload();
        }

        execJasmine();
      };

      function execJasmine() {
        jasmineEnv.execute();
      }
    })();
  });

</script>