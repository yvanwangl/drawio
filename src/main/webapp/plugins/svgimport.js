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
    ui.loadImage(data, mxUtils.bind(this, function (img) {
      var resizeImages = true;

      var doInsert = mxUtils.bind(this, function () {
        ui.resizeImage(img, data, mxUtils.bind(this, function (data2, w2, h2) {
          var s = (resizeImages) ? Math.min(1, Math.min(ui.maxImageSize / w2, ui.maxImageSize / h2)) : 1;

          ui.importFile(data, mime, x, y, Math.round(w2 * s), Math.round(h2 * s), filename, function (cells) {
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
    }), mxUtils.bind(this, function () {
      ui.handleError({ message: mxResources.get('cannotOpenFile') });
    }));
  });

  // Adds resource for action
  // mxResources.parse('exportSvg=Export Svg...');
  window.importSvg = ({ svgData }) => {
    let page = ui.createPage();
    ui.pages.push(page);
    ui.selectPage(page, true);
    const div = document.createElement('div');
    div.innerHTML = svgData;
    // let file = new LocalFile(ui, div.innerHTML, 'canary.svg', true);
    // file.setData(ui.createSvgDataUri(file.getData()));
    // doImportFile(file.getData(), 'image/svg+xml', file.getTitle());
    var svgText = div.innerHTML;
    var root = mxUtils.parseXml(svgText);
    var svgs = root.getElementsByTagName('svg');
    //image/svg+xml
    let maxSize = ui.maxImageSize;

    if (svgs.length > 0) {
      var svgRoot = svgs[0];
      // SVG needs special handling to add viewbox if missing and
      // find initial size from SVG attributes (only for IE11)
      mxUtils.bind(ui, function () {
        try {
          // Parses SVG and find width and height
          if (root != null) {
            var svgs = root.getElementsByTagName('svg');

            if (svgs.length > 0) {
              var svgRoot = svgs[0];
              var w = parseFloat(svgRoot.getAttribute('width'));
              var h = parseFloat(svgRoot.getAttribute('height'));

              // Check if viewBox attribute already exists
              var vb = svgRoot.getAttribute('viewBox');

              if (vb == null || vb.length == 0) {
                svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
              }
              // Uses width and height from viewbox for
              // missing width and height attributes
              else if (isNaN(w) || isNaN(h)) {
                var tokens = vb.split(' ');

                if (tokens.length > 3) {
                  w = parseFloat(tokens[2]);
                  h = parseFloat(tokens[3]);
                }
              }

              data = ui.createSvgDataUri(mxUtils.getXml(svgRoot));
              var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
              var graph = ui.editor.graph;

              // Strips encoding bit (eg. ;base64,) for cell style
              var semi = data.indexOf(';');

              if (semi > 0) {
                data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
              }

              cells = [graph.insertVertex(null, null, '', 0, 0, w, h,
                'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
                'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + data + ';')];

              // Hack to fix width and height asynchronously
              if (isNaN(w) || isNaN(h)) {
                var img = new Image();

                img.onload = mxUtils.bind(ui, function () {
                  w = Math.max(1, img.width);
                  h = Math.max(1, img.height);

                  cells[0].geometry.width = w;
                  cells[0].geometry.height = h;

                  svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
                  data = ui.createSvgDataUri(mxUtils.getXml(svgRoot));

                  var semi = data.indexOf(';');

                  if (semi > 0) {
                    data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
                  }

                  graph.setCellStyles('image', data, [cells[0]]);
                });

                img.src = ui.createSvgDataUri(mxUtils.getXml(svgRoot));
              }

              return cells;
            }
          }
        }
        catch (e) {
          // ignores any SVG parsing errors
        }
      }
    }
  });
