/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {

  // Adds resource for action
  mxResources.parse('exportSvg=Export Svg...');

  // Adds action
  ui.actions.addAction('exportSvg', function () {
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
  });

  var menu = ui.menus.get('extras');
  var oldFunct = menu.funct;

  menu.funct = function (menu, parent) {
    oldFunct.apply(this, arguments);

    ui.menus.addMenuItems(menu, ['-', 'exportSvg'], parent);
  };

});
