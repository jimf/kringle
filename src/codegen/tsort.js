const invertGraph = graph =>
  Object.keys(graph).reduce((acc, x) => {
    const ys = graph[x]
    ys.forEach((y) => {
      acc[x] = acc[x] || []
      acc[y] = acc[y] || []
      acc[y].push(x)
    })
    return acc
  }, {})

/**
 * Topological sort. Given a DAG represented by an object of x => y key/value
 * pairs, where the keys (xs) are depended upon by each entry in the ys. In
 * otherwords, Ys depend on Xs.
 *
 * @param {object} graph Graph object to sort
 * @param {boolean} [invert=false] Pass true to invert the X=>Y relationship
 * @return {string[]} Sorted keys
 */
module.exports = function (graph, invert) {
  if (invert) { graph = invertGraph(graph) }
  const result = []
  const visited = {}
  const visitedTmp = {}

  const visit = (node) => {
    if (visitedTmp[node]) {
      throw new Error('Cycle detected in graph')
    }

    if (!visited[node]) {
      visitedTmp[node] = true
      graph[node].forEach(visit)
      visited[node] = true
      delete visitedTmp[node]
      result.unshift(node)
    }
  }

  Object.keys(graph).forEach((node) => {
    if (!visited[node] && !visitedTmp[node]) {
      visit(node)
    }
  })

  return result
}
