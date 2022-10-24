import pathlib
import os
import random

# from py2neo import Graph

import neo4j
from neo4j import GraphDatabase
from IPython.core.display import display, HTML
from string import Template


class D3Graph(object):
    def __init__(self, password="password"):
        self.driver = GraphDatabase.driver(
            "neo4j://localhost:7687", auth=("neo4j", "password")
        )
        self.d3_ready = False

    def init_d3(self):
        if self.d3_ready:
            raise ValueError("D3 already initialised.")
        self.d3_ready = True
        return HTML(
            """
            <script src="https://d3js.org/d3.v7.min.js"></script>
            <script>
              require.config({
                  paths: {
                      d3: "https://d3js.org/d3.v7.min"
                   }
              });

              require(["d3"], function(d3) {
                  window.d3 = d3;
              });

            </script>
            """
        )

    def visualise(self, query: str):
        if not self.d3_ready:
            raise ValueError(
                "Please initialise d3 first via d3_graph.init_d3()."
            )

        current_path = pathlib.Path(__file__).parent.resolve()

        template = ""
        with open(os.path.join(current_path, "template.html"), "r") as f:
            template = f.read()

        def run_query(tx):
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
                            "group": list(v.labels)[-1]
                            if len(v.labels) > 0
                            else None,
                            **dict(
                                (
                                    k2,
                                    v2.replace("'", "")
                                    if type(v2) == str
                                    else v2,
                                )
                                for (k2, v2) in v.items()
                                if type(v2) in [str, int]
                            ),
                        }

            print(links)
            print(nodes_dict.values())

            return list(nodes_dict.values()), links

        with self.driver.session() as session:
            nodes, links = session.read_transaction(run_query)

        # query_result = self.graph.run(
        #     "MATCH (n1)-[r]->(n2) RETURN n1, r, n2 LIMIT 5"
        # )
        # for row in query_result:

        #     print("KEYS:", row.keys())
        #     for (k, v) in row.items():

        #         print("ROW")
        #         print(k, v)

        #         print("Node labels:", v.labels)
        #         print("Node dict:", dict(v))

        #         # for (k2, v2) in v.items():
        #         #     print("Property:", k2, "| Value:", v2)

        #         print()
        #     print()
        # query_result = "chicken"

        return HTML(
            Template(template).safe_substitute(
                {
                    "chart_id": str(random.randint(0, 1000000)),
                    "nodes": nodes,
                    "links": links,
                }
            )
        )


def _to_nodes_and_links(query_result):
    nodes = [
        {"id": "Michael", "group": 1},
        {"id": "Test", "group": 2},
        {"id": "Pingu", "group": 3},
    ]
    links = [{"source": "Michael", "target": "Pingu"}]
    return nodes, links


def _init_graph(password: str):
    """Instantiate and return a py2neo graph.
    Assumes Neo4j is hosted on docker under the container name 'neo4j'.
    Returns:
        Graph: The graph.
    """
    graph = Graph(
        password=password,
    )
    try:
        graph.run("MATCH (n) RETURN COUNT(n)")
    except Exception as e:
        print("Error: Could not connect to the Neo4j graph.")
        raise e
    return graph
