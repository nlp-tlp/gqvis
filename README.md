# D3 Graph Vis

A simple package for visualising a Neo4j graph in a Jupyter notebook via D3.js.

## Installation

It's not an actual python package at the moment but the easiest way of importing it into a Jupyter notebook is to put it in the same folder as the notebook, install the requirements from `requirements.txt`, then call:

    from d3_graph_vis import D3Graph

... one day I might put it on PyPI so that it can be installed via pip.

## Usage

It's very barebones at the moment - the usage is as follows:

    from d3_graph_vis import D3Graph
    d3_graph = D3Graph(password = 'password')
    d3_graph.init_d3()

    d3_graph.visualise('MATCH (n1:Entity)-[r]->(n2:Entity) RETURN n1, r, n2 LIMIT 500')

Note you only need to run the first 3 lines once. The `init_d3()` function is necessary because it returns a HTML snippet with the D3 library inside a script tag.

It should work on any query. The way the visualisation decides on the colour of each node is based on the last label of that node, i.e. if a node had the following labels:

    Entity, Item

... it would be coloured based on the `Item` label.

I am not sure whether it will work for literally any query, but it should.

## TODO

There are some improvements that could be made, such as

-   Hiding all non-related nodes when clicking/dragging (like Echidna)
-   Tooltip on hover that shows the properties of the nodes
-   Make it look a bit nicer, nicer fonts etc
