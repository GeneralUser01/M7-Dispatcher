

class SingleLinkedList {
    constructor() {
        this.headNode = null;
    }
    append(item) {
        if (item === null || item === undefined) return;

        const node = { data: item, next: null };
        if (!this.headNode) {
            this.headNode = node;
        } else {
            let tail = this.headNode;
            while (tail.next !== null) {
                tail = tail.next;
            }
            tail.next = node;
        }
    }
    removeHead() {
        if (this.headNode) {
            this.headNode = this.headNode.next;
        }
    }
    cursor() {
        return new SingleLinkedListCursor(this);
    }
    getHead() {
        if (this.headNode) {
            return this.headNode.data;
        } else {
            return null;
        }
    }
    isEmpty() {
        return this.headNode === null;
    }
    count() {
        const cursor = this.cursor();
        let count = 0;
        while (!cursor.isAtEnd()) {
            count += 1;
            cursor.moveToNext();
        }
        return count;
    }
}
class SingleLinkedListCursor {
    constructor(list) {
        this._list = list;
        this._node = list.headNode;
        this._previous = null;
    }

    moveToNext() {
        if (this._node !== null) {
            this._previous = this._node;
            this._node = this._node.next;
        }
    }
    /** Go to last node */
    moveToTail() {
        while (this._node && this._node.next) {
            this.moveToNext();
        }
    }
    /** Go past the last node, can be useful to append a node to the list. */
    moveToEnd() {
        while (this._node) {
            this.moveToNext();
        }
    }
    moveToHead() {
        this._previous = null;
        this._node = this._list.headNode;
    }

    /** Insert a new node before the current node, if the cursor is past the end
     * of the list then the node will be appended.
     *
     * The cursor will be on the inserted node after this operation. */
    insertBefore(item) {
        if (item === null || item === undefined) return false;

        const node = { data: item, next: this._node, };
        if (this._previous) {
            this._previous.next = node;
        } else {
            this._list.headNode = node;
        }
        this._node = node;

        return true;
    }
    /** Remove current node and leave cursor at next node. */
    remove() {
        if (this._node === null) return false;
        const nextNode = this._node.next;

        // Remove link from previous node:
        if (this._previous !== null) {
            this._previous.next = nextNode;
        }
        // Remove link from list:
        if (this._list.headNode === this._node) {
            this._list.headNode = nextNode;
        }

        // Update cursor:
        this._node = nextNode;

        return true;
    }

    current() {
        if (this._node !== null) {
            return this._node.data;
        } else {
            return null;
        }
    }
    /** Returns `true` if we have reached the end of the list. */
    isAtEnd() {
        return this._node === null;
    }
}


class DoubleLinkedList {
    constructor() {
        this.headNode = null;
    }
    append(item) {
        if (item === null || item === undefined) return false;

        const node = { data: item, next: null, prev: null };
        if (!this.headNode) {
            this.headNode = node;
            node.prev = node;
            node.next = node;
        } else {
            let head = this.headNode;
            let tail = this.headNode.prev;

            // Last node so next -> wraps to first node:
            node.next = head;
            // Last node so prev -> the last node before adding it:
            node.prev = tail;

            // After the current last node:
            tail.next = node;
            // Before the first node (since we wrap):
            head.prev = node;
        }

        return true;
    }
    removeHead() {
        this.cursor().remove();
    }

    cursor() {
        return new DoubleLinkedListCursor(this);
    }

    getHead() {
        if (this.headNode) {
            return this.headNode.data;
        } else {
            return null;
        }
    }
    isEmpty() {
        return this.headNode === null;
    }
    count() {
        if (this.isEmpty()) return 0;

        const cursor = this.cursor();
        let count = 0;
        while (true) {
            count += 1;
            cursor.moveToNext();
            if (cursor.isAtHead()) break;
        }
        return count;
    }
}
class DoubleLinkedListCursor {
    constructor(list) {
        this._list = list;
        this._node = list.headNode;
    }

    moveToPrevious() {
        if (this._node !== null) {
            this._node = this._node.prev;
        }
    }
    moveToNext() {
        if (this._node !== null) {
            this._node = this._node.next;
        }
    }

    /** Go to last node */
    moveToTail() {
        if (!this._list.headNode) {
            this._node = null;
            return false;
        }

        this._node = this._list.headNode.prev;
        return true;
    }
    moveToHead() {
        if (!this._list.headNode) {
            this._node = null;
            return false;
        }

        this._node = this._list.headNode;
        return true;
    }

    /** Insert a new node before the current node.
     *
     * The cursor will be on the inserted node after this operation. */
    insertBefore(item) {
        if (item === null || item === undefined) return;
        if (!this._node) this.moveToHead();
        if (this.isDisconnectedNode()) return;
        if (!this._list.headNode) {
            // 0 items in list:
            this._list.append(item);
            this.moveToTail();
            return;
        }

        const node = { data: item, next: null, prev: null };
        if (this._node) {
            const current = this._node;
            const prev = current.prev;

            // (new) -> current
            node.next = current;
            // prev <- (new)
            node.prev = prev;

            // (prev) -> new
            prev.next = node;
            // new <- (current)
            current.prev = node;
        }
        if (this._node === this._list.headNode) {
            // Inserted before head, so update head as well:
            this._list.headNode = node;
        }
        this._node = node;
    }
    /** Insert a new node before the current node.
     *
     * The cursor will be on the inserted node after this operation. */
    insertAfter(item) {
        if (item === null || item === undefined) return;
        if (!this._node) this.moveToHead();
        if (this.isDisconnectedNode()) return;
        if (!this._list.headNode) {
            // 0 items in list:
            this._list.append(item);
            this.moveToTail();
            return;
        }
        if (this._node.next === this._list.headNode) {
            // Cursor is at the tail node so just append to the list:
            this._list.append(item);
            this.moveToTail();
            return;
        }

        // Insert before next node:
        this.moveToNext();
        this.insertBefore(item);
    }
    /** Remove current node and leave cursor at next node. */
    remove() {
        if (this._node === null) return false;
        if (this.isDisconnectedNode()) return false;

        const current = this._node;
        const prev = current.prev;
        const next = current.next;


        // Remove any links from other nodes:

        // Change (prev -> current) to (prev -> next):
        prev.next = next;
        // Change (current <- next) to (prev <- next):
        next.prev = prev;

        // Reset links from removed node (since this node won't be used again
        // this isn't necessary but we might as well):
        current.next = null;
        current.prev = null;


        // The node that cursor and list should point to after the removal (if
        // there is only a single node then point to null):
        const nextNode = next === current ? null : next;

        // Remove possible link from list:
        if (this._list.headNode === current) {
            this._list.headNode = nextNode;
        }

        // Remove cursor's link to the node:
        this._node = nextNode;


        return true;
    }

    /** Create a new cursor at the current node. */
    clone() {
        const cloned = new DoubleLinkedListCursor(this._list);
        cloned._node = this._node;
        return cloned;
    }

    current() {
        if (this._node !== null) {
            return this._node.data;
        } else {
            return null;
        }
    }
    isAtHead() {
        return this._node === this._list.headNode;
    }
    isAtTail() {
        if (this._list.headNode === null) {
            return this._node === null;
        } else {
            return this._node === this._list.headNode.prev;
        }
    }
    /** The node at the cursor's current position is disconnected from the list
     * (it has been deleted). Create a new cursor or use the `moveToTail` or
     * `moveToHead` methods to move the cursor to a connected node. */
    isDisconnectedNode() {
        if (this._node === null) return this._list.headNode !== null;
        // The next or prev fields are only null if the node has been removed:
        return this._node.next === null;
    }
}