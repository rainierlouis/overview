var switch_is_present = true;

$( document ).ready(function() {
    // $('#switch').text("switch loaded...")
    function addButton(text) {
      var buttonElement = $('<button id="' + text + '" type="button" class="btn btn-primary btn-sm"></button>')
      var button = $(buttonElement).appendTo('#switch')
      $(button)
      .text(text)
      .addClass('switch_button')
      .click(function(e) {
        var name = $( e.delegateTarget ).text()
        console.log(($('#graph svg').length))
        $('#graph svg').remove()
        if(name == 'tree') mountTree()
        if(name == 'discovery') {
          unmountTree()
          mountDiscovery()
        }
        if(name == 'radial') mountRadial()
      })
    }
    addButton('tree')
    addButton('discovery')
    // addButton('radial')
});
