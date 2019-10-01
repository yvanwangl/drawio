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
    var graphCreateSvgImageExport = Graph.prototype.createSvgImageExport;

    Graph.prototype.createSvgImageExport = function () {
      var exp = graphCreateSvgImageExport.apply(this, arguments);

      // // Overrides rendering to add metadata
      var expDrawCellState = exp.drawCellState;

      exp.drawCellState = function (state, canvas) {
        var svgDoc = canvas.root.ownerDocument;
        var dlg = new EmbedDialog(ui, svgDoc.innerHTML,
          null, null, null, 'Export Svg:');
        ui.showDialog(dlg.container, 440, 240, true, true);
        dlg.init();


        var g = (svgDoc.createElementNS != null) ?
          svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
        g.setAttribute('id', 'cell-' + state.cell.id);

        // Temporary replaces root for content rendering
        var prev = canvas.root;
        prev.appendChild(g);
        canvas.root = g;

        expDrawCellState.apply(this, arguments);

        // Adds metadata if group is not empty
        if (g.firstChild == null) {
          g.parentNode.removeChild(g);
        }
        else if (mxUtils.isNode(state.cell.value)) {
          g.setAttribute('content', mxUtils.getXml(state.cell.value));

          for (var i = 0; i < state.cell.value.attributes.length; i++) {
            var attrib = state.cell.value.attributes[i];
            g.setAttribute('data-' + attrib.name, attrib.value);
          }
        }

        // Restores previous root
        canvas.root = prev;
      };

      return exp;
    };
  });

  var menu = ui.menus.get('extras');
  var oldFunct = menu.funct;

  menu.funct = function (menu, parent) {
    oldFunct.apply(this, arguments);

    ui.menus.addMenuItems(menu, ['-', 'exportSvg'], parent);
  };

});
