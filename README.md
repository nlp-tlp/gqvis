# D3 Graph Vis

A simple package for visualising a Neo4j graph in a Jupyter notebook via D3.js.

## Installation

It's not an actual python package at the moment but the easiest way of importing it into a Jupyter notebook is to clone this repo into the same folder as the notebook, install the requirements from `requirements.txt`, then call:

    from d3_graph_vis import D3Graph

... one day I might put it on PyPI so that it can be installed via pip.

## Usage

It's very barebones at the moment - the usage is as follows:

    from d3_graph_vis import D3Graph
    d3_graph = D3Graph(password = 'password') # (change this to the password of your Neo4j graph)

    d3_graph.visualise('MATCH (n1:Entity)-[r]->(n2:Entity) RETURN n1, r, n2 LIMIT 500')

Note you only need to run the first 2 lines once.

The way the visualisation decides on the colour of each node is based on the last label of that node, i.e. if a node had the following labels:

    Entity, Item

... it would be coloured based on the `Item` label.

I am not sure whether it will work for literally any query, but it should.

## Notes

I am using `neo4j` (the Neo4j driver for Python) rather than `py2neo` because it turns out `py2neo` does not output the exact same results as Neo4j. The way this whole thing works is by creating a list of nodes from all node objects returned by the cypher query, then creating links (by linking nodes via their ids). It didn't seem possible in `py2neo`, but was pretty straightforward with the `neo4j` package.

You can run `src/template/template.html` by itself (i.e. open it directly in Firefox/Chrome) for development purposes. When running it this way, it will be populated by some dummy data specified in `src/template/dummyData.js`. It was a bit tricky to implement this as the template injection doesn't make sense in this context, so the code is a little confusing in places - I've tried to comment it to clarify what is going on.

## TODO

There are some improvements that could be made, such as

-   Hiding all non-related nodes when clicking/dragging (like Echidna)
-   Tooltip on hover that shows the properties/labels of the nodes
-   Make it look a bit nicer
-   Try to figure out why the text gets blurry sometimes
