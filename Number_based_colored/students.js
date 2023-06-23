let data = d3.json("students.json")
    .then(function (data) {

        let groups = d3.rollup(data,
            sumTotal,
            function (d) { return d["Domicile"]; },
            function (d) { return d["Level of study"]; },
            function (d) { return d["Region of HE provider"]; }
        );

        let root = d3.hierarchy(groups);

        root.sum(function (d) {
            return d[1];
        });

        var treemapLayout = d3.treemap();
        treemapLayout.size([1200, 600]).paddingTop(20);
        treemapLayout.tile(d3.treemapBinary);

        treemapLayout(root);

        console.log(root);

        var nodes = d3.select('svg g')
            .selectAll('g')
            .data(root.descendants())
            .join('g')
            .attr('transform', function (d) { return 'translate(' + [d.x0, d.y0] + ')' })

        var rects =
            nodes
                .append('rect')
                .attr('width', function (d) { return d.x1 - d.x0; })
                .attr('height', function (d) { return d.y1 - d.y0; })

        var maxValue = d3.max(root.leaves(), (d) => { return d["value"] })
        var minValue = d3.min(root.leaves(), (d) => { return d["value"] })

        let color = d3.scaleLinear()
            .range(['yellow', 'red'])
            .domain([minValue, maxValue]);

        let levelOfstudyColor = d3.scaleLinear()
            .range(['lightblue', 'mediumblue'])
            .domain([minValue, maxValue]);

        rects
            .attr("fill", function (d) {
                if (d["height"] > 1)
                    return "grey"
                if (d["height"] == 1)
                    return levelOfstudyColor(d["value"])
                else
                    return color(d["value"])
            })

        let colorbar = d3.select("#colorbar")
            .attr("height", 50)
            .attr("width", 500)
            .style("margin-top", 10)
            .style("background-color", "white")
        let grad = d3.select("#linearGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
        grad.append("stop")
            .attr("id", "linearGradient")
            .attr("offset", "0%")
            .style("stop-color", () => { return color(minValue) })
            .style("stop-opacity", "1")
        grad.append("stop")
            .attr("offset", "100%")
            .style("stop-color", () => { return color(maxValue) })
            .style("stop-opacity", "1")
        colorbar.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 400)
            .attr("height", 20)
            .style("opacity", 1)
            .attr("fill", "url(#linearGradient)")
        colorbar.append("text")
            .attr("x", 0)
            .attr("y", 30)
            .style("fill", "black")
            .text("min")
        colorbar.append("text")
            .attr("x", 380)
            .attr("y", 30)
            .style("fill", "black")
            .text("max")


        nodes.append("title").text(function (d) {
            if (d["height"] === 3) {
                return "Number: " + d["value"]
            }
            else if (d["height"] === 2) {
                return "Domicile: " + d["data"][0] + "\n" +
                    "Number: " + d["value"]
            }
            else if (d["height"] === 1) {
                return "Domicile: " + d["parent"]["data"][0] + "\n" +
                    "Level of study: " + d["data"][0] + "\n" +
                    "Number: " + d["value"]
            }
            else if (d["height"] === 0) {
                return "Domicile: " + d["parent"]["parent"]["data"][0] + "\n" +
                    "Level of study: " + d["parent"]["data"][0] + "\n" +
                    "Region of HE provider: " + d["data"][0] + "\n" +
                    "Number: " + d["value"]
            }
        })


        nodes
            .append('text')
            .attr('dx', 4)
            .attr('dy', 14)
            .text(function (d) {
                return d["value"] >= 2000 ? d["data"][0] : "";
            })




    })

function sumTotal(group) {
    return d3.sum(group, function (d) {
        return d["Number"];
    });
}