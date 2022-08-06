var elml = {};
if (process.argv[2] == undefined || process.argv[2] == '--help'){
 console.log('help');
 console.log('=> node elml.js [filename]');
 process.exit();
}
 elml.fs = require('fs');
 elml.layers = [];
 elml.layer = 0;
 elml._mode = false;
 elml.__attr = "";
 elml.___attr = "";
 elml._prev_node = undefined;
 elml._generated = "";
 elml.__output_filename = process.argv[2].split('.');
 elml.__output_filename.pop();
 elml.__output_filename.push('html');
 elml.__output_filename =  elml.__output_filename.join('.');
elml.elem = function(attr){
 this.attr = attr;
 this._parentNode = undefined;
 this._childNodes = [];
 this._innerHTML = "";
}
elml.parse = function(){
 try {
  elml.text = elml.fs.readFileSync(process.argv[2],'utf-8');
 } catch {
  console.log('error... no input file found...');
  process.exit();
 }
 elml.text = (elml.text.split('\n'));
 for (var _e = 0; _e < elml.text.length; _e++){
  elml.layer = 0;
  if (elml.text[_e].charAt(0) == '@'){
   for (var _f = 1; _f < elml.text[_e].length; _f++){
    if (elml.text[_e].charAt(_f) == '-'){
     elml.layer++;
    } else {
     if (elml.text[_e].charAt(_f) == '>'){
      elml.__attr = "";
      for (var _g = _f+1; _g < elml.text[_e].length; _g++){
       elml.__attr += elml.text[_e].charAt(_g);
      }
      elml.___attr = elml.__attr;
      for (var _g = 0; _g < elml.__attr.length; _g++){
       if (elml.__attr.charAt(_g) == " "){
        elml.___attr = (elml.__attr.slice(_g+1,elml.__attr.length));
       } else {
        break;
       }
      }
      elml.__attr = elml.___attr;
      for (var _g = elml.__attr.length-1; _g >= 0; _g--){
       if (elml.__attr.charAt(_g) == " "){
        elml.___attr = (elml.__attr.slice(0,elml.__attr.length-1));
       } else {
        break;
       }
      }
      elml.__attr = elml.___attr;
     }
     break;
    }
   }
   if (elml.layer == 0){
    if (elml.text[_e].charAt(1) == 's'){
     elml._mode = true;
    } else if (elml.text[_e].charAt(1) == 'e'){
     elml._mode = false;
    }
   } else if (elml._mode){
    if (elml.text[_e].charAt(1) == '-'){
     elml.layers[elml.layer] = new elml.elem(elml.__attr);
     elml._prev_node = elml.layers[elml.layer];
     if (elml.layer > 1){
      if (!elml.layers[elml.layer-1]){
       console.log('error... no parent nodes found...');
       process.exit();
      }
      elml.layers[elml.layer-1]._childNodes.push(elml.layers[elml.layer]);
      elml.layers[elml.layer]._parentNode = elml.layers[elml.layer-1];
     }
    }
   }
  } else if (elml._mode){
   if (elml.text[_e].charAt(0) == '\\' && elml.text[_e].charAt(1) == '@'){
    elml._prev_node._innerHTML += (elml.text[_e].slice(1,elml.text[_e].length)) + "\n";
   } else { 
    elml._prev_node._innerHTML += (elml.text[_e]) + "\n";
   }
  }
 }
}
elml.parse();
elml.compile = function(_node){
 if (_node.attr != "innerHTML"){
  elml._generated += "<"+_node.attr+">";
 }
 if (_node._innerHTML != ""){
  elml._generated += _node._innerHTML;
 }
 for (var _c = 0; _c < _node._childNodes.length; _c++){
  elml.compile(_node._childNodes[_c]);
 }
 if (_node.attr != "innerHTML"){
  elml._generated += "</"+_node.attr.split(" ")[0]+">";
 }
}
elml.compile(elml.layers[1]);
elml.fs.writeFileSync(elml.__output_filename,elml._generated);
