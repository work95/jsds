/**
 * Node object.
 */
function Node(key, value) {
  this.key = key;
  this.value = value;
  this.leftChild = null;
  this.rightChild = null;
}

/**
 * Return the key of the node object.
 */
Node.prototype.getKey = function () {
  return this.key;
}

/**
 * Return the value of the node object.
 */
Node.prototype.getValue = function () {
  return this.value;
}

/**
 * Tree object.
 */
function Tree() {
  this.root = null;           // Root of the tree.
  this.numberOfNodes = 0;     // Number of nodes present in the tree.
}

/**
 * Check if the tree is not empty.
 */
Tree.prototype.isEmpty = function () {
  return (this.size() < 1);
}

/**
 * Return the root node of the Tree.
 */
Tree.prototype.getRoot = function () {
  return this.root;
}

/**
 * Return the number of nodes present in the tree. For this call sizeTraverse()
 */
Tree.prototype.size = function () {
  return this.sizeTraverse(this.root);
}

/**
 * Get the size of the tree. Post Order traversel is done.
 */
Tree.prototype.sizeTraverse = function (node) {
  if (node === null) { return 0; }

  let res = 0;
  if (node !== null) {
    res++;
    res += this.sizeTraverse(node.leftChild) + this.sizeTraverse(node.rightChild);
  }
  return res;
}

/**
 * Search for the node with key.
 */
Tree.prototype.search = function (key) {
  // If the tree is empty or initialized, return null.
  if (this.numberOfNodes <= 0 || this.root === null) { 
    return null;
  }

  // Element to traverse.
  let current = this.root;
  while (current != null) {
    // If the key is smaller, traverse the left sub-tree.
    if (key < current.key) { 
      current = current.leftChild; 

    // If the key is larger, traverse the right sub-tree.
    } else if (key > current.key) { 
      current = current.rightChild; 

    // If the key is equal, return the object.
    } else {
      return current;
    }
  }

  // Else return null.
  return null;
}

/**
 * Check if the node is present in the tree.
 */
Tree.prototype.isPresent = function (key) {

  /*
   * If the searchKey() operation returned an object, 
   * that means the object is present in tree.
   */
  if (this.search(key) !== null) {
    return true;
  }

  return false;
}

/**
 * Add a node object to the tree.
 */
Tree.prototype.add = function (key, value) {
  // If the tree is not initialized.
  if (this.root === null) {
    this.root = new Node(key, value);
    this.numberOfNodes++;
    return true;
  }

  let parent = this.root;
  let current = this.root;

  while (current !== null) {
    parent = current;
    if (key < current.key) { 
      current = current.leftChild;
    } else if (key > current.key) { 
      current = current.rightChild;
    } else {
      return false;
    }
  }

  if (key < parent.key) { 
    parent.leftChild = new Node(key, value);
  } else if (key > parent.key) { 
    parent.rightChild = new Node(key, value); 
  }

  // Increase the number of nodes.
  this.numberOfNodes++;

  return true;
}

/**
 * Delete node object from the tree.
 */
Tree.prototype.delete = function (key) {
  this.deleteRecursive(this.root, key);
}

/**
 * Function which performs the actual deletion. 
 */
Tree.prototype.deleteRecursive = function (node, key) {
  // If the tree is empty.
  if (node === null) {
    return false;
  }

  // Recurse the tree.
  if (key < node.key) {
    node.leftChild = this.deleteRecursive(node.leftChild, key);
  } else if (key > node.key) { 
    node.rightChild = this.deleteRecursive(node.rightChild, key);

  // If the key is the same as the root's, delete it, while replacing it with 
  // its inorder successor.
  } else {
    if (node.leftChild === null) {
      return node.rightChild;
    } else if (node.rightChild === null) { 
      return node.leftChild;
    }

    // For node with two children, get the inorder successor (of the right child).
    node.key = this.inorderSuccessor(node.rightChild);

    // Delete the inorder successor.
    node.rightChild = this.deleteRecursive(node.rightChild, node.key);
  }

  return node;
}

/**
 * Preorder tree traversal.
 * Order: Node->Left->Right
 * 
 * @param {Node} node - Where to start the printing from.
 * 
 * @returns -
 */

Tree.prototype.getPreOrder = function (node) {
  let order = [];
  traversePreOrder(node || this.getRoot(), order);
  return order;

  function traversePreOrder (node, traversal) {
    if (!node) { return; }
    traversal.push(node.value);
    traversePreOrder(node.leftChild, traversal);
    traversePreOrder(node.rightChild, traversal);
  }
}

/**
 * Inorder tree traversal.
 * Order: Left->Node->Right
 *  
 * @param {Node} node - Where to start the printing from.
 * 
 * @returns -
 */
Tree.prototype.getInOrder = function (node) {
  let order = [];
  traverseInOrder(node || this.getRoot(), order);
  return order;

  function traverseInOrder (node, traversal) {
    if (!node) { return; }
    traverseInOrder(node.leftChild, traversal);
    traversal.push(node.value);
    traverseInOrder(node.rightChild, traversal);
  }
}

/**
 * Postorder tree traversal.
 * Order: Left->Right->Node
 * 
 * @param {Node} node - Where to start the printing from.
 * 
 * @returns -
 */
Tree.prototype.getPostOrder = function (node) {
  let order = [];
  this.traversePostOrder(node || this.getRoot(), order);
  return order;

  function traversePostOrder(node, traversal) {
    if (!node) { return; }
    traversePostOrder(node.leftChild, traversal);
    traversePostOrder(node.rightChild, traversal);
    traversal.push(node.value);
  }
}

/**
 * Find the inorder successor.
 * 
 * @param {Node} - Node whose inorder successor is to be returned.
 */
Tree.prototype.inorderSuccessor = function (node) {
  let minValue = node.key;

  while (node.leftChild !== null) {
    minValue = node.leftChild.key;
    node = node.leftChild;
  }

  return minValue;
}

module.exports = Tree;
