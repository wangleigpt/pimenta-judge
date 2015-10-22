
var problems = [];
problems["A"] = "#FF0000";
problems["B"] = "#00FF00";
problems["C"] = "#0000FF";
problems["D"] = "#FF6600";
problems["E"] = "#006600";
problems["F"] = "#003399";
problems["G"] = "#FFCC00";
problems["H"] = "#FFFFFF";
problems["I"] = "#000000";
problems["J"] = "#FFFF00";
problems["K"] = "#663300";

function login() {
  team = document.getElementById("team");
  pass = document.getElementById("pass");
  if (team.value == "" || pass.value == "") {
    document.getElementById("response").innerHTML = "Invalid team/password!";
    return;
  }
  if (window.XMLHttpRequest)
    xmlhttp = new XMLHttpRequest();
  else
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.responseText[0] == 'I') {
        document.getElementById("response").innerHTML = xmlhttp.responseText;
      }
      else {
        window.location = "/";
      }
    }
  }
  xmlhttp.open("POST", "login", true);
  xmlhttp.setRequestHeader("Team", team.value);
  xmlhttp.setRequestHeader("Password", pass.value);
  xmlhttp.send();
  team.value = "";
  pass.value = "";
}

function init() {
  init_problems();
  data("teamname", "teamname", "Team: ", "", function(){});
  submission();
}

function init_problems() {
  totalproblems = 0;
  for (p in problems) totalproblems++;
  opts = "<option></option>";
  for (i = 0; i < totalproblems; i++) {
    prob = String.fromCharCode(65+i);
    opts += ("<option value=\""+prob+"\">"+prob+"</option>");
  }
  document.getElementById("problem").innerHTML = opts;
}

function data(key, tagid, before, after, cb) {
  if (window.XMLHttpRequest)
    xmlhttp = new XMLHttpRequest();
  else
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById(tagid).innerHTML = before+xmlhttp.responseText+after;
      cb();
    }
  }
  xmlhttp.open("GET", "?"+key, true);
  xmlhttp.send();
}

var interval;
function submission() {
  clearInterval(interval);
  document.getElementById("content").innerHTML = document.getElementById("submission").innerHTML;
  document.getElementById("file").focus();
}
function fixballoons() {
  jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');
      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass+' replaced-svg');
      }
      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');
      // Replace image with new SVG
      $img.replaceWith($svg);
      // set color
      for (p in problems) {
        $(".balloon."+p+" > path.balloonfill").css("fill", problems[p]);
      }
    }, 'xml');
  });
}
function scoreboard() {
  clearInterval(interval);
  data("scoreboard", "content", "", "", fixballoons);
  interval = setInterval(function() {
    data("scoreboard", "content", "", "", fixballoons);
  }, 10000);
}
function clarifications() {
  clearInterval(interval);
  data("clarifications", "content", document.getElementById("clarifications").innerHTML, "", function() {
    document.getElementById("problem").focus();
  });
}

function attempt() {
  document.getElementById("response").innerHTML = "Wait for the verdict.";
  file = document.getElementById("file");
  if (window.XMLHttpRequest)
    xmlhttp = new XMLHttpRequest();
  else
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById("response").innerHTML = xmlhttp.responseText;
    }
  }
  xmlhttp.open("POST", "attempt", true);
  xmlhttp.setRequestHeader("File-name", file.files[0].name);
  xmlhttp.setRequestHeader("File-size", file.files[0].size);
  xmlhttp.send(file.files[0]);
  file.value = "";
}

function question() {
  prob = document.getElementById("problem");
  if (prob.value == "") {
    document.getElementById("response").innerHTML = "Choose a problem!";
    return;
  }
  ques = document.getElementById("question");
  if (ques.value == "") {
    document.getElementById("response").innerHTML = "Write something!";
    return;
  }
  document.getElementById("response").innerHTML = "Question sent. Wait and refresh.";
  if (window.XMLHttpRequest)
    xmlhttp = new XMLHttpRequest();
  else
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById("response").innerHTML = xmlhttp.responseText;
    }
  }
  xmlhttp.open("POST", "question", true);
  xmlhttp.setRequestHeader("Problem", prob.value);
  xmlhttp.setRequestHeader("Question", ques.value);
  xmlhttp.send();
  prob.value = "";
  ques.value = "";
}
