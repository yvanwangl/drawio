/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {

  // Adds resource for action
  // mxResources.parse('exportSvg=Export Svg...');
  window.importSvg = (svgData) => {
    let page = ui.createPage();
    ui.pages.push(page);
    ui.selectPage(page, true);
    ui.importXml(svgData);
  };
});
