function LinkedList() {
	var Node = function(element) {
		this.element = element;
		this.next = null;
	};

	var length = 0;
	var head = null;

	this.append = function(element) {
		var node = new Node(element);
		var current = null;

		if (head === null) {
			head = node;
		} else {
			current = head;
			//loop the list until last item is found
			while (current.next) {
				current = current.next;
			}
			//get last item and assign the link(next) to the element(node)
			current.next = node;
		}
		length++;
	};
	this.insert = function(position, element) {
		if (position >= 0 && position <= length) {
			var node = new Node(element);
			var current = head;
			var previous = null;
			var index = 0;

			if (position === 0) {
				node.next = current;
				head = node;
			} else {
				while (index++ < position) {
					previous = current;
					current = current.next;
				}
				node.next = current;
				previous.next = node;
			}
			length++;
			return true;
		} else {
			return false;
		}
	};
	this.removeAt = function(position) {
		//check for out-of-bounds values
		if (position > -1 && position < length) {
			var current = head;
			var previous = null;
			var index = 0;

			//removing first item
			if (position === 0) {
				head = current.next;
			} else {
				while (index++ < position) {
					previous = current;
					current = current.next;
				}
				previous.next = current.next;
			}
			length--;
			return current.element;
		} else {
			return null;
		}
	};
	this.remove = function(element) {
		var index = this.indexOf(element);
		return this.removeAt(index);
	};
	this.indexOf = function(element) {

		/*var current = head;
		var index = -1;

		while (current) {
			if (element === current.element) {
				return index;
			}
			index++;
			current = current.next;
		}
		}*/
		for (var current = head, i = 0; current; current = current.next, i++) {
			if (element === current.element) {
				return i;
			}
		}
		return -1;
	};
	this.isEmpty = function() {
		return length === 0;
	};
	this.size = function() {
		return length;
	};
	this.toString = function() {
		var current = head;
		var string = '';

		while (current) {
			string += current.element + (current.next ? ', ' : '');
			current = current.next;
		}
		return string;
	};
	this.print = function() {
		console.log(this.toString());
	};
	this.getHead = function() {
		return head;
	};

	this.listToArray = function() {
		var arr = [];
		for (var current = head; current; current = current.next) {
			arr.push(current.element);
		}
		return arr;
	};
}

module.exports = LinkedList;