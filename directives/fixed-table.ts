import { forEach, sum } from 'lodash-es';
const fixedTable = {
    install: (vue: any) => {
        vue.directive("fixedHead", funLoding);
    }
};
let eventListenes: any = [];

function filexTble(el: any, binding: any) {
    const parentNodeEl = el.parentNode;
    const ElThead = el.querySelectorAll('thead')[0];
    if (!ElThead) return;
    const elTbody = el.querySelectorAll('tbody')[0];
    if (!elTbody) return;
    const elTheadThs = ElThead.rows[0];
    const elTheadThsCells = elTheadThs.cells;
    let fixedSells: Array<any> = [];
    forEach(elTheadThsCells, (cells, index) => {
        if (cells.getAttribute('fixed') != null) {
            fixedSells.push(index);
        }
    });
    if (fixedSells.length > 0) {
        let insertIndex = 0;
        forEach(fixedSells, index => {
            elTheadThs.insertBefore(elTheadThsCells[index], elTheadThsCells[insertIndex]);
            insertIndex++;
        });
        forEach(fixedSells, index => {
            elTheadThsCells[index].setAttribute('oldFlex', true);
        });
        filterFlexSells(fixedSells, el);
    }

    const elTbodyRows = ElThead.lastChild;
    parentNodeEl.setAttribute('style', `position: relative;  width:100%;  border-left: 1px solid #CECECE; border-right: 1px solid #CECECE;`);
    let colgroup = document.createElement("colgroup");
    let colgroupHead = document.createElement("colgroup");
    let tableWidth: any = [];
    if (elTbodyRows) {
        const elTbodyFirstTr = elTbodyRows.cells;
        forEach(elTbodyFirstTr, cells => {
            let col = document.createElement("col");
            let colHead = document.createElement("col");
            col.setAttribute("style", `width:${cells.offsetWidth}px`);
            colHead.setAttribute("style", `width:${cells.offsetWidth}px`);
            colgroup.appendChild(col);
            colgroupHead.appendChild(colHead);
            tableWidth.push(cells.offsetWidth);
        });
    } else {
        let col = document.createElement("col");
        let colHead = document.createElement("col");
        colgroup.appendChild(col);
        colgroupHead.appendChild(colHead);
    }
    el.insertBefore(colgroup, el.firstChild);

    /**
     * Flexhead
     * @type {Node|any}
     */


    const cloneEl = el.cloneNode(true);
    let fixedHeadContent = document.createElement("div");
    fixedHeadContent.setAttribute('style', `position: absolute; left:0; top:0px; width:100%`);
    let fixedHeadPr = document.createElement("div");
    fixedHeadPr.setAttribute('style', `position: relative;  overflow: hidden; height:60px; width:100%`);
    let fixedHeadBody = document.createElement("div");
    fixedHeadBody.setAttribute('style', `position: absolute; left:0; top:0px;`);
    const table = document.createElement("table");
    table.setAttribute('class', "unis-data-table");
    table.setAttribute('style', `width:${sum(tableWidth)}px;`);
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

    let fixedBodyTableBox = document.createElement("div");
    fixedBodyTableBox.setAttribute("class", 'fixed-body-box');
    fixedBodyTableBox.setAttribute("style", `max-height:${binding.value}px; max-width:100%; overflow: auto;`);
    el.setAttribute('style', `width: ${sum(tableWidth)}px; `);
    fixedBodyTableBox.appendChild(el);
    parentNodeEl.appendChild(fixedBodyTableBox);
    eventListenes.push(parentNodeEl.addEventListener('scroll', (event: any) => {
        fixedHeadBody.style.left =  - event.target.scrollLeft + 'px';
    }, true));
    /**
     * fixedhead
     */
}

function updatefilexTble(el: any, binding: any ) {
    let eventListenesHeight: any = [];
    const elParentNode = el.parentNode;
    const unisDataTable = elParentNode.getElementsByClassName('unis-data-table');
    forEach(unisDataTable, table => {
        table.removeAttribute("style");
    });
    const tabletbody = elParentNode.querySelectorAll('tbody')[0];
    const tableData = tabletbody.lastChild;
    const tablecolgroups = elParentNode.querySelectorAll('colgroup');
    if (tableData) {
        let fixedThIndexs: any = [];
        const dataTr = el.querySelectorAll('thead')[0].rows[0];
        forEach(dataTr.cells, (cells, index) => {
            if (cells.getAttribute('oldFlex')) {
                fixedThIndexs.push(index);
            }
        });
        if (fixedThIndexs.length > 0) filterFlexSells(fixedThIndexs, el);

        forEach (tablecolgroups, colgroup => {
            forEach(colgroup.childNodes, cells => {
                cells.removeAttribute("style");
            });
        });
        forEach (tablecolgroups, colgroup => {
            forEach(tableData.cells, (cells, index) => {
                colgroup.childNodes[index].setAttribute("style", `width:${cells.offsetWidth}px`);
                colgroup.childNodes[index].setAttribute("width", `${cells.offsetWidth}`);
            });
        });
        let tableWidth: any  = null;
        forEach(tableData.cells, cells => {
            tableWidth += cells.offsetWidth;
        });
        forEach(unisDataTable, table => {
            table.setAttribute("style", `width:${tableWidth}px`);
        });
        if (fixedThIndexs.length > 0) {
            if (tableWidth > elParentNode.offsetWidth) {
                filterFlexRows(elParentNode, fixedThIndexs, el);
            } else  filterFlexRows(elParentNode, fixedThIndexs, el, true);

        }
        if (elParentNode.offsetHeight < tabletbody.offsetHeight) {
            el.scrollTop = 0;
            const fixedFlexRowsDiv =  elParentNode.getElementsByClassName('fixed-rows-box')[0];
            const fixedFlexRowsBody = elParentNode.getElementsByClassName('fixed-rows-body')[0];
            if (fixedFlexRowsDiv && fixedFlexRowsBody) {
                eventListenesHeight.push(el.addEventListener('scroll', (event: any) => handleScroll(event, el, fixedFlexRowsBody), true));
            }
        }
        console.log(elParentNode);
    }

}

