""" Code for rendering a D3-based graph in Jupyter.
@author Michael Stewart
"""

import pathlib
import os
import random

import neo4j
from neo4j import GraphDatabase
from IPython.core.display import display, HTML
from string import Template


class D3Graph(object):

    """A class for rendering a D3-based graph in an interactive python
    environment.

    Attributes:
        d3_ready (bool): Whether d3 is ready. You must call init_d3 prior to
        visualise() otherwise it won't work.
        driver (neo4j.driver): The neo4j driver. Loaded upon instantiating.
    """

    def __init__(self, password="password"):
        self.driver = GraphDatabase.driver(
            "neo4j://localhost:7687", auth=("neo4j", "password")
        )

    def visualise(self, query: str):
        """Visualise the given query via a D3 graph.

        Args:
            query (str): The Cypher query to visualise.

        Returns:
            HTML: A HTML snippet with the graph rendered inside of it.

        """

        # Load the template from template.html. This will be populated with the
        # result of the query.
        current_path = pathlib.Path(__file__).parent.resolve()
        template = ""
        with open(
            os.path.join(current_path, "template/template.html"), "r"
        ) as f:
            template = f.read()

        # Run the query via neo4j.
        with self.driver.session() as session:
            nodes, links = session.read_transaction(_run_query, query)

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


def _run_query(tx, query):
    """Run the query via Neo4j.

    Args:
        tx (neo4j): The neo4j driver.

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
                    "group": list(v.labels)[-1]  # 'group' corresponds
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
