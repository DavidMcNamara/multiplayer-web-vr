function setupVoice(data) {
  var checkContents = setInterval(function() {
    if (document.getElementById(data.container)) {
      clearInterval(checkContents);
      run(data);
    }
  }, 1000);
}

function run(data) {
  console.log(data);
  console.log("1");
  if(document.getElementById(data.id)){
    //var node = document.createElement("audio");
  //node.id = data.id;
    document.getElementById(data.id).setAttribute("muted", "");
    //document.getElementById(data.container).appendChild(node);  
  }
  
}
