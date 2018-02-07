var switch_is_present = true;
var diagram;

$(document).ready(function() {
  let jqMenu = $(`
            <div class="menu">
              <div class="btn trigger">
                <span class="line"></span>
              </div>
              <div class="icons">
                <div class="rotater">
                  <div class="btn btn-icon" id="discovery">
                    <img src="share.svg" class="fa clicker" id="discovery"></img>
                  </div>
                </div>
                <div class="rotater">
                  <div class="btn btn-icon">
                    <img src="plant.svg" class="fa clicker" id="tree"></img>
                  </div>
                </div>
                <div class="rotater">
                  <div class="btn btn-icon">
                    <img src="network.svg" class="fa clicker" id="radial"></img>
                  </div>
                </div>
              </div>
            </div>`);
  $("#switch").append(jqMenu);
  $(".trigger").click(function() {
    $(".menu").toggleClass("active");
  });

  function addButton(text) {
    $("#" + text).click(function(e) {
      var name = e.target.id;
      $("#graph svg").remove();
      if (name == "tree") {
        // unmountRadial()
        // unmountDiscovery()
        diagram = mountTree();
      }
      if (name == "discovery") {
        unmountTree();
        // unmountRadial()
        mountDiscovery();
      }
      if (name == "radial") {
        unmountTree();
        // unmountDiscovery()
        mountRadial();
      }
    });
  }
  addButton("tree");
  addButton("discovery");
  addButton("radial");
});
