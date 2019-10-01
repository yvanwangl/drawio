/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {

  // Adds resource for action
  // mxResources.parse('exportSvg=Export Svg...');
  const saveButton = document.createElement('button');
  document.addEventListener('click', function () {
		/**
	 * Overrides SVG export to add metadata for each cell.
	 */
    var graph = ui.editor.graph;
    var bg = graph.background;

    if (bg == mxConstants.NONE) {
      bg = null;
    }

    var svgRoot = graph.getSvg(bg, 1, 0, false, null, true, null, null, null);

    if (graph.shadowVisible) {
      graph.addSvgShadow(svgRoot);
    }
    console.log(svgRoot);
    alert(svgRoot.outerHTML);
  })
  document.querySelector('.geMenubar').appendChild(saveButton);
  // Adds action
  // var menu = ui.menus.get('extras');
  // var oldFunct = menu.funct;

  // menu.funct = function (menu, parent) {
  //   oldFunct.apply(this, arguments);

  //   ui.menus.addMenuItems(menu, ['-', 'exportSvg'], parent);
  // };
  // ui.menus.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
	// {
	// 	this.addMenuItems(menu, ['editDiagram']);
	// })));

});
