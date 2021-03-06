/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {
  let graph = ui.editor.graph;
  var doImportFile = mxUtils.bind(ui, function (data, svgContent, mime, filename) {
    // Gets insert location
    var view = graph.view;
    var bds = graph.getGraphBounds();
    var x = graph.snap(Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize));
    var y = graph.snap(Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize));
    ui.loadImage(data, mxUtils.bind(ui, function (img) {
      var resizeImages = true;

      var doInsert = mxUtils.bind(ui, function () {
        ui.resizeImage(img, data, mxUtils.bind(ui, function (data2, w2, h2) {
          var s = (resizeImages) ? Math.min(1, Math.min(ui.maxImageSize / w2, ui.maxImageSize / h2)) : 1;
          ui.importFile(svgContent, mime, x, y, Math.round(w2 * s), Math.round(h2 * s), filename, function (cells) {
            graph.setSelectionCells(cells);
            graph.scrollCellToVisible(graph.getSelectionCell());
          });
        }), resizeImages);
      });

      if (data.length > ui.resampleThreshold) {
        ui.confirmImageResize(function (doResize) {
          resizeImages = doResize;
          doInsert();
        });
      }
      else {
        doInsert();
      }
    }), mxUtils.bind(ui, function () {
      ui.handleError({ message: mxResources.get('cannotOpenFile') });
    }));
  });

  // Adds resource for action
  // mxResources.parse('exportSvg=Export Svg...');
  window.importSvg = ({ svgData }) => {
    let page = ui.createPage();
    ui.pages.push(page);
    ui.selectPage(page, true);
    var root = mxUtils.parseXml(svgData);
    var svgs = root.getElementsByTagName('svg');
    var svgRoot = svgs[0];
    var svgContent = svgRoot.getAttribute('content');
    svgRoot.removeAttribute('content');
    let file = new LocalFile(ui, svgRoot.outerHTML, 'canary.svg', true);
    file.setData(ui.createSvgDataUri(file.getData()));
    doImportFile(file.getData(), svgContent, 'text/xml', 'canary.svg');
  }
});
