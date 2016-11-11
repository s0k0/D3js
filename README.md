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
If you succesfully loaded D3js, check out the d3 object in your browser console:


# Basic Concept