function handleScroll(event: any, el: any, fixedFlexRows: any) {
    fixedFlexRows.style.top = -event.target.scrollTop + 'px';

}


function  filterFlexSells(fixedSells: any, el: any) {
    const tableDatas = el.querySelectorAll('tbody')[0].rows;
    forEach(tableDatas, rows => {
        let rowsCells = rows.cells;
        let fixedSellsNumber: any = 0;
        if (!rows.getAttribute('arranged')) {
            forEach(fixedSells, index => {
                rows.setAttribute('arranged', 'true');
                rows.insertBefore(rowsCells[index], rowsCells[fixedSellsNumber]);
                fixedSellsNumber++;
            });
        }
    });
}

function  filterFlexRows(parentNodeEl: any, fixedSells: any, el: any, isRemoveChild: boolean = false) {
    const fixedFlexRowsDiv =  parentNodeEl.getElementsByClassName('fixed-rows-box')[0];
    if (fixedFlexRowsDiv && fixedFlexRowsDiv.firstChild) fixedFlexRowsDiv.removeChild(fixedFlexRowsDiv.firstChild);
    if (isRemoveChild && fixedFlexRowsDiv) {
        fixedFlexRowsDiv.style.height = '0px';
        return;
    }
    if (isRemoveChild) {
        return;
    }
    const clonefixedFlexTable = el.querySelectorAll('table')[0].cloneNode(true);
    const tablecolgroups = el.querySelectorAll('colgroup')[0];
    let fixedFlexRowsWidth: number = 0;
    forEach(fixedSells, (sells, index) => {
        fixedFlexRowsWidth = fixedFlexRowsWidth + Number(tablecolgroups.childNodes[index].getAttribute('width'));
    });

    const fixedPro = document.createElement("div");
    fixedPro.setAttribute('style', `position: relative;`);
    const fixedHead = document.createElement("div");
    fixedHead.setAttribute('style', `position: absolute; left:0, top:0`);
    const cloneHead = clonefixedFlexTable.cloneNode(true);
    cloneHead.removeChild(cloneHead.querySelectorAll('tbody')[0]);
    fixedHead.appendChild(cloneHead);
    const fixedBody = document.createElement("div");
    fixedBody.setAttribute('style', `position: absolute; left:0, top:0`);
    fixedBody.setAttribute('class', `fixed-rows-body`);
    fixedBody.appendChild(clonefixedFlexTable);
    fixedPro.appendChild(fixedBody);
    fixedPro.appendChild(fixedHead);

    if (!fixedFlexRowsDiv) {
        const fixedFlexRows = document.createElement("div");
        fixedFlexRows.setAttribute("class", 'fixed-rows-box');
        fixedFlexRows.setAttribute("style", `position: absolute; height:calc(100% - 18px);   background: red; width:${fixedFlexRowsWidth}px; left:0; top:0px; overflow: hidden;`);
        fixedFlexRows.appendChild(fixedPro);
        parentNodeEl.appendChild(fixedFlexRows);
    } else {
        fixedFlexRowsDiv.appendChild(fixedPro);
        fixedFlexRowsDiv.style.width = `${fixedFlexRowsWidth}px`;
        fixedFlexRowsDiv.style.height = `calc(100% - 18px)`;
    }


}


const funLoding = {
    bind(el: any, binding: any) {

    },
    inserted(el: any, binding: any) {
        let parentNode = document.createElement("div");

        parentNode.setAttribute("class", 'aaaaaaaaa');
        el.parentNode.appendChild(parentNode);
        parentNode.appendChild(el);
        filexTble(el, binding);
    },
    update(el: any, binding: any) {
    },
    unbind(el: any, binding: any) {
        eventListenes = null;
    },
    componentUpdated(el: any, binding: any) {
        if (!el.querySelectorAll('thead')[0]) return;
        if (!el.querySelectorAll('tbody')[0]) return;
        let elParentNode = el.parentNode;
        updatefilexTble(elParentNode, binding);
    },
};

export default fixedTable;
