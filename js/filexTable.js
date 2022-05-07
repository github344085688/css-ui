/**
 * Created by f on 2022/5/7.
 */
function filterFlexSells(fixedSells, el) {
  var tableDatas = el.querySelectorAll('tbody')[0].rows;
  _.forEach(tableDatas, function (rows) {
    var rowsCells = rows.cells;
    var fixedSellsNumber = 0;
    if (!rows.getAttribute('arranged')) {
      _.forEach(fixedSells, function (index) {
        rows.setAttribute('arranged', 'true');
        rows.insertBefore(rowsCells[index], rowsCells[fixedSellsNumber]);
        fixedSellsNumber++;
      });
    }
  });
}

function filexTble(el, height, scrollbar) {
  var parentNodeEl = el.parentNode;
  var className = el.getAttribute('class');
  var isOverstep = parentNodeEl.offsetWidth < el.offsetWidth ? true : false;
  var ElThead = el.querySelectorAll('thead')[0];
  if (!ElThead) return;
  var elTbody = el.querySelectorAll('tbody')[0];
  if (!elTbody) return;
  var elTheadThs = ElThead.rows[0];
  var elTheadThsCells = elTheadThs.cells;
  var fixedSells = [];
  _.forEach(elTheadThsCells, function (cells, index) {
    if (cells.getAttribute('fixed') != null) {
      fixedSells.push(index);
    }
  });
  if (fixedSells.length > 0) {
    var insertIndex = 0;
    _.forEach(fixedSells, function (index) {
      elTheadThs.insertBefore(elTheadThsCells[index], elTheadThsCells[insertIndex]);
      insertIndex++;
    });
    _.forEach(fixedSells, function (index) {
      elTheadThsCells[index].setAttribute('oldFlex', true);
    });
    filterFlexSells(fixedSells, el);
  }

  var elTbodyRows = ElThead.lastChild;
  parentNodeEl.setAttribute('style', 'position: relative;  width:100%;  border: 1px solid #CECECE;');
  var colgroup = document.createElement("colgroup");
  var colgroupHead = document.createElement("colgroup");
  var tableWidth = [];
  if (elTbodyRows) {
    var elTbodyFirstTr = elTbodyRows.cells;
    _.forEach(elTbodyFirstTr, function (cells) {
      var col = document.createElement("col");
      var colHead = document.createElement("col");
      col.setAttribute("style", "width:" + cells.offsetWidth + "px");
      colHead.setAttribute("style", "width:" + cells.offsetWidth + "px");
      colgroup.appendChild(col);
      colgroupHead.appendChild(colHead);
      tableWidth.push(cells.offsetWidth);
    });
  } else {
    var col = document.createElement("col");
    var colHead = document.createElement("col");
    colgroup.appendChild(col);
    colgroupHead.appendChild(colHead);
  }
  el.insertBefore(colgroup, el.firstChild);

  /**
   * Flexhead
   * @type {Node|any}
   */


  var cloneEl = el.cloneNode(true);
  var fixedHeadContent = document.createElement("div");
  fixedHeadContent.setAttribute('style', "position: absolute; left:0; top:0px; width:100%");
  var fixedHeadPr = document.createElement("div");
  fixedHeadPr.setAttribute('style', "position: relative;  overflow: hidden; height:60px; width:100%");
  var fixedHeadBody = document.createElement("div");
  fixedHeadBody.setAttribute('style', "position: absolute; left:0; top:0px;");
  var table = document.createElement("table");
  table.setAttribute('class', className);
  table.setAttribute('style', "width:" + _.sum(tableWidth) + "px;");
  table.appendChild(colgroupHead);
  table.appendChild(cloneEl.childNodes[1]);
  fixedHeadBody.appendChild(table);
  fixedHeadPr.appendChild(fixedHeadBody);
  fixedHeadContent.appendChild(fixedHeadPr);
  parentNodeEl.appendChild(fixedHeadContent);


  /**
   * fixedBody
   * @type {HTMLElementTagNameMap[string]}
   */

  var fixedBodyTableBox = document.createElement("div");
  fixedBodyTableBox.setAttribute("class", "fixed-body-box " + scrollbar);
  fixedBodyTableBox.setAttribute("style", "max-height:" + height + "px; max-width:100%; overflow: auto;");
  if (isOverstep) el.setAttribute('style', "width:" + _.sum(tableWidth) + "px;");
  else el.setAttribute('style', "width:" + _.sum(tableWidth) + "px;");
  fixedBodyTableBox.appendChild(el);
  parentNodeEl.appendChild(fixedBodyTableBox);
  eventListenes.push(parentNodeEl.addEventListener('scroll', function (event) {
    fixedHeadBody.style.left = -event.target.scrollLeft + 'px';
  }, true));

  /**
   * fixedhead
   */
}

