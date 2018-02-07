function findNodes(name) {
  caseSensitivity = false;
  if (!caseSensitivity) name = name.toLowerCase();
  var found = [];
  diagram.traverse(function(node) {
    var nodename = node.data.name;
    if (!caseSensitivity) nodename = nodename.toLowerCase();
    if (nodename.search(name) !== -1) {
      found.push(node);
    }
  }); // , diagram.root
  return found;
}

function showSearch() {
  let jqSearch = $(`

<div id="container">
	<div id="form">
		<form action="#" class="entypo-search">
			<fieldset><input id="search" placeholder="Search" /></fieldset>
		</form>
	</div>
</div>
    `);
  $(jqSearch).insertAfter("#switch");
  $("#search").on("input", function(e) {
    let inputText = $(e.delegateTarget).val();
    console.log(inputText);
    if (inputText.length > 0) {
      let arrFoundNodes = findNodes(inputText);
      highlight(arrFoundNodes);
    } else removeHighlights();
  });
}

function highlight(arrNodes) {
  removeHighlights();
  arrNodes.forEach(function(node) {
    node.highlight = 1;
    diagram.update(node, diagram.root);
  });
}

function removeHighlights(exepArrNodes, doUpdate) {
  diagram.traverse(function(node) {
    delete node.highlight;
    diagram.update(node, diagram.root);
  }); // , diagram.root
}

(function($) {
  $(document).ready(function() {
    showSearch();
  });
})(jQuery);
