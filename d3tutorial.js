var app = angular.module("chartApp", []);

app.controller("ChartController", ["$scope","$interval", function($scope) {

    // Random data point generator
    var randPoint = function() {
        var rand = Math.random;
        return { time: Math.round(rand()*10), visitors: Math.round(rand()*100 )};
    };

    // create data
    $scope.data = [];
    var totalPoints = 0;
    for(var i = 0; i < totalPoints; i++){
        $scope.data.push(randPoint());
    }

}]);

app.directive("myChart", function($window) {
    return{
        restrict: "E",
        controller: "ChartController",
        controllerAs: 'cc',
        bindToController: {
            chartData: '=',
            width: '=',
            height: '='
        },
        link: function(scope, element, attrs, model){
            //create variables for settings
            var dataToPlot = scope.cc.chartData;
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

            draw(svg,width, height, margin ,dataToPlot);
        }
    };
});