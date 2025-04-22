const nodes = [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 300, y: 100 },
    { id: 'D', x: 200, y: 200 },
    { id: 'E', x: 400, y: 150 },
];

const edges = [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 2 },
    { from: 'C', to: 'E', weight: 3 },
    { from: 'D', to: 'E', weight: 1 },
];

// Graph data structure
const graph = {};
edges.forEach(({ from, to, weight }) => {
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push({ node: to, weight });
    graph[to].push({ node: from, weight });
});

// Dijkstra's algorithm
function dijkstra(start, end) {
    const distances = {};
    const prev = {};
    const visited = new Set();
    const queue = new Set(nodes.map(n => n.id));

    nodes.forEach(n => distances[n.id] = Infinity);
    distances[start] = 0;

    while (queue.size) {
        const current = [...queue].reduce((minNode, node) =>
            distances[node] < distances[minNode] ? node : minNode
        );
        queue.delete(current);
        visited.add(current);
        updateNodeVisual(current, 'visited');

        if (current === end) break;

        graph[current].forEach(({ node, weight }) => {
            if (visited.has(node)) return;
            const newDist = distances[current] + weight;
            if (newDist < distances[node]) {
                distances[node] = newDist;
                prev[node] = current;
            }
        });
    }

    // Reconstruct shortest path
    const path = [];
    let step = end;
    while (step) {
        path.unshift(step);
        step = prev[step];
    }
    path.forEach((id, i) => setTimeout(() => updateNodeVisual(id, 'path'), 500 * i));
}

// Visualization
const svg = document.getElementById("graph");

function drawGraph() {
    edges.forEach(({ from, to, weight }) => {
        const nodeA = nodes.find(n => n.id === from);
        const nodeB = nodes.find(n => n.id === to);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", nodeA.x);
        line.setAttribute("y1", nodeA.y);
        line.setAttribute("x2", nodeB.x);
        line.setAttribute("y2", nodeB.y);
        svg.appendChild(line);

        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;
        let labelX = midX;
        let labelY = midY;

        if ((from === 'A' && to === 'C') || (from === 'C' && to === 'A')) {
            labelY -= 5;
            labelX += 10; 
        }

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", labelX);
        label.setAttribute("y", labelY);
        label.textContent = weight;
        svg.appendChild(label);
    });

    nodes.forEach(({ id, x, y }) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", `node-${id}`);
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 20);
        svg.appendChild(circle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y + 4);
        text.setAttribute("text-anchor", "middle");
        text.textContent = id;
        svg.appendChild(text);
    });
}

function updateNodeVisual(id, className) {
    document.getElementById(`node-${id}`).classList.add(className);
}

drawGraph();
setTimeout(() => dijkstra('A', 'E'), 3000); // Start Dijkstra after 3s
