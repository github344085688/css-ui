 /**
 * Created by f on 2022/5/7.
 */
var FlexTables = (function (exports) {
  var clone;

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
    _.forEach(eltheadCells, function (cell,index) {
      cell.setAttribute('index', index);
    });
    if (fixedSells.length > 0 && eltbodyRows.length > 0) {
      var insertIndex = 0;
      _.forEach(fixedSells, function (index) {
        elthead.firstChild.insertBefore(eltheadCells[index], eltheadCells[insertIndex]);
        insertIndex++;
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
    var fixedRowsPro = document.createElement("div");
    fixedRowsPro.setAttribute('style', "position: relative;  overflow: hidden");
    var fixedRowsHead = document.createElement("div");
    fixedRowsHead.setAttribute("class", 'fixed-rows-head');
    fixedRowsHead.setAttribute('style', "position: absolute; left:0, top:0;");
    var fixedRowBody = document.createElement("div");
    fixedRowBody.setAttribute('class', "fixed-rows-body scrollbar-no");
    fixedRowBody.setAttribute('style', "overflow-y: auto;overflow-x: hidden;");
    fixedRowsPro.appendChild(fixedRowBody);
    fixedRowsPro.appendChild(fixedRowsHead);
    fixedRowsBox.appendChild(fixedRowsPro);
    createParentBox.appendChild(fixedRowsBox);
  }


  function updatefilexTble(el, elParentNode, bodyHeight, binding) {
    var elthead = el.querySelectorAll('thead')[0];
    var Eltbody = el.querySelectorAll('tbody')[0];
    var eltheadCells = elthead.firstChild.cells;
    var fixedSells = getFixedNumbers(eltheadCells, 'fixed');
    var eltbodyRows = Eltbody.rows;
    if (this.clone != undefined && this.clone != binding.value.isUpdate) {
      if (fixedSells.length > 0 && eltbodyRows.length > 0) {
        var insertIndex = 0;
        _.forEach(fixedSells, function (index) {
          elthead.firstChild.insertBefore(eltheadCells[index], eltheadCells[insertIndex]);
          insertIndex++;
        });

        _.forEach(eltbodyRows, function (rows) {
          var rowsCells = rows.cells;
          var fixedSellsNumber = 0;
          _.forEach(fixedSells, function (index) {
            rows.setAttribute('arranged', 'true');
            rows.insertBefore(rowsCells[index], rowsCells[fixedSellsNumber]);
            fixedSellsNumber++;
          });
        });
      }
    }
    else {
      var insertIndexs =[];
      _.forEach(eltheadCells, function (cell,index) {
        insertIndexs.push(cell.getAttribute('index'));
      });
      _.forEach(Eltbody.rows, function (rows) {
        var fixedSellsNumber = 0;
        var cloneTd = rows.cloneNode(true);
        if (!rows.getAttribute('arranged')) {
          _.forEach(insertIndexs, function (index) {
            rows.setAttribute('arranged', 'true');
            rows.cells[fixedSellsNumber].innerHTML = cloneTd.cells[index].innerHTML;
            fixedSellsNumber++;
          });
        }
      });
    }




    var scrollBarWidth = binding.value.scrollBarWidth ? binding.value.scrollBarWidth : 18;
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
    if (Eltbody) {
      el.style.width = '100%';
    }

    var eltheadCells = elthead.firstChild.cells;


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

    }

    /**
     * create-fixed-Row
     *
     * @type {Element}
     */
    fixedRowsBody.parentNode.style.height = '0px';
    fixedRowsBody.parentNode.style.width = '0px';
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
      var fixedRowsWidth = fixedRowWidth > practicalWidth ? practicalWidth : (fixedRowWidth + 5) ;
      var cloneElthead = el.cloneNode(true);
      cloneElthead.children[2].innerHTML = null;
      cloneElthead.style.width = elWidth + 'px';
      fixedRowsHead.appendChild(cloneElthead);
      fixedRowsHead.style.width = fixedRowsWidth + 'px';
      fixedRowsHead.style.left = 0;
      fixedRowsHead.style.top = 0;
      /**
       * create-fixed-body
       *
       * @type {Element}
       */
      var cloneBadyElthead = el.cloneNode(true);
      cloneBadyElthead.style.width = elWidth + 'px';
      fixedRowsBody.parentNode.style.height = (bodyHeight - scrollBarWidth) + 'px';
      fixedRowsBody.parentNode.style.width = (fixedRowsWidth + 4) + 'px';
      fixedRowsBody.style.height = (bodyHeight - (scrollBarWidth - 1)) + 'px';
      fixedRowsBody.style.width = fixedRowsWidth + 'px';
      fixedRowsBody.appendChild(cloneBadyElthead);

      /**
       * scroll-event
       *
       * @type {Element}
       */
      var fixedRowsindex = null;
      if (elWidth > practicalWidth && practicaHeight > bodyHeight) {
        el.parentNode.addEventListener('mouseover', function () {
          fixedRowsindex = 1;
        });
        fixedRowsBody.addEventListener('mouseover', function () {
          fixedRowsindex = 2;
        });
        el.parentNode.addEventListener('scroll', function (event) {
          funScrollParentNode(fixedHeadBox, fixedRowsBody, event,fixedRowsindex);
        }, true);
        fixedRowsBody.addEventListener('scroll', function (event) {
          funScrollfixedRowsBody(el.parentNode, event,fixedRowsindex);
        } , true);
      }
      if (elWidth > practicalWidth && practicaHeight < bodyHeight) {
        el.parentNode.addEventListener('scroll', function (event) {
          fixedHeadBox.style.left = -event.target.scrollLeft + 'px';
        }, true)
      }
    }
   this.clone = _.clone(binding.value.isUpdate);
  }

  function funScrollParentNode(fixedHeadBox,fixedRowsBody,event, fixedRowsindex) {
    if(fixedRowsindex == 1){
      fixedHeadBox.style.left = -event.target.scrollLeft + 'px';
      fixedRowsBody.scrollTop =  event.target.scrollTop;
      if (event.target.scrollLeft > 10) {
        fixedRowsBody.style.boxShadow = '1px 0px 3px #ADADAD';
      }
      if (event.target.scrollLeft < 10) {
        fixedRowsBody.style.boxShadow = 'none';
      }
    }
  }

  function funScrollfixedRowsBody(parentNode, event, fixedRowsindex ) {
    if(fixedRowsindex == 2) {
      parentNode.scrollTop = event.target.scrollTop;
    }
  }
  exports.filexTble = filexTble;
  exports.updatefilexTble = updatefilexTble;
  return exports;
})({});

var MyPlugin = {};
MyPlugin.install = function (Vue, options) {
  Vue.test = '插件全局属性';
  Vue.directive('fixedhead', {
    bind: function (el, binding) {
    },
    inserted: function (el, binding, index) {
      var elParentNode = el.parentNode;
      var height = binding.value.height ? binding.value.height : binding.value;
      var scrollbar = binding.value.scrollbar ? binding.value.scrollbar : null;
      FlexTables.filexTble(el, height, scrollbar);
      if (!el.querySelectorAll('thead')[0]) return;
      if (!el.querySelectorAll('tbody')[0]) return;
      FlexTables.updatefilexTble(el, elParentNode, height, binding);
    },
    update: function () {
    },
    componentUpdated: function (el, binding) {
      console.log('componentUpdated');
      var height = binding.value.height ? binding.value.height : binding.value;
      if (!el.querySelectorAll('thead')[0]) return;
      if (!el.querySelectorAll('tbody')[0]) return;
      var elParentNode = el.parentNode;
      FlexTables.updatefilexTble(el, elParentNode, height, binding);
    },
    unbind: function () {
      eventListenes = null;
    },
  });
  Vue.mixin({
    message: '这是插件'
  });
  Vue.prototype.test = '插件prototype'
};