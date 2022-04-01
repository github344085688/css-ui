
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
    '  <pre style="background: #23241f">'+
    '  <code class="lang-javascript html code css m-0 ">'+
    '  <slot name="htmcode"></slot>'+
    '  </code>'+
    '  </pre>'+
    '  </div>'+
    '  </div>'+
    '  </div>'+
    '  </div>'+
    '  </div>';


  var pageBeforeCreate = function () {
    var name, value, str = location.href, num = str.indexOf("?");
    str = str.substr(num + 1);
    var arr = str.split("&");
    var parameter = {};
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf("=");
      if (num > 0) {
        name = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        parameter[name] = value;
      }
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = "stylesheet";
    var rot = "css/" + parameter['className'] + ".css";
    link.href = rot;
    head.appendChild(link);
  };