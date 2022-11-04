# GQVis

A simple package for visualising the results of a Neo4j cypher query in an interactive Python environment (such as Jupyter notebook).

![Screenshot of an example graph](https://github.com/nlp-tlp/d3_graph_vis/blob/main/image_1.png?raw=true)

## Installation

Simply run:

    pip install gqvis

## Usage

First, import the package via

    from gqvis import GQVis

Then, instantiate it via:

    graph = GQVis()

There are two ways to use this class, detailed below.

### Visualising the result of a Neo4j Cypher query

The first way to use the class is to visualise the result of a Neo4j Cypher query. This requires you to have a Neo4j database running. First, connect your GQVis object to neo4j via:

    graph.connect_to_neo4j("password")

The argument is the password of your Neo4j database. Then, you can run the following:

    graph.visualise_cypher('MATCH (n1:Entity)-[r]->(n2:Entity) RETURN n1, r, n2 LIMIT 500')

Note that unlike Neo4j, which has the 'connect result nodes' option to automatically connect nodes that have relationships, you will need to return the relationships explicitly in your query. Only relationships in the `RETURN` statement will be visualised.

### Visualising nodes and links directly

You can also visualise a given list of nodes and edges - No Neo4j required. For example:

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
    graph.visualise(nodes, links)

This will create a graph visualisation with three nodes ("Bob", "Jelly", "Alice"), and two links (Bob eats Jelly, Alice likes Bob). You can have other properties (such as `"age": 45` on Bob) - they'll be shown in the tooltip when hovering over a node.

The `"id"`, `"category"` and `"name"` properties are required on each node. The `"name"` property is what will be written on the nodes in the visualisation, while the `"category"` will determine their colour (more on this below).

For the links, `"source"` is the id of the source node, `"target"` is the id of the target node, and `"type"` is the type of relationship. These are all required.

### About the visualisation

Nodes are coloured based on the `category` property.

For the Cypher visualisation, the way the graph decides on the colour of each node is based on the last label of that node, i.e. if a node had the following labels:

    Entity, Item

... it would be coloured based on the `Item` label. The colours are determined automatically, i.e. each category receives its own unique colour.

## Notes

We use the dependency `neo4j` (the Neo4j driver for Python) rather than `py2neo` because it turns out `py2neo` does not output the exact same results as Neo4j. The way this whole thing works is by creating a list of nodes from all node objects returned by the cypher query, then creating links (by linking nodes via their ids). It didn't seem possible in `py2neo`, but was pretty straightforward with the `neo4j` package.

You can run `src/template/template.html` by itself (i.e. open it directly in Firefox/Chrome) for development purposes. When running it this way, it will be populated by some dummy data specified in `src/template/dummyData.js`.

Note that you must have an internet connection to use this package at the moment as it pulls D3.js from an online CDN.
