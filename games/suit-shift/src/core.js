/* Deterministic game rules shared by rendering, previews, hints and tests. */
(function (root) {
  'use strict';
  const W = 4, H = 5, SIZE = W * H;
  const SUITS = ['H', 'D', 'C', 'S'];
  const DIRS = ['up', 'right', 'down', 'left'];
  const rank = id => Math.ceil(id / 4);
  const suit = id => (id - 1) % 4;
  const card = (s, r) => (r - 1) * 4 + (typeof s === 'string' ? SUITS.indexOf(s) : s) + 1;
  const key = board => board.map(n => String.fromCharCode(n + 65)).join('');
  const count = board => board.reduce((n, id) => n + (id > 0 ? 1 : 0), 0);
  function validate(board) {
    if (!Array.isArray(board) || board.length !== SIZE) throw new Error('Board must contain 20 cells');
    const seen = new Set();
    for (const id of board) {
      if (!Number.isInteger(id) || id < -1 || id > 52) throw new Error('Invalid card');
      if (id > 0 && seen.has(id)) throw new Error('Duplicate card');
      if (id > 0) seen.add(id);
    }
    return true;
  }
  function nextCell(p, d) {
    const x = p % W, y = Math.floor(p / W);
    if (d === 0) return y > 0 ? p - W : -1;
    if (d === 1) return x < W - 1 ? p + 1 : -1;
    if (d === 2) return y < H - 1 ? p + W : -1;
    return x > 0 ? p - 1 : -1;
  }
  function step(board, selected, direction, details = true) {
    const s = typeof selected === 'string' ? SUITS.indexOf(selected) : selected;
    const d = typeof direction === 'string' ? DIRS.indexOf(direction) : direction;
    if (!Number.isInteger(s) || s < 0 || s > 3 || !Number.isInteger(d) || d < 0 || d > 3) throw new Error('Invalid move');
    const b = board.slice(), events = [], active = [];
    for (let p = 0; p < SIZE; p++) if (b[p] > 0 && suit(b[p]) === s) active.push([p, b[p]]);
    if (d === 1 || d === 2) active.reverse();
    let changed = false, pairs = 0;
    const laneOrder = {};
    for (const [from, id] of active) {
      if (b[from] !== id) continue;
      let to = from, target = 0, targetPos = -1;
      while (true) {
        const n = nextCell(to, d);
        if (n < 0 || b[n] === -1) break;
        if (b[n] > 0) {
          if (rank(b[n]) === rank(id)) { target = b[n]; targetPos = n; }
          break;
        }
        to = n;
      }
      const lane = d % 2 === 0 ? from % W : Math.floor(from / W);
      const order = laneOrder[lane] || 0;
      laneOrder[lane] = order + 1;
      if (target) {
        b[from] = 0; b[targetPos] = 0; pairs++; changed = true;
        if (details) events.push({id, from, to: targetPos, target, removed: true, order});
      } else if (to !== from) {
        b[from] = 0; b[to] = id; changed = true;
        if (details) events.push({id, from, to, target: 0, removed: false, order});
      }
    }
    return {board: b, changed, pairs, events, won: count(b) === 0};
  }
  function moves(board) {
    const present = new Set(board.filter(id => id > 0).map(suit));
    const out = [];
    for (const s of present) for (let d = 0; d < 4; d++) {
      const result = step(board, s, d, false);
      if (result.changed) out.push({s, d, ...result});
    }
    return out;
  }
  function replay(board, solution) {
    let b = board.slice();
    for (const [s, d] of solution) {
      const r = step(b, s, d, false);
      if (!r.changed) throw new Error('Solution contains a no-op');
      b = r.board;
    }
    return b;
  }
  class Heap {
    constructor() { this.a = []; }
    push(x) { const a = this.a; let i = a.length; a.push(x); while (i) { let p = (i - 1) >> 1; if (a[p].f <= x.f) break; a[i] = a[p]; i = p; } a[i] = x; }
    pop() { const a = this.a, first = a[0], last = a.pop(); if (a.length) { let i = 0; while (i * 2 + 1 < a.length) { let c = i * 2 + 1; if (c + 1 < a.length && a[c + 1].f < a[c].f) c++; if (last.f <= a[c].f) break; a[i] = a[c]; i = c; } a[i] = last; } return first; }
    get length() { return this.a.length; }
  }
  /* Search is bounded. 'limit' is deliberately distinct from 'unsolvable'.
     weight=0 gives breadth-first/shortest search. weight>0 is a faster, non-optimal search. */
  function solve(board, options = {}) {
    const {maxNodes = 25000, weight = 1.1, maxDepth = 40} = options;
    if (!count(board)) return {status: 'solved', solution: [], nodes: 0, optimal: weight === 0};
    const heap = new Heap(), seen = new Map(), first = {board: board.slice(), g: 0, parent: null, action: null, f: 0};
    heap.push(first); seen.set(key(board), 0);
    let nodes = 0, depthLimited = false;
    while (heap.length && nodes < maxNodes) {
      const n = heap.pop();
      if (seen.get(key(n.board)) < n.g) continue;
      nodes++;
      if (!count(n.board)) {
        const solution = []; let cursor = n;
        while (cursor.parent) { solution.push(cursor.action); cursor = cursor.parent; }
        return {status: 'solved', solution: solution.reverse(), nodes, optimal: weight === 0};
      }
      if (n.g >= maxDepth) { depthLimited = true; continue; }
      for (const r of moves(n.board)) {
        const k = key(r.board), g = n.g + 1;
        if (seen.has(k) && seen.get(k) <= g) continue;
        // For exact breadth-first search, the first generated goal is already shortest.
        // Returning here avoids expanding every other state on the final depth.
        if (weight === 0 && r.won) {
          const solution = [[r.s, r.d]]; let cursor = n;
          while (cursor.parent) { solution.push(cursor.action); cursor = cursor.parent; }
          return {status: 'solved', solution: solution.reverse(), nodes, optimal: true};
        }
        seen.set(k, g);
        heap.push({board: r.board, g, parent: n, action: [r.s, r.d], f: g + count(r.board) * weight});
      }
    }
    return {status: heap.length || depthLimited ? 'limit' : 'unsolvable', solution: null, nodes, optimal: false};
  }
  const api = {W, H, SIZE, SUITS, DIRS, rank, suit, card, key, count, validate, step, moves, replay, solve};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SuitShiftCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
