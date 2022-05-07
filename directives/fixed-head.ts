import { forEach } from 'lodash-es';
const fixedTable = {
    install: (vue: any) => {
        vue.directive("fixedHead", funLoding);
    }
};
function filexTble(el: any, binding: any) {
    const parentNodeEl = el.parentNode;
    const ElThead = el.querySelectorAll('thead')[0];
    const elTheadThs = ElThead.rows[0];
    const elTheadThsCells = elTheadThs.cells;
    const elTbody = el.querySelectorAll('tbody')[0];
    const elTbodyRows = elTbody.rows;
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
        forEach(elTbodyRows, rows => {
            let rowsCells = rows.cells;
            let fixedSellsNumber: any = 0;
            forEach(fixedSells, index => {
                rows.setAttribute('arranged', 'true');
                rows.insertBefore(rowsCells[index], rowsCells[fixedSellsNumber]);
                fixedSellsNumber++;
            });
        });
    }

    const elTbodyFirstTr = elTbodyRows[0].cells;
    const cloneElThead = ElThead.cloneNode(true);
    let fixedTheadBox = document.createElement("div");
    let colgroup = document.createElement("colgroup");
    forEach(elTbodyFirstTr, cells => {
        let col = document.createElement("col");
        col.width = cells.offsetWidth;
        colgroup.appendChild(col);

    });
    el.insertBefore(colgroup, el.firstChild);
    parentNodeEl.setAttribute('style', 'position: relative;');
    fixedTheadBox.setAttribute('style', 'position: absolute; left:0; top:0px;');
    let fixedTable = document.createElement("table");
    fixedTable.classList.add(el.className);

    let cloneColgroup = colgroup.cloneNode(true);
    fixedTable.appendChild(cloneColgroup);
    fixedTable.appendChild(cloneElThead);
    fixedTheadBox.appendChild(fixedTable);
    parentNodeEl.insertBefore(fixedTheadBox, el);

    let fixedBodyBox = document.createElement("div");
    fixedBodyBox.setAttribute("class", 'fixed-body-box');
    fixedBodyBox.setAttribute("style", `max-height:${binding.value}px; overflow-y: auto;`);
    fixedBodyBox.appendChild(el);
    parentNodeEl.appendChild(fixedBodyBox);

    if (fixedSells.length > 0) {
        filterHead(el, el.parentNode);
        filterFlexColumn(el, el.parentNode,  fixedSells, binding );
    }
}
function updatefilexTble(el: any, binding: any ) {
    const elParentNode = el.parentNode;
    const elColgroups = elParentNode.querySelectorAll('colgroup');
    const elColgroup1Cells = elColgroups[0].childNodes;
    const elColgroup2Cells = elColgroups[1].childNodes;
    const elTtbody = elParentNode.querySelectorAll('tbody')[0];
    const elTbodyRows = elTtbody.rows;
    const ElThead = el.querySelectorAll('thead')[0];
    const elTheadThs = ElThead.rows[0].cells;
    let fixedThIndexs: Array<any> = [];
    const elTbodyFirstTr = elTtbody.rows[0].cells;
    forEach(elTbodyFirstTr, (cells, index) => {
        elColgroup1Cells[index].width = cells.offsetWidth;
        elColgroup2Cells[index].width = cells.offsetWidth;
    });

    forEach(elTheadThs, (cells, index) => {
        if (cells.getAttribute('oldFlex')) {
            fixedThIndexs.push(index);
        }
    });

    if (fixedThIndexs.length > 0) {
        filterDatasColumn(elParentNode, elTbodyRows, elColgroups, fixedThIndexs);
    }

}
function filterHead(el: any, elParentNode: any) {
    const width = el.getAttribute('width');
    const tables = elParentNode.parentNode.querySelectorAll('table');
    let fixedHaedBox = tables[0].parentNode;
    // console.log(getComputedStyle(fixedHaedBox, null).width );
    let fixedHeadContent = document.createElement("div");
    fixedHeadContent.setAttribute('style', `position: absolute; left:0; top:0px; width: ${width}px`);
    fixedHeadContent.appendChild(tables[0]);
    let fixedHeadPr = document.createElement("div");
    fixedHeadPr.setAttribute('style', `position: relative;  overflow: hidden; height:40px; width: ${width}px`);
    fixedHeadPr.appendChild(fixedHeadContent);
    fixedHaedBox.appendChild(fixedHeadPr);
}
function filterFlexColumn(el: any, elParentNode: any,  fixedSells: any, binding: any) {
    const width = el.getAttribute('width');
    elParentNode.style.maxWidth = width ? (width + 'px') : '800px';
    elParentNode.style.overflow = 'auto';
    elParentNode.style.borderRight = '1px solid #CECECE';
    const tables = elParentNode.parentNode.querySelectorAll('table');
    const colgroup = elParentNode.querySelectorAll('colgroup')[0];
    let tablWidth: any = 0;
    forEach(colgroup.childNodes, cells => {
        tablWidth = tablWidth + Number(cells.width);
    });
    tables[0].style.width = tablWidth + 'px';
    tables[1].style.width = tablWidth + 'px';

    const cloneNodeTable = el.cloneNode(true);
    let fixedBody = document.createElement("div");
    let fixedBodyWidth: any = 0;
    forEach(fixedSells, index => {
        fixedBodyWidth = fixedBodyWidth + Number(colgroup.childNodes[index].width);
    });
    fixedBody.setAttribute("style", `width:${fixedBodyWidth}px; height:${(tables[1].offsetHeight > binding.value ? binding.value : tables[1].offsetHeight) - 17}px; overflow: hidden; position: absolute; left:0; top:0;`);
    fixedBody.setAttribute("class", 'fixed-body-col');
    fixedBody.appendChild(cloneNodeTable);
    elParentNode.parentNode.appendChild(fixedBody);
    elParentNode.parentNode.firstChild.style.width = width + 'px';
    elParentNode.parentNode.firstChild.style.overflowX = 'hidden';
    elParentNode.parentNode.firstChild.style.borderRight = '1px solid #CECECE';
    elParentNode.parentNode.firstChild.style.overflowX = 'hidden';
}
function filterDatasColumn(elParentNode: any , elTbodyRows: any , elColgroups: any, fixedThIndexs: any) {
    forEach(elTbodyRows, rows => {
        if (!rows.getAttribute('arranged')) {
            let rowsCells = rows.cells;
            let fixedSellsNumber: any = 0;
            forEach(fixedThIndexs, index => {
                rows.insertBefore(rowsCells[index], rowsCells[fixedSellsNumber]);
                rows.setAttribute('arranged', 'true');
                fixedSellsNumber++;
            });
        }
    });
    let elLastChildNode = elParentNode.lastChild;
    const elLastChildNodeTable = elLastChildNode.querySelectorAll('table')[0];
    elLastChildNode.removeChild(elLastChildNodeTable);
    const elLastChildNode1 = elParentNode.childNodes[1];
    const cloneTable = elLastChildNode1.querySelectorAll('table')[0].cloneNode(true);
    elLastChildNode.appendChild(cloneTable);
    const  cloneTableRows1 = cloneTable.rows[1];
    const  cloneTableRowsCells = cloneTableRows1.cells;
    forEach(elColgroups, colgroup => {
        forEach(colgroup.childNodes, (node, index) => {
            if (cloneTableRowsCells[index]) {
                node.width = cloneTableRowsCells[index].offsetWidth;
            }
        });
    });
    let fixedBodyWidth: any = 0;
    forEach(fixedThIndexs, (vaule, index) => {
        fixedBodyWidth = fixedBodyWidth + Number(cloneTableRowsCells[index].offsetWidth);
    });
    elLastChildNode.style.width = fixedBodyWidth + 'px';
}
let eventListenes: Array<any> = [];

