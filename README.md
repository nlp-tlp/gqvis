# D3 Graph Vis

A simple package for visualising a graph in a Jupyter notebook via D3.js. Supports lists of nodes/edges as well as Cypher queries to a Neo4j database.

## Installation

It's not an actual python package at the moment but the easiest way of importing it into a Jupyter notebook is to clone this repo into the same folder as the notebook, install the requirements from `requirements.txt`, then call:

    from d3_graph_vis import D3Graph

... one day I might put it on PyPI so that it can be installed via pip.

## Usage

First, import the package via

    from d3_graph_vis import D3Graph

There are two ways to use this class.

### Visualising nodes and links directly

The first is to visualise a given list of nodes and edges, for example:

    nodes = [
        {
          "id": 1,
          "category": "Person",
          "name": "Bob",
        },
        {
          "id": 2,
          "category": "Food",
          "name": "Jelly",
        },
        {
          "id": 3,
          "category": "Person",
          "name": "Alice",
        }
    ]
    links = [
        {
          "source": 1,
          "target": 2,
          "type": "EATS",
        },
        {
          "source": 3,
          "target": 1,
          "type": "LIKES",
        },
    ]
    d3_graph.visualise(nodes, links)

This will create a graph visualisation with three nodes ("Bob", "Jelly", "Alice"), and two links (Bob eats chicken, Alice likes Bob). You can have other properties (such as `"age": 45` on Bob) - they'll be shown in the tooltip when hovering over a node.

### Visualising the result of a Neo4j Cypher query

The second way is to use it to visualise the result of a Neo4j Cypher query. This requires you to have a Neo4j database running. First, connect D3Graph to neo4j via:

    d3_graph.connect_to_neo4j("password")

Then, you can run the following:

    d3_graph.visualise_cypher('MATCH (n1:Entity)-[r]->(n2:Entity) RETURN n1, r, n2 LIMIT 500')

I am not sure whether it will work for literally any query, but it should.

### About the visualisation

Nodes are coloured based on the `category` property.

For the Cypher visualisation, the way the graph decides on the colour of each node is based on the last label of that node, i.e. if a node had the following labels:

    Entity, Item

... it would be coloured based on the `Item` label.

## Notes

I am using `neo4j` (the Neo4j driver for Python) rather than `py2neo` because it turns out `py2neo` does not output the exact same results as Neo4j. The way this whole thing works is by creating a list of nodes from all node objects returned by the cypher query, then creating links (by linking nodes via their ids). It didn't seem possible in `py2neo`, but was pretty straightforward with the `neo4j` package.

You can run `src/template/template.html` by itself (i.e. open it directly in Firefox/Chrome) for development purposes. When running it this way, it will be populated by some dummy data specified in `src/template/dummyData.js`. It was a bit tricky to implement this as the template injection doesn't make sense in this context, so the code is a little confusing in places - I've tried to comment it to clarify what is going on.

## TODO

There are some improvements that could be made, such as

-   Hiding all non-related nodes when clicking/dragging (like Echidna)
-   Make it look a bit nicer
-   Try to figure out why the text gets blurry sometimes
