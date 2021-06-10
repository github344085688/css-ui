
var opts = {
  'indent_size': 5,
  'indent_char': ' ',
  'max_char': 800,
  'brace_style': 'expand',
}
var source = document.getElementsByClassName('code');
for (var i = 0; i < source.length; i++) {
  source[i].innerHTML = style_html(source[i].innerHTML, opts).replace(/</g, "&lt;");
}
hljs.initHighlightingOnLoad();