function updatefilexTble(elNode, el) {
  var eventListenesHeight = [];
  var elParentNode = el.parentNode;
  var className = elNode.getAttribute('class');
  var unisDataTable = elParentNode.getElementsByClassName(className);
  _.forEach(unisDataTable, function (table) {
    table.removeAttribute("style");
  });
  var tabletbody = elParentNode.querySelectorAll('tbody')[0];
  var tableData = tabletbody.lastChild;
  var tablecolgroups = elParentNode.querySelectorAll('colgroup');
  if (tableData) {
    var fixedThIndexs = [];
    var dataTr = el.querySelectorAll('thead')[0].rows[0];
    _.forEach(dataTr.cells, function (cells, index) {
      if (cells.getAttribute('oldFlex')) {
        fixedThIndexs.push(index);
      }
    });
    if (fixedThIndexs.length > 0) filterFlexSells(fixedThIndexs, el);

    _.forEach(tablecolgroups, function (colgroup) {
      _.forEach(colgroup.childNodes, function (cells) {
        cells.removeAttribute("style");
      });
    });
    _.forEach(tablecolgroups, function (colgroup) {
      _.forEach(tableData.cells, function (cells, index) {
        colgroup.childNodes[index].setAttribute("style", "width:" + cells.offsetWidth + "px");
        colgroup.childNodes[index].setAttribute("width", "" + cells.offsetWidth + "");
      });
    });
    var tableWidth = null;
    _.forEach(tableData.cells, function (cells) {
      tableWidth += cells.offsetWidth;
    });
    _.forEach(unisDataTable, function (table, index) {
      if (index == 0) table.setAttribute("style", "width:" + (tableWidth + 5) + "px");
      else table.setAttribute("style", "width:" + tableWidth + "px");
    });
    if (fixedThIndexs.length > 0) {
      if (tableWidth > elParentNode.offsetWidth) {
        filterFlexRows(elParentNode, fixedThIndexs, el, false);
      } else  filterFlexRows(elParentNode, fixedThIndexs, el, true);

    }
    if (elParentNode.offsetHeight < tabletbody.offsetHeight) {
      el.scrollTop = 0;
      var fixedFlexRowsDiv = elParentNode.getElementsByClassName('fixed-rows-box')[0];
      var fixedFlexRowsBody = elParentNode.getElementsByClassName('fixed-rows-body')[0];
      if (fixedFlexRowsDiv && fixedFlexRowsBody) {
        eventListenesHeight.push(el.addEventListener('scroll', function (event) {
          handleScroll(event, el, fixedFlexRowsBody)
        }, true));
      }
    }

  }

}

function filterFlexRows(parentNodeEl, fixedSells, el, isRemoveChild) {
  var fixedFlexRowsDiv = parentNodeEl.getElementsByClassName('fixed-rows-box')[0];
  if (fixedFlexRowsDiv && fixedFlexRowsDiv.firstChild) fixedFlexRowsDiv.removeChild(fixedFlexRowsDiv.firstChild);
  if (isRemoveChild && fixedFlexRowsDiv) {
    fixedFlexRowsDiv.style.height = '0px';
    return;
  }
  if (isRemoveChild) {
    return;
  }
  var clonefixedFlexTable = el.querySelectorAll('table')[0].cloneNode(true);
  var tablecolgroups = el.querySelectorAll('colgroup')[0];
  var fixedFlexRowsWidth = 0;
  _.forEach(fixedSells, function (sells, index) {
    fixedFlexRowsWidth = fixedFlexRowsWidth + Number(tablecolgroups.childNodes[index].getAttribute('width'));
  });

  var fixedPro = document.createElement("div");
  fixedPro.setAttribute('style', "position: relative;");
  var fixedHead = document.createElement("div");
  fixedHead.setAttribute('style', "position: absolute; left:0, top:0");
  var cloneHead = clonefixedFlexTable.cloneNode(true);
  cloneHead.removeChild(cloneHead.querySelectorAll('tbody')[0]);
  fixedHead.appendChild(cloneHead);
  var fixedBody = document.createElement("div");
  fixedBody.setAttribute('style', "position: absolute; left:0, top:0");
  fixedBody.setAttribute('class', "fixed-rows-body");
  fixedBody.appendChild(clonefixedFlexTable);
  fixedPro.appendChild(fixedBody);
  fixedPro.appendChild(fixedHead);

  if (!fixedFlexRowsDiv) {
    var fixedFlexRows = document.createElement("div");
    fixedFlexRows.setAttribute("class", 'fixed-rows-box');
    fixedFlexRows.setAttribute("style", "position: absolute; height:calc(100% - 18px); width:" + fixedFlexRowsWidth + "px; left:0; top:0px; overflow: hidden;");
    fixedFlexRows.appendChild(fixedPro);
    parentNodeEl.appendChild(fixedFlexRows);
  } else {
    fixedFlexRowsDiv.appendChild(fixedPro);
    fixedFlexRowsDiv.style.width = fixedFlexRowsWidth + "px";
    fixedFlexRowsDiv.style.height = "calc(100% - 18px)";
  }


}

function handleScroll(event, el, fixedFlexRows) {
  fixedFlexRows.style.top = -event.target.scrollTop + 'px';

}
