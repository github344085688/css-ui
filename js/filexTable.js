/**
 * Created by f on 2022/5/7.
 */
/**
 * Created by f on 2022/5/7.
 */
function filterFlexSells(fixedSells, dataRows) {
  _.forEach(dataRows, function (rows) {
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

function getFixedNumbers(eltheadCells, fixedName) {
  var fixedSells = [];
  var fixedWidth;
  _.forEach(eltheadCells, function (cells, index) {
    if (cells.getAttribute(fixedName) != null) {
      fixedWidth = fixedWidth + cells.offsetWidth;
      fixedSells.push(index);
    }
  });
  return fixedSells;
}

function getFixedWidth(eltheadCells, fixedName) {
  var fixedWidth = 0;
  _.forEach(eltheadCells, function (cells) {
    if (cells.getAttribute(fixedName) != null) {
      fixedWidth = fixedWidth + cells.offsetWidth;
    }
  });
  return fixedWidth;
}

function reconstructData(table) {
  var elthead = table.querySelectorAll('thead')[0];
  var eltheadCells = elthead.firstChild.cells;
  var fixedSells = getFixedNumbers(eltheadCells, 'fixed');
  var eltbodyRows = table.querySelectorAll('tbody')[0].rows;
  if (fixedSells.length > 0 && eltbodyRows.length > 0) {
    var insertIndex = 0;
    _.forEach(fixedSells, function (index) {
      elthead.firstChild.insertBefore(eltheadCells[index], eltheadCells[insertIndex]);
      insertIndex++;
    });
    _.forEach(fixedSells, function (index) {
      eltheadCells[index].setAttribute('oldFlex', true);
    });
    filterFlexSells(fixedSells, eltbodyRows);
  }
}

function filexTble(el, height, scrollbar) {
  reconstructData(el);
  var createParentBox = document.createElement("div");
  createParentBox.setAttribute('style', 'position: relative;  width:100%;  border: 1px solid #CECECE;');
  el.parentNode.appendChild(createParentBox);

  /**
   * fixed-Head
   * @type {Element}
   */
  var headBox = document.createElement("div");
  headBox.setAttribute('style', "position: absolute; left:0; top:0px; width:100%");
  var fixedHeadPr = document.createElement("div");
  fixedHeadPr.setAttribute('style', "position: relative;  overflow: hidden;  width:100%");
  var fixedHeadBody = document.createElement("div");
  fixedHeadBody.setAttribute('class', "fixed-head-box");
  fixedHeadBody.setAttribute('style', "position: absolute; left:0; top:0px;");
  fixedHeadPr.appendChild(fixedHeadBody);
  headBox.appendChild(fixedHeadPr);
  createParentBox.appendChild(headBox);
  /**
   *  fixed-boder
   */
  var bodyBox = document.createElement("div");
  bodyBox.setAttribute("class", "fixed-body-box " + (scrollbar ? scrollbar : ''));
  bodyBox.setAttribute("style", "max-height:" + height + "px; min-width:100%; overflow: auto;");
  bodyBox.appendChild(el);
  createParentBox.appendChild(bodyBox);

  /**
   *  fixed-rows
   */
  var fixedRowsBox = document.createElement("div");
  fixedRowsBox.setAttribute("style", "position: absolute; height:calc(100% - 18px); width:0px; left:0;top:0;");
  // overflow: hidden;
  var fixedRowsPro = document.createElement("div");
  fixedRowsPro.setAttribute('style', "position: relative;  overflow: hidden");
  var fixedRowsHead = document.createElement("div");
  fixedRowsHead.setAttribute("class", 'fixed-rows-head');
  fixedRowsHead.setAttribute('style', "position: absolute; left:0, top:0;");
  var fixedRowBody = document.createElement("div");
  fixedRowBody.setAttribute('class', "fixed-rows-body");
  fixedRowBody.setAttribute('style', "position: absolute; left:0, top:0; overflow: hidden");
  fixedRowsPro.appendChild(fixedRowBody);
  fixedRowsPro.appendChild(fixedRowsHead);
  fixedRowsBox.appendChild(fixedRowsPro);
  createParentBox.appendChild(fixedRowsBox);
}


function updatefilexTble(el, elParentNode, bodyHeight, binding) {
  var scrollBarWidth = binding.value.scrollBarWidth ? binding.value.scrollBarWidth : 18;
  var eventListenes = [];
  var grandpa = elParentNode.parentNode;
  var fixedHeadBox = grandpa.getElementsByClassName('fixed-head-box')[0];
  var fixedRowsHead = grandpa.getElementsByClassName('fixed-rows-head')[0];
  var fixedRowsBody = grandpa.getElementsByClassName('fixed-rows-body')[0];
  elParentNode.scrollLeft = 0;
  elParentNode.scrollTop = 0;
  if (fixedRowsBody.innerHTML) fixedRowsBody.innerHTML = null;
  if (fixedRowsHead.innerHTML) fixedRowsHead.innerHTML = null;
  if (fixedHeadBox.innerHTML) fixedHeadBox.innerHTML = null;
  var practicalWidth = elParentNode.offsetWidth;
  var practicaHeight = el.offsetHeight;
  var elColgroup = el.querySelectorAll('colgroup')[0];
  var Eltbody = el.querySelectorAll('tbody')[0];
  if (Eltbody) {
    el.style.width = '100%';
  }
  var elthead = el.querySelectorAll('thead')[0];
  var eltheadCells = elthead.firstChild.cells;
  var fixedSells = getFixedNumbers(eltheadCells, 'oldFlex');
  if (Eltbody.rows.length > 0) {
    filterFlexSells(fixedSells, Eltbody.rows);
  }

  var tableWidth = [];
  /**
   * create-colgroup
   * create-table-width
   * @type {Element}
   */

  var last = Eltbody.lastChild;
  if (!elColgroup) {
    var createColgroup = document.createElement("colgroup");
    if (Eltbody && last) {
      _.forEach(last.cells, function (cells) {
        var col = document.createElement("col");
        col.setAttribute("style", "width:" + cells.offsetWidth + "px");
        col.setAttribute("width", cells.offsetWidth);
        createColgroup.appendChild(col);
        tableWidth.push(cells.offsetWidth);
      });
    }
    el.insertBefore(createColgroup, el.firstChild);

  } else {
    _.forEach(elColgroup.childNodes, function (cells) {
      cells.removeAttribute("style");
      cells.removeAttribute("width");
    });
    if (last) {
      _.forEach(last.cells, function (cells, index) {
        elColgroup.childNodes[index].setAttribute("style", "width:" + cells.offsetWidth + "px");
        tableWidth.push(cells.offsetWidth);
      });
    }
  }
  var elWidth = _.sum(tableWidth);
  if (elWidth > practicalWidth) {
    el.style.width = elWidth + 'px';
    fixedHeadBox.style.width = (elWidth + scrollBarWidth) + 'px';
  } else {
    el.style.width = '100%';
    fixedHeadBox.style.width = '100%';
  }
  /**
   * create-fixed-head
   *
   * @type {Element}
   */
  var tableHeight = el.querySelectorAll('th')[0].offsetHeight;
  if (practicaHeight > bodyHeight) {
    if (fixedHeadBox.firstChild) {
      fixedHeadBox.innerHTML = null;
    }
    var cloneElthead = el.cloneNode(true);
    cloneElthead.children[2].innerHTML = null;
    cloneElthead.style.width = (elWidth + scrollBarWidth) + 'px';
    var colTh = document.createElement("th");
    colTh.setAttribute("style", "width: " + scrollBarWidth + "px; padding-right: 0;padding-left: 0;");
    cloneElthead.children[1].firstChild.appendChild(colTh);
    fixedHeadBox.appendChild(cloneElthead);
    fixedHeadBox.parentNode.style.height = tableHeight + 'px';
    if (elWidth > practicalWidth && practicaHeight > bodyHeight) {
      eventListenes.push(el.parentNode.addEventListener('scroll', function (event) {
        fixedHeadBox.style.left = -event.target.scrollLeft + 'px';
        fixedRowsBody.style.top = -event.target.scrollTop + 'px';
        if (event.target.scrollLeft > 10) {
          fixedRowsBody.style.boxShadow = '1px 0px 3px #ADADAD';
        }
        if (event.target.scrollLeft < 10) {
          fixedRowsBody.style.boxShadow = 'none';
        }
      }, true));
    }
    if (elWidth > practicalWidth && practicaHeight < bodyHeight) {
      eventListenes.push(el.parentNode.addEventListener('scroll', function (event) {
        fixedHeadBox.style.left = -event.target.scrollLeft + 'px';
      }, true));
    }
  }

  /**
   * create-fixed-Row
   *
   * @type {Element}
   */

  var fixedRowWidth = getFixedWidth(eltheadCells, 'fixed');
  if (practicaHeight > bodyHeight && elWidth > practicalWidth && fixedRowWidth > 0) {
    /**
     * create-fixed-head
     *
     * @type {Element}
     */
    if (fixedRowsHead.firstChild) {
      fixedRowsHead.innerHTML = null;
    }
    var cloneElthead = el.cloneNode(true);
    cloneElthead.children[2].innerHTML = null;
    cloneElthead.style.width = elWidth + 'px';
    fixedRowsHead.appendChild(cloneElthead);
    fixedRowsHead.style.width = fixedRowWidth + 'px';
    /**
     * create-fixed-body
     *
     * @type {Element}
     */
    var cloneBadyElthead = el.cloneNode(true);
    cloneBadyElthead.style.width = elWidth + 'px';
    fixedRowsBody.parentNode.style.height = (bodyHeight - scrollBarWidth) + 'px';
    fixedRowsBody.parentNode.style.width = (fixedRowWidth + 5) + 'px';
    fixedRowsBody.style.height = practicaHeight + 'px';
    fixedRowsBody.style.width = fixedRowWidth + 'px';
    fixedRowsBody.appendChild(cloneBadyElthead);
  }


}



/*

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

  /!**
   * Flexhead
   * @type {Node|any}
   *!/

  if (isOverstep) {
    var colSoll = document.createElement("col");
    colgroupHead.appendChild(colSoll);
  }
  var cloneEl = el.cloneNode(true);
  var cloneNodeThead = cloneEl.childNodes[1];
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
  if(isOverstep){
    var colTh = document.createElement("th");
    colTh.setAttribute("style", "width: 5px; padding-right: 0;padding-left: 0;");
    cloneNodeThead.firstChild.appendChild(colTh);
  }
  table.appendChild(cloneNodeThead);
  fixedHeadBody.appendChild(table);
  fixedHeadPr.appendChild(fixedHeadBody);
  fixedHeadContent.appendChild(fixedHeadPr);
  parentNodeEl.appendChild(fixedHeadContent);


  /!**
   * fixedBody
   * @type {HTMLElementTagNameMap[string]}
   *!/

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

  /!**
   * fixedhead
   *!/
}

function updatefilexTble(elNode, el, height, binding) {
  var isScrollbar = binding.value.scrollbar;
  var eventListenesHeight = [];
  var elParentNode = el.parentNode;
  var isOverY = elNode.offsetHeight > height ? true : false;
  var tablecolgroups = elParentNode.querySelectorAll('colgroup');
  _.forEach(tablecolgroups, function (colgroup) {
    _.forEach(colgroup.childNodes, function (cells) {
      cells.removeAttribute("style");
      cells.removeAttribute("width");
    });
  });

  var className = elNode.getAttribute('class');
  var unisDataTable = elParentNode.getElementsByClassName(className);

  _.forEach(unisDataTable, function (table) {
    table.removeAttribute("style");
  });
  var tabletbody = elParentNode.querySelectorAll('tbody')[0];
  var tableData = tabletbody.lastChild;

  if (tableData) {
    var fixedThIndexs = [];
    var dataTr = el.querySelectorAll('thead')[0].rows[0];
    _.forEach(dataTr.cells, function (cells, index) {
      if (cells.getAttribute('oldFlex')) {
        fixedThIndexs.push(index);
      }
    });
    if (fixedThIndexs.length > 0) filterFlexSells(fixedThIndexs, el);
    _.forEach(tablecolgroups, function (colgroup ) {
      _.forEach(tableData.cells, function (cells, index) {
        colgroup.childNodes[index].setAttribute("style", "width:" + cells.offsetWidth + "px");
        colgroup.childNodes[index].setAttribute("width", "" + cells.offsetWidth + "");
      });
    });
    var  grouplastChild = tablecolgroups[0].lastChild;
    var  theadlastChild = unisDataTable[0].childNodes[1].rows[0].lastChild;
    console.log(binding.value.scrollbar);
    if (isOverY) {
      grouplastChild.style.width = isScrollbar ? '5px' : '18px';
      theadlastChild.style.width = isScrollbar ? '5px' : '18px';
    } else {
      grouplastChild.style.width = 0;
      theadlastChild.style.width = 0;
    }
    var tableWidth = null;
    _.forEach(tableData.cells, function (cells) {
      tableWidth += cells.offsetWidth;
    });
    _.forEach(unisDataTable, function (table, index) {
      if (index == 0 ){
        if (isOverY) table.setAttribute("style", "width:" + (tableWidth + (isScrollbar ? 5 : 18)) + "px");
        else table.setAttribute("style", "width:" + tableWidth + "px");
      }
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
*/
