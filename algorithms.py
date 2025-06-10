# algorithms.py

import heapq

def dijkstra(graph, start):
    """Shortest paths from start in weighted graph {u: [(v,w), ...]}."""
    dist = {u: float('inf') for u in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

def prim_mst(graph):
    """
    Minimum spanning tree (Prim's algorithm) on undirected graph
    represented as {u: [(v,w), ...]}.
    Returns list of edges (u, v, w).
    """
    start = next(iter(graph))
    visited = {start}
    edges = []
    pq = [(w, start, v) for v, w in graph[start]]
    heapq.heapify(pq)

    while pq:
        w, u, v = heapq.heappop(pq)
        if v in visited:
            continue
        visited.add(v)
        edges.append((u, v, w))
        for v2, w2 in graph[v]:
            if v2 not in visited:
                heapq.heappush(pq, (w2, v, v2))
    return edges

def knapsack(weights, values, capacity):
    """
    0/1 Knapsack: maximize sum(values) with sum(weights)<=capacity.
    Returns max value.
    """
    n = len(weights)
    dp = [0] * (capacity + 1)
    for i in range(n):
        w, v = weights[i], values[i]
        for cap in range(capacity, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[capacity]

def greedy_match(donations, ngos):
    """
    Match highest-urgency NGOs with available donations.
    donations: list of (id, quantity)
    ngos: list of (id, urgency_score)
    Returns list of (ngo_id, donation_id).
    """
    # sort donations descending by quantity
    donations_sorted = sorted(donations, key=lambda x: x[1], reverse=True)
    # sort NGOs descending by urgency
    ngos_sorted = sorted(ngos, key=lambda x: x[1], reverse=True)
    matches = []
    for ngo_id, _ in ngos_sorted:
        if not donations_sorted:
            break
        donation_id, _ = donations_sorted.pop(0)
        matches.append((ngo_id, donation_id))
    return matches
