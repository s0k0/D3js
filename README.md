# D3js Tutorial with Angular 1.5

This repository contains my current knowledge about D3js. As soon as I learned something new or figured out a new pattern, I will summarize my insights here. 


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

# A simple chart

From  here on, you are working on the d3 object. Create a simple app first with a controller, some html and css file. To make the chart reusable, lets create a directive.


