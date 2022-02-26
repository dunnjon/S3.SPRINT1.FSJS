var fs = require("fs");
const sortedSet = require("sorted-set");
var file = "./json/tokens.json";
const SortedSet = require("js-sorted-set");

fs.readFile(file, "utf8", function (err, data) {
  if (err) {
    console.log("Error: " + err);
    return;
  }
  data = JSON.parse(data);
});
fs.readFile("./json/tokens.json", "utf8", (err, data) => {
  if (err) console.error(err);
  const tokensFile = JSON.parse(data);
});
class DoublyLinkedListNode {
  constructor(value, next = null, prev = null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  prependValue(value) {
    if (this.head === null) {
      const node = new DoublyLinkedListNode(value);
      this.head = node;
      this.tail = node;
    } else {
      const currentHead = this.head;
      const newHead = new DoublyLinkedListNode(value);
      currentHead.prev = newHead;
      newHead.next = currentHead;
      this.head = newHead;
    }
  }
  appendValue(value) {
    if (this.head === null) {
      const node = new DoublyLinkedListNode(value);
      this.head = node;
      this.tail = node;
    } else {
      const currentTail = this.tail;
      const newTail = new DoublyLinkedListNode(value);
      currentTail.next = newTail;
      newTail.prev = currentTail;
      this.tail = newTail;
    }
  }
  getNthNode(n) {
    let node = this.head;
    let c = 0;
    while (c < n && node !== null) {
      node = node.next;
      c = c + 1;
    }
    return node;
  }

  /*****************************TOKEN SEARCH FUNCTION***************************************
   * THIS FUNCTION IS CALLED IN THE MAIN TOKEN FUNCTION, IT TAKES THE SEARCH CRITERIA(ITEM) ENTERED
   * BY THE USER IN THE CLI, CREATED A SORTED SET TO RID ANY DUPLICATES OF DATA. SETS THE CURRENT NODE
   * TO THE HEAD OF THE LIST, CHECKS IF LIST IS EMPTY, AND SEARCHES THE LIST FOR USERNAME, EMAIL, AND
   * PHONE NUMBER BY CALLING THE INCLUEDES METHOD AND PASSING THE ITEM FOR COMPARISON
   */

  searchForItem(item) {
    // create new sorted set and initalize as empty array
    var sortedSet = [];
    // set current node to head of list
    let current = this.head;
    // if list is empty, console
    if (this.head == null) {
      console.log("list is empty");
    }
    // if list contains token. search for data matching username, email or phone
    while (current != null) {
      if (
        current.value.username.includes(item) ||
        // current.value.phonenumber.includes(item) ||
        current.value.email.includes(item) ||
        current.value.phone.includes(item)
      ) {
        // push the value into the new sorted set
        sortedSet.push(current.value);
      }
      // set current to point at next node
      current = current.next;
    }
    // return set of matching data
    return sortedSet;
  }
}

/**************************MAIN TOKEN FUNCTION**********************************************
 * THIS FUNCTION TAKES IN THE ARGS PASSED INTO THE CLI, IT INITALIZES A NEW DOUBLELINKED LIST, READS THE TOKEN JSON
 * FILE, PARSES THE DATA, INSERTS TOKENS INTO THE NEW DOUBLELINKED LIST THEN CALLS THE SEARCH FUNCTION TO SEARCH THE
 * LIST FOR CLI ARGS. IF FOUND, IT WILL CONSOLE ALL APPLICABLE TOKENS
 */

// passing args into function
function main(email, phoneNum, username) {
  // creating new doubly linked list
  var linkedList = new DoublyLinkedList();
  // reading the tokens contained in the json file
  fs.readFile("./json/tokens.json", "utf8", (err, data) => {
    // console any errors
    if (err) console.error(err);
    // parse data contained in file
    const tokensFile = JSON.parse(data);
    // for each token contained in the data, add it to the new linked list
    tokensFile.forEach((token) => {
      linkedList.appendValue(token);
    });
    // set current node to the head(beginning) of list
    let current = linkedList.head;
    // iterate through doubly linked list searching for the args passed
    var set = linkedList.searchForItem(email, phoneNum, username);
    // if found console the tokens
    set.forEach((item) => {
      console.log(item);
    });
  });
}
module.exports = { main };
