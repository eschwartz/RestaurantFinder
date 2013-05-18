# Restaurant Finder

View online at [http://edanschwartz.com/sandbox/g2p-rf/index.php](http://edanschwartz.com/sandbox/g2p-rf/index.php), or view the [Jasmine test spec runner](http://edanschwartz.com/sandbox/g2p-rf/specRunner.php).

## The Challenge
Create a search tool to find local restaurants by name or category. A CSV will serve as the data source.


## The Solution

* Parses a csv file with restaurant names and cuisine styles
* Geocodes restaurant locations into lat/lng coordinates
* Renders restaurants on a google map
* Provides a search area to filter by restaurant name or cuisine type, which is bound to the google maps view

## The Tools

I am using Backbone for this application, as well as the [Backbone.GoogleMaps library](https://github.com/eschwartz/backbone.googlemaps) to integrate the google maps view with the location data.
This is a library I created a year or so ago, and have used on several projects, including [YourLocalYardSale.com](http://yourlocalyardsale.com).