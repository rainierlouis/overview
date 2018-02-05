var switch_is_present = true;

$( document ).ready(function() {
    function addButton(text) {
      $('#'+text)
      .click(function(e) {
        var name = e.target.id
        $('#graph svg').remove()
        if(name == 'tree') {
          // unmountRadial()
          // unmountDiscovery()
          mountTree()
        }
        if(name == 'discovery') {
          // unmountTree()
          // unmountRadial()
          mountDiscovery()
        }
        if(name == 'radial') {
          // unmountTree()
          // unmountDiscovery()
          mountRadial()
        }
      })
    }
    addButton('tree')
    addButton('discovery')
    addButton('radial')
});
