let data = d3.json("limited_data.json")
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
        treemapLayout.size([1000, 500]).paddingTop(20);
        treemapLayout.tile(d3.treemapBinary);

        treemapLayout(root);

        console.log(root);

        var nodes = d3.select('svg g')
            .selectAll('g')
            .data(root.descendants())
            .join('g')
            .attr('transform', function (d) { return 'translate(' + [d.x0, d.y0] + ')' })

        nodes
            .append('rect')
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('fill', function (d) { 
                if(d['data'][0] === "Bulgaria"){
                    return "green";
                }else if(d['data'][0] === "Turkey"){
                    return "red";
                }else if(d['data'][0] === "Russia"){
                    return "yellow";
                }else if(d['data'][0] === "Ukraine"){
                    return "Orange";
                }else if(d['data'][0] === "Greece"){
                    return "blue";
                }
            })

        nodes
            .append('text')
            .attr('dx', 4)
            .attr('dy', 14)
            .text(function (d) {
                return d["value"]>=140 ? d["data"][0] : "";
            })

    })

function sumTotal(group) {
    return d3.sum(group, function (d) {
        return d["Number"];
    });
}