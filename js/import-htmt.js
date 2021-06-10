/**
 * Created by f on 2021/5/18.
 */
function documentAppendChild(List) {
  for(var i = 0; i<List.length; i++){
    var grey = Vue.extend({
      template: '#'+List[i],
      data: function () {
        return {
          idShowCode: false,
          codeHtml:''
        }
      },
      mounted:function(){
        this.codeHtml=this.$refs.html;
        console.log(this.$refs.html);
      },
      methods: {
        showCode: function () {
          this.idShowCode = !this.idShowCode;
        }
      }
    });
    instance = new grey({
      el: document.createElement('div')
    });
    var childApp= document.getElementById('childApp');
    childApp.appendChild(instance.$el);
  }

}