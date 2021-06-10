
  var dfaulthtml ='<div>'+
    '  <div class="d-flex justify-content-between">'+
    '  <div class="col"></div>'+
    '  <div class="col-2 cursor-p" style="text-align: right">'+
    '  <span @click="showCode()">'+
    '  <i class="icon-15"></i>'+
    '  <i class="icon-8"></i>'+
    '  </span>'+
    '  </div>'+
    '  </div>'+
    '  <div class=" text-left p-0 m-0" :class="{\'card\':idShowCode}">'+
    '  <div class="card-header mb-3" v-show="idShowCode">Example</div>'+
    '  <div class=" m-0 p-0" :class="{\'card-body\':idShowCode}">'+
    '  <div class="d-flex ">'+
    '  <div class="col   d-flex" :class="{\'p-0\':!idShowCode,\'flex-column\':layout==2}">'+
    '  <slot name="htm"></slot>'+
    '  </div>'+
    '  </div>'+
    '  <div class="col-12 p-0 hr mt-2 " v-show="idShowCode"></div>'+
    '  <div class="d-flex ">'+
    '  <div class="col-12 p-0" v-show="idShowCode">'+
    '  <slot name="htmcode"></slot>'+
    '  <div v-if="javascriptcode">' +
    ' Javascript Code'+
    '  <pre class="hljs javascript" >' +
    '  <code class="javascript">'+
    '  <slot name="javascriptcode"></slot>'+
    '  </code>' +
    '  </pre>'
  '  </div>'+ '  <div v-if="javascriptcode">' +
  ' Javascript Code'+
  '  <pre class="hljs javascript lang-javascript html code css" >' +
  '  <code class="javascript lang-javascript html code css">'+
  '  <slot name="javascriptcode"></slot>'+
  '  </code>' +
  '  </pre>'
  '  </div>'+
    '  </div>'+
    '  </div>'+
    '  </div>'+
    '  </div>'+
    '  </div>';