const funLoding = {
    bind(el: any, binding: any) {
    },
    inserted(el: any, binding: any) {
        filexTble(el, binding);
    },
    update(el: any, binding: any) {
    },
    unbind(el: any, binding: any) {
        eventListenes = [];
    },
    componentUpdated(el: any, binding: any) {
        let elParentNode = el.parentNode;
        updatefilexTble(elParentNode, binding);

       /* let classNameElCells = el.querySelectorAll("thead")[0];
        let rowsCells = classNameElCells.rows[0].cells;
        let isFixed: boolean = false;
        forEach(rowsCells, cells => {
            if (cells.getAttribute('fixed') != null) {
                isFixed = true;
            }
        });
        if (isFixed) {
            let positionBox = elParentNode.previousElementSibling.querySelectorAll('table')[0].parentNode;
            console.log(positionBox);
            eventListenes.push(elParentNode.addEventListener('scroll', (event: any) => handleScroll(event, positionBox, elParentNode.nextElementSibling), true));
            isFixed = false;
        }*/

        /*     if (classNameEl.length > 0) {
         forEach(classNameEl, classEl => {

         const colgroups = classEl.querySelectorAll('thead')[0];
         let isFixed: boolean = false;
         forEach(colgroups.rows[0].cells, cells => {
         if (cells.getAttribute('fixed') != null) {
         isFixed = true;
         }
         });
         if (isFixed) {
         // let elfixedHead = el.parentNode.children[1];
         console.log(classEl);
         eventListenes.push(classEl.addEventListener('scroll', handleScroll, true));
         isFixed = false;
         }
         });
         }*/
    },
};

export default fixedTable;
