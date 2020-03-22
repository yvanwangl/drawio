/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {

  // Adds resource for action
  // mxResources.parse('exportSvg=Export Svg...');
  const saveButton = document.createElement('button');
  saveButton.innerHTML = '保存';
  saveButton.style.position = 'absolute';
  saveButton.style.right = '16px';
  saveButton.style.background = '#e79052';
  saveButton.style.color = '#fff';
  saveButton.style.border = 'none';
  saveButton.addEventListener('click', function () {
		/**
	 * Overrides SVG export to add metadata for each cell.
	 */
    var graph = ui.editor.graph;
    var bg = graph.background;

    if (bg == mxConstants.NONE) {
      bg = null;
    }

    var svgRoot = graph.getSvg(bg, 1, 0, false, null, true, null, null, null);
    svgRoot.setAttribute('content', ui.getFileData(true, null, null, null, true,
      true, null, null, null, false));

    if (graph.shadowVisible) {
      graph.addSvgShadow(svgRoot);
    }
    const imgData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgRoot.outerHTML)));
    window.postMessage('export-png', imgData);
  })
  document.querySelector('.geMenubar').appendChild(saveButton);
});
