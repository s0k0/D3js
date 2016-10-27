var app = angular.module("chartApp", []);

app.controller("ChartController", ["$scope","$interval", function($scope) {

    // Random data point generator
    var randPoint = function() {
        var rand = Math.random;
        return { time: Math.round(rand()*10), visitors: Math.round(rand()*100 )};
    };

    // create data
    $scope.scatter = [];
    var totalPoints = 50;
    for(var i = 0; i < totalPoints; i++){
        $scope.scatter.push(randPoint());
    }

    $scope.pie = [
        {age: '<5' , population: 100},
        {age: '5-13' , population: 160},
        {age: '14-17' , population: 300},
        {age: '18-24' , population:  250},
        {age: '25-35' , population:  200},
        {age: '35-44' , population: 790},
        {age: '45-55' , population: 500},
        {age: '55-64' ,population:  320},
        {age: '65-75' , population: 150},
        {age: '>=75' , population: 50}
    ];


}]);

app.directive("scatterPlot", function($window) {
    return{
        restrict: "E",
        controller: "ChartController",
        controllerAs: 'cc',
        bindToController: {
            data: '=',
            width: '=',
            height: '='
        },
        link: function(scope, element, attrs, model){
            //create variables for settings
            var data = scope.cc.data;
            var width = scope.cc.width;
            var height = scope.cc.height;
            var margin = 60;
            var d3 = $window.d3;

            //create svg root element
            var svg = d3.select(element[0]).append('svg');
            // add groups containing the other svg elements like the data plot and each of the axes
            svg.append('g').attr('class', 'data');
            svg.append('g').attr('class', 'x-axis axis');
            svg.append('g').attr('class', 'y-axis axis');

            //add titles to the axes
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+ (margin/5) +","+(height/2)+")rotate(-90)")
                .text("Y Axis");

            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+ (width/2) +","+(height-(margin/5))+")")
                .text("X Axis");


            var draw = function(svg, width, height, margin, data){
                //set initial attributes of svg object
                svg.attr('width', width);
                svg.attr('height', height);


                //define x-scale
                var x = d3.scaleTime()
                    // declare x values of scale
                    .domain(d3.extent(data, function(d) { return d.time; }))
                    // define space for scale label
                    .range([margin, width-margin]);

                //define x axis
                var xAxis = d3.axisBottom(x)
                    // pass x scale settings
                    .scale(x)
                    // declare label ticks
                    .tickFormat(d3.format('.0s'));

                //define y scale
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return d.visitors; })])
                    .range([ height-margin , margin]);

                //define y axis
                var yAxis = d3.axisLeft(y)
                    .scale(y)
                    .tickFormat(d3.format('.0s'));

                //draw x axis
                svg.select('.x-axis')
                //move axis to actual position in sketch (yeay, where else shall it be than bottom line like in every other fucking diagram ...)
                    .attr("transform", "translate(0, " + (height - margin) + ")")
                    .call(xAxis);


                //draw y axis
                svg.select('.y-axis')
                    // move axis by margin distance to be visible within the width/height parameters
                    .attr("transform", "translate(" + margin + ")")
                    .call(yAxis);

                // Add new the data points
                svg.select('.data')
                    .selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle');

                // Updated all data points
                svg.select('.data')
                    .selectAll('circle')
                    .data(data)
                    .attr('r', 3.5)
                    .attr('cx', function(d) { return x(d.time); })
                    .attr('cy', function(d) { return y(d.visitors); })
                    .style('fill', function(d) {
                        var returnColor;
                        if(d.time === 5){
                            returnColor = 'lightblue';
                        } else if ( d.time === 8) {
                            returnColor = 'green';
                        } else if ( d.time === 3) {
                            returnColor = 'yellow';
                        } else {
                            returnColor = 'red';
                        }
                        return returnColor;
                    });

            };

            draw(svg,width, height, margin ,data);
        }
    };
});


app.directive("pieChart", function($window) {
    return{
        restrict: "E",
        controller: "ChartController",
        controllerAs: 'cc',
        bindToController: {
            data: '=',
            diameter: '='
        },
        link: function(scope, element, attrs, model){
            //create variables for svg settings
            var data = scope.cc.data;
            var diameter = scope.cc.diameter;
            var radius = diameter /2;
            var outerRadius = radius*0.4;
            var innerRadius = radius*0.8;
            var labelRadius = radius*0.7;


            //d3 settings
            var d3 = $window.d3;
            //define ordinal scale (ordered sequence of data points) and assigns one or multiple colors to the ordinals
            var color = d3.scaleOrdinal()
                .range(['#ff8c00']);
            //create arc according to give size parameters, drawing the lines of the arc with specified radius
            var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);

            //put labels on positions according to the arcs with a specific label radius
            var labelArc = d3.arc()
                .outerRadius(labelRadius)
                .innerRadius(labelRadius);

            //create the actual chart and calculate the size of each pie 'piece' according to their data value (the bigger the value, the bigger the piece)
            var pie = d3.pie()
                .padAngle(.02)
                .value(function(d) { return d.population; })
                (data);


            //create svg root element width given height and width
            var svg = d3.select(element[0]).append('svg')
                .attr('width', diameter)
                .attr('height', diameter);

            // create group for chart and append to root as well as translate it form 0,0 to the center of the root
            svg.append('g')
                .attr('class', 'data')
                .attr('transform', 'translate(' + diameter/2 + ',' + diameter/2 + ')');


            function arcTween(outerRadius, delay) {
                return function () {
                    // d3.select(this).transition().delay(delay).attrTween("d", function (d) {
                    //     var i = d3.interpolateNumber(d.outerRadius, outerRadius);
                    //     return function (t) {
                    //         d.outerRadius = i(t);
                    //         return arc(d);
                    //     };
                    // });
                };
            };
            // draw function to create plot
            function draw (svg, data , outerRadius){
                //create sub group of the svg root, each containing an arc aka on pie 'piece'
               var g =  svg.select('.data')
                    .selectAll('.arc')
                    .data(pie)
                    .enter();
                //add calculated arc within piece and adjust attributes like color fill and behaviour
                 g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return color(d.data.age); });
                //TODO: animate pie chart on mouse over
                    // .on("mouseover", arcTween(outerRadius, 0))
                    // .on("mouseout",  arcTween(outerRadius - 20, 150));

                //adjust label to fit position of each arc
                g.append("text")
                    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                    .text(function(d) { return d.data.age; });
            };

            draw(svg ,data);
        }
    };
});