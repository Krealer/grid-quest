export default class PriorityQueue {
  constructor(compareFn = (a, b) => a.f - b.f) {
    this.heap = [];
    this.compare = compareFn;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(item) {
    this.heap.push(item);
    this.#bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.#bubbleDown(0);
    }
    return top;
  }

  #bubbleUp(index) {
    const item = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.compare(item, parent) >= 0) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = item;
  }

  #bubbleDown(index) {
    const length = this.heap.length;
    const item = this.heap[index];
    while (true) {
      let left = index * 2 + 1;
      let right = left + 1;
      let smallest = index;
      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;
      this.heap[index] = this.heap[smallest];
      index = smallest;
    }
    this.heap[index] = item;
  }
}
