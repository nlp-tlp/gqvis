""" Code for rendering a D3-based graph in Jupyter.
@author Michael Stewart
"""

import pathlib
import os
import random

import neo4j
from neo4j import GraphDatabase
from neo4j.exceptions import AuthError
from IPython.core.display import display, HTML
from string import Template

NEO4J_HOST = "neo4j://localhost:7687"


def visualise_list(nodes: list, links: list):
    """Visualise the given list of nodes and links via a D3 graph.

    Args:
        nodes (list): The list of nodes.
        links (list): The list of links (edges).

    Returns:
        HTML: A HTML snippet with the graph rendered inside of it.

    Raises:
        ValueError: If any arguments are no good.
    """
    if type(nodes) != list:
        raise ValueError(
            "Illegal argument: The first argument must be a list of nodes."
        )
    if len(nodes) == 0:
        raise ValueError(
            "Illegal argument: nodes must contain at least "
            "one node to render."
        )
    if type(links) != list:
        raise ValueError(
            "Illegal argument: The second argument must be a " "list of links."
        )

    template = _load_template()

    return _build_html_template(nodes, links)


def visualise_cypher(query: str):
    """Visualise the given cypher query via a D3 graph.

    Args:
        query (str): The Cypher query to visualise.

    Returns:
        HTML: A HTML snippet with the graph rendered inside of it.

    Raises:
        ValueError: If connect_to_neo4j has not yet been called.
    """

    graph_driver = _connect_to_neo4j()

    # Run the query via neo4j.
    with graph_driver.session() as session:
        nodes, links = session.read_transaction(_run_neoj4_query, query)

    return _build_html_template(nodes, links)


def _connect_to_neo4j():
    """Connect to Neo4j so that cypher queries can be visualised.
    At the moment, only connects to the default port (feel free to change
    if you need to run on docker or something.)

    Args:
        graph_password (str, optional): The password of the neo4j db.
    """
    graph_password: str = "password"
    if "NEO4J_PASSWORD" in os.environ:
        graph_password = os.environ["NEO4J_PASSWORD"]
    try:
        graph_driver = GraphDatabase.driver(
            NEO4J_HOST, auth=("neo4j", graph_password)
        )
        return graph_driver
    except AuthError as e:
        raise ValueError(
            f"Could not connect to Neo4j as the password "
            f"'{graph_password}' is not correct."
        )
    except Exception as e:
        raise ValueError(
            "Unable to connect to Neo4j. Please ensure it is running."
        )


def _build_html_template(nodes: list, links: list):
    """Return a HTML template of the given nodes and links.

    Args:
        nodes (list): The list of nodes.
        links (list): The list of links (edges).

    Returns:
        HTML: An injected HTML template.
    """
    template = _load_template()
    return HTML(
        Template(template).safe_substitute(
            {
                # Generate a random chart id so that D3 knows which svg
                # element corresponds to this graph.
                "chart_id": str(random.randint(0, 1000000)),
                "nodes": nodes,
                "links": links,
            }
        )
    )


def _load_template():
    """Load the template from template.html. This will be populated with the
    given nodes and links later.
    """
    current_path = pathlib.Path(__file__).parent.resolve()
    template = ""
    with open(os.path.join(current_path, "template/template.html"), "r") as f:
        template = f.read()
    return template


def _run_neoj4_query(tx, query):
    """Run the given query via Neo4j. Return a list of nodes, and a list of
    links (edges), that can be visualised via D3Graph's visualise() method.

    Args:
        tx (neo4j): The neo4j driver.
        query (str): The cypher query to run.

    Returns:
        list, list: A list of nodes, and list of links.
    """
    result = tx.run(query)
    result_ls = []

    nodes_dict = {}
    links = []

    for record in result:

        for (k, v) in record.items():
            if type(v) != neo4j.graph.Node:
                links.append(
                    {
                        "source": v.nodes[0].id,
                        "target": v.nodes[1].id,
                        "type": v.type,
                        **dict(v),
                    }
                )
            else:
                # Ignore non str and int for now.
                # Datetimes are a bit weird to parse into JS,
                # so any dates will not be included in the properties
                # in the visualisation.
                nodes_dict[v.id] = {
                    "id": v.id,
                    "category": list(v.labels)[-1]  # 'category' corresponds
                    # to the final label of the entity, and is
                    # responsible for the node colouring.
                    if len(v.labels) > 0 else None,
                    **dict(
                        (
                            k2,
                            v2.replace("'", "")  # Replace single quotes
                            # with double quotes so they can be
                            # rendered in JSON
                            if type(v2) == str else v2,
                        )
                        for (k2, v2) in v.items()
                        if type(v2) in [str, int]
                    ),
                }
    # print(links)
    # print(nodes_dict.values())
    return list(nodes_dict.values()), links
