/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {
  let graph = ui.editor.graph;
  var doImportFile = mxUtils.bind(this, function (data, mime, filename) {
    // Gets insert location
    var view = graph.view;
    var bds = graph.getGraphBounds();
    var x = graph.snap(Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize));
    var y = graph.snap(Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize));
    ui.importFile(data, mime, x, y, 100, 100, filename, function (cells) {
      graph.setSelectionCells(cells);
      graph.scrollCellToVisible(graph.getSelectionCell());
    });
  });

  // Adds resource for action
  // mxResources.parse('exportSvg=Export Svg...');
  window.importSvg = ({ svgData }) => {
    let page = ui.createPage();
    ui.pages.push(page);
    ui.selectPage(page, true);
    const div = document.createElement('div');
    div.innerHTML = svgData;
    let file = new LocalFile(ui, div.innerHTML, 'canary.svg', true);
    file.setData(ui.createSvgDataUri(file.getData()));
    doImportFile(file.getData(), 'image/svg+xml', file.getTitle());
  };
});
