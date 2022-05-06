import { forEach } from 'lodash-es';
const loding = {
  install: (vue: any) => {
    vue.directive("loding", funLoding);
  }
};

const funLoding = {

  bind(el: any, binding: any) {
    if (binding.value) {
      let divEl = document.createElement('div');
      divEl.className = 'loding-box';
      divEl.innerHTML = '<div name="loding" class="loding d-flex justify-content-center blue" style="font-size: 2.5em;" ><div class="loading"></div></div>';
      el.insertBefore(divEl, el.children[0]);
    }
  },

  update(el: any, binding: any) {
    if (!binding.value) {
      let removeNode: any = el.getElementsByClassName('loding-box');
      if (removeNode.length > 0) {
        forEach(removeNode, node => el.removeChild(node));
      }
    }
  }
};

export default loding;
