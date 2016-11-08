var app = angular.module("chartApp", []);

app.controller("ChartController", ["$scope", function($scope) {

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
            height: '=',
            x: '=',
            y: '=',
            color: '='
        },
        link: function(scope, element, attrs, model){
            //create variables for settings
            var data = scope.cc.data;
            var width = scope.cc.width;
            var height = scope.cc.height;
            var x = scope.cc.x;
            var y = scope.cc.y;
            var color = scope.cc.color;
            var d3 = $window.d3;

            //create svg root element
            function setUpRootElement () {
                var margin = 60;
                var svg = d3.select(element[0]).append('svg');
                svg.append('g').attr('class', 'data');
                svg.append('g').attr('class', 'x-axis axis');
                svg.append('g').attr('class', 'y-axis axis');
                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate("+ (margin/3) +","+(height/2)+")rotate(-90)")
                    .text(y);

                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate("+ (width/2) +","+(height-(margin/5))+")")
                    .text(x);

                return svg;
            }

            function getTimeVector(data, attribute) {
                return d3.extent(data, function(d) { return d[attribute]; });
            }
            function getValueVector(data , attribute) {
                return d3.max(data, function(d) { return d[attribute]; });
            }

            function createScale(scaleType , width , height, dataVector){
                if(scaleType == 'time'){
                    return d3.scaleTime().domain(dataVector).range([height, width]);
                }
                if(scaleType == 'linear'){
                    return d3.scaleLinear().domain([0,dataVector]).range([height, width]);
                }
            }

            function createAxis(scale, position){
                if(position == 'bottom'){
                    return d3.axisBottom(scale).scale(scale).tickFormat(d3.format('.0s'));
                }
                if(position == 'left'){
                    return d3.axisLeft(scale).scale(scale).tickFormat(d3.format('.0s'));
                }
            }

            function drawAxis(svg, elementClass , axis, width , height){
                svg.select(elementClass)
                    .attr("transform", "translate("+ width +", " + height + ")")
                    .call(axis);
            }

            function drawData(svg, elementClass , data, x , y ,  scaleX ,scaleY , color){
                svg.select(elementClass)
                    .selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('r', 3.5)
                    .attr('cx', function(d) { return scaleX(d[x])})
                    .attr('cy', function(d) { return scaleY(d[y])})
                    .style('fill', color );
            }


            function drawDiagram(svg, width, height, data , x, y , color){
                var margin = 60;
                svg.attr('width', width);
                svg.attr('height', height);

                var xScale = createScale('time', width-margin, margin, getTimeVector(data, x));
                var yScale = createScale('linear', margin, height-margin, getValueVector(data, y));

                drawAxis(svg, '.x-axis',  createAxis(xScale, 'bottom'), 0 , height-margin);
                drawAxis(svg, '.y-axis', createAxis(yScale, 'left') , margin , 0);
                drawData(svg, '.data', data, x , y, xScale, yScale , color);
            };

            var svg = setUpRootElement();

            drawDiagram(svg, width, height ,data , x, y , color);
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