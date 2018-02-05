function findNodes(name) {
  caseSensitivity = false;
  if (!caseSensitivity) name = name.toLowerCase();
  var found = [];
  traverse(root, function(node) {
    var nodename = node.data.name;
    if (!caseSensitivity) nodename = nodename.toLowerCase();
    if (nodename.search(name) !== -1) {
      found.push(node);
    }
  });
  return found;
}

function showSearch() {
  let jqSearch = $(`
    <div class="graphsearch">
      <input placeholder="hello text"/>
    </div>
    `);
  $(jqSearch).insertAfter("#switch");
  $(".graphsearch input").on("input", function(e) {
    let inputText = $(e.delegateTarget).val();
    if (inputText.length > 0) {
      let arrFoundNodes = findNodes(inputText);
      highlight(arrFoundNodes);
      // console.log(arrFoundNodes);
    } else removeHighlights();
  });
}

function highlight(arrNodes) {
  removeHighlights();
  arrNodes.forEach(function(node) {
    node.highlight = 1;
    update(node);
  });
}

function removeHighlights(exepArrNodes, doUpdate) {
  traverse(root, function(node) {
    delete node.highlight;
    update(node);
  });
}
