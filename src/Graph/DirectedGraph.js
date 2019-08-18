/* Edge object. */
function Edge(src, dest, weight) {
  this.source = src || null;
  this.destination = dest || null;
  this.weight = weight || null;
}

Edge.prototype.getSource = function () {
  return this.source;
}

Edge.prototype.getDestination = function () {
  return this.destionation;
}

Edge.prototype.getWeight = function () {
  return this.weight;
}

/* Vertext object. */
function Vertex(v) {
  this.value = v;
  this.key = 999999999;
  this.parent = null;
}

/* Graph object. */
function DirectedGraph() {
  this.vertices = new Set();
  this.edges = {};
  this.edgeList = [];
  this.adjacencyList = {};
}

DirectedGraph.prototype.addEdge = function (v1, v2, weight) {
  if (!this.adjacencyList[v1]) {
    this.adjacencyList[v1] = [];
    this.vertices.add(v1);
    this.vertices.add(v2);
  }

  this.adjacencyList[v1].push(v2);
  if (!this.edges[v1]) {
    this.edges[v1] = [];
  }

  let edge = new Edge(v1, v2, weight);
  this.edges[v1].push(edge);
  this.edgeList.push(edge);
};

DirectedGraph.prototype.getVertices = function () {
  return Array.from(this.vertices);
};

DirectedGraph.prototype.getEdges = function () {
  return this.edges;
};

DirectedGraph.prototype.toString = function () {
  console.log(this.adjacencyList);
};

DirectedGraph.prototype.getSortedEdgesByWeight = function () {
  let sortedEdgeList = [];
  sortedEdgeList.push(this.edgeList[0]);

  for (let i = 1; i < this.edgeList.length; i++) {
    let size = sortedEdgeList.length;
    for (let j = 0; j < size; j++) {
      if (this.edgeList[i].weight < sortedEdgeList[j].weight) {
        sortedEdgeList.splice(j, 0, this.edgeList[i]);
        break;
      }
      if (j === size - 1 && sortedEdgeList.length === size) {
        sortedEdgeList.push(this.edgeList[i]);
      }
    }
  }

  return sortedEdgeList;
};

module.exports = DirectedGraph;
