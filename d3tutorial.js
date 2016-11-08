var app = angular.module("chartApp", []);

app.controller("ChartController", ["$scope", function ($scope) {

    // Random data point generator
    var randPoint = function () {
        var rand = Math.random;
        return {time: Math.round(rand() * 10), visitors: Math.round(rand() * 100)};
    };

    // create data
    $scope.scatter = [];
    var totalPoints = 50;
    for (var i = 0; i < totalPoints; i++) {
        $scope.scatter.push(randPoint());
    }

    $scope.pie = [
        {age: '<5', population: 100},
        {age: '5-13', population: 160},
        {age: '14-17', population: 300},
        {age: '18-24', population: 250},
        {age: '25-35', population: 200},
        {age: '35-44', population: 790},
        {age: '45-55', population: 500},
        {age: '55-64', population: 320},
        {age: '65-75', population: 150},
        {age: '>=75', population: 50}
    ];


}]);

app.directive("scatterPlot", function ($window) {
    return {
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
        link: function (scope, element, attrs, model) {
            //create variables for settings
            var data = scope.cc.data;
            var width = scope.cc.width;
            var height = scope.cc.height;
            var x = scope.cc.x;
            var y = scope.cc.y;
            var color = scope.cc.color;
            var d3 = $window.d3;

            //create svg root element
            function setUpRootElement() {
                var margin = 60;
                var svg = d3.select(element[0]).append('svg');
                svg.append('g').attr('class', 'data');
                svg.append('g').attr('class', 'x-axis axis');
                svg.append('g').attr('class', 'y-axis axis');
                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + (margin / 3) + "," + (height / 2) + ")rotate(-90)")
                    .text(y);

                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + (width / 2) + "," + (height - (margin / 5)) + ")")
                    .text(x);

                return svg;
            }

            function getTimeVector(data, attribute) {
                return d3.extent(data, function (d) {
                    return d[attribute];
                });
            }

            function getValueVector(data, attribute) {
                return d3.max(data, function (d) {
                    return d[attribute];
                });
            }

            function createScale(scaleType, width, height, dataVector) {
                if (scaleType == 'time') {
                    return d3.scaleTime().domain(dataVector).range([height, width]);
                }
                if (scaleType == 'linear') {
                    return d3.scaleLinear().domain([0, dataVector]).range([height, width]);
                }
            }

            function createAxis(scale, position) {
                if (position == 'bottom') {
                    return d3.axisBottom(scale).scale(scale).tickFormat(d3.format('.0s'));
                }
                if (position == 'left') {
                    return d3.axisLeft(scale).scale(scale).tickFormat(d3.format('.0s'));
                }
            }

            function drawAxis(svg, elementClass, axis, width, height) {
                svg.select(elementClass)
                    .attr("transform", "translate(" + width + ", " + height + ")")
                    .call(axis);
            }

            function drawData(svg, elementClass, data, x, y, scaleX, scaleY, color) {
                svg.select(elementClass)
                    .selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('r', 3.5)
                    .attr('cx', function (d) {
                        return scaleX(d[x])
                    })
                    .attr('cy', function (d) {
                        return scaleY(d[y])
                    })
                    .style('fill', color);
            }


            function drawDiagram(svg, width, height, data, x, y, color) {
                var margin = 60;
                svg.attr('width', width);
                svg.attr('height', height);

                var xScale = createScale('time', width - margin, margin, getTimeVector(data, x));
                var yScale = createScale('linear', margin, height - margin, getValueVector(data, y));

                drawAxis(svg, '.x-axis', createAxis(xScale, 'bottom'), 0, height - margin);
                drawAxis(svg, '.y-axis', createAxis(yScale, 'left'), margin, 0);
                drawData(svg, '.data', data, x, y, xScale, yScale, color);
            };

            var svg = setUpRootElement();

            drawDiagram(svg, width, height, data, x, y, color);
        }
    };
});


app.directive("pieChart", function ($window) {
    return {
        restrict: "E",
        controller: "ChartController",
        controllerAs: 'cc',
        bindToController: {
            data: '=',
            diameter: '=',
            group: '=',
            value: '=',
            color: '='
        },
        link: function (scope, element, attrs, model) {
            //create variables for svg settings
            var data = scope.cc.data;
            var diameter = scope.cc.diameter;
            var group = scope.cc.group;
            var value = scope.cc.value;
            var color = scope.cc.color;
            var radius = diameter / 2;
            var outerRadius = radius * 0.4;
            var innerRadius = radius * 0.8;
            var labelRadius = radius * 0.7;
            var d3 = $window.d3;


            //create svg root element width given height and width
            function setUpRootElement(diameter) {
                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', diameter)
                    .attr('height', diameter);
                return svg;
            }

            // create group for chart, append it to root and translate it form 0,0 to the center of the root
            function addChartContainer(svg, diameter) {
                svg.append('g')
                    .attr('class', 'data')
                    .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');
            }

            //define ordinal scale and assign color(s) to the scale
            function setColorScale() {
                return d3.scaleOrdinal().range(color);
            }

            //create arc according to give radius
            function createArc(outer, inner) {
                return d3.arc().outerRadius(outer).innerRadius(inner);
            }

            //calculate size of each pie 'piece' according to their data value (the bigger the value, the bigger the piece)
            function createPie(data, attribute) {
                return d3.pie().padAngle(.02).value(function (d) {
                    return d[attribute];
                })(data);
            }

            //select (or add) arcs of data container with size of calculated pie pieces
            function selectArcs(pie) {
                return svg.select('.data').selectAll('.arc').data(pie).enter();
            }

            //define transition
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
            }

            // draw arcs
            function drawArcs(pie, attribute, values , scale) {
                var selection = selectArcs(pie);
                selection.append('path')
                    .attr('d', values)
                    .style('fill', function (d) {
                        return scale(d.data[attribute]);
                    });
                //TODO: animate pie chart on mouse over
                // .on("mouseover", arcTween(outerRadius, 0))
                // .on("mouseout",  arcTween(outerRadius - 20, 150));
            };


            function drawLabels(pie, attribute, label) {
                var selection = selectArcs(pie);
                selection.append('text')
                    .attr('transform', function (d) {
                        return 'translate(' + label.centroid(d) + ')';
                    })
                    .text(function (d) {
                        return d.data[attribute];
                    });
            }

            //set up root
            var svg = setUpRootElement(diameter);
            addChartContainer(svg, diameter);
            //set parameter
            var scaleColor = setColorScale(color);
            var valuesArc = createArc(outerRadius, innerRadius);
            var labelArc = createArc(labelRadius, labelRadius);
            var pieChunk = createPie(data, value);
            //draw plot
            drawArcs(pieChunk, group, valuesArc, scaleColor);
            drawLabels(pieChunk, group, labelArc);
        }
    };
});