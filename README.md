# D3js Tutorial with Angular 1.5

This repository contains my current knowledge about D3js. As soon as I learned something new or figured out a new pattern, I will summarize my insights here. My main resource while learning is the official documentation https://d3js.org/ . Here are gathered various tutorials and examples how to use D3js. 


# Fundamentals
The D3js library manipulates document elements based on data. Any javascript function implemented will append, configure or translate element objects depending on its input. When the input data changes, so does the object. Even user interaction, defined as functions on the element objects, are included. The basic concept reminds me a lot of math plotting libraries like Matlab and R , but enhanced to fit web applications requirements.

Since the given data set can be arbitrarly complex, the major issue in working with D3js is to find a scalable, configurable yet light implementation; to just simply plot the input into a chart is easy but limited. Therefore, my goal is to create modular functions and abstract directives as far as possible.

# Getting Started
Like any other library, D3js can be added to your project via the package manager of your choice. 

```console
npm install d3
```

Then, depending on your app set up, you import D3js using a service or simply link the file into the index header. 

```html
<script src="node_modules/d3/build/d3.js"></script>
```
After D3js library is loaded successfully, you are ready to manipulate documents. You can be check the import in your browser console by typing 'd3' to call the d3 object:

![D3js Object in Browser Console](https://cloud.githubusercontent.com/assets/19322615/20215412/67714524-a814-11e6-87bb-43b35540695c.png)

# Create a simple chart

From  here on, you are working on the d3 object. I will explain in the following section how I created this sample chart using Angular 1.5 and the D3js library.

![Sample Chart](https://cloud.githubusercontent.com/assets/19322615/20216735/9004a668-a81c-11e6-924f-a7282c51c718.png)

-------------------
Hello MyChart App
--------------------------
Create a simple app first with a controller, some html and css file. 
```javascript
var app = angular.module("chartApp", []);
app.controller("ChartController", ["$scope", function ($scope) {

}]);
```

```html
<!DOCTYPE html>
<html lang="en" ng-app="chartApp">
<head>
    <title>D3Tutorial</title>
    <script src="node_modules/angular/angular.js"></script>
    <script src="node_modules/d3/build/d3.js"></script>
    <script src="d3tutorial.js"></script>
    <link rel="stylesheet" href="d3tutorial.css">
</head>
<body>
<div ng-controller="ChartController">
    <h1>Hello Chart!</h1>
</div>
</body>
</html>
```

Then, to make the chart reusable, lets create a directive for the chart.
```javascript
app.directive("scatterPlot", function ($window) {
    return {
        restrict: "E",
        controller: "ChartController",
        controllerAs: 'cc',
        bindToController: {},
        link: function (scope, element, attrs, model) {
     
        }
    };
});
```

