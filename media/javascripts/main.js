$(function () {

  $('.script').each(function () {
    eval($(this).text());
  });

  var setText = function ($textarea, text) {
    var range, textarea = $textarea.get(0);
    textarea.focus();
    if (typeof textarea.selectionStart === 'number') {
      textarea.value = text;
      textarea.selectionStart = textarea.selectionEnd = text.length;
      return;
    }
    range = textarea.createTextRange();
    range.text = text
    range.select();
  }

  var $textarea = $('#textarea1');
  var textarea = $textarea.get(0);
  $textarea.focus();
  if (typeof textarea.selectionStart === 'number') {
    textarea.selectionStart = textarea.selectionEnd = $textarea.val().length;
  } else {
    var range = textarea.createTextRange();
    range.select();
  }
  $textarea.keyup();

  SyntaxHighlighter.all();
});


function upload_query_files(event) {
  event.preventDefault();
  var fileSelect = document.getElementById("file_input");
  $("#upload_btn").html('Uploading...');
  console.debug(fileSelect);
  var files = fileSelect.files;
  if (files.length == 0) {
    alert('No file selected');
    return;
  }
  var data = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    // Add the file to the request.
    data.append('files', file, file.name);
  }
  //ajax request
  console.debug(data);
  $.ajax({
      url: '/upload',
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: function(data, textStatus, jqXHR)
      {
          if(typeof data.error === 'undefined')
          {
              // Success so call function to process the form
              $("#upload_btn").html('Upload');
          }
          else
          {
              // Handle errors here
              console.log('ERRORS: ' + data.error);
          }
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
          // Handle errors here
          console.log('ERRORS: ' + textStatus);
          // STOP LOADING SPINNER
      }
  });
};


function bootstrap() {
  console.log('iiiii');
  var parser = $("#parser_select option:selected").text();
  parser = parser.replace(/^\s+|\s+$/g,'');
  $("#btsp_btn").html('Parsing...');
  var editor = $("#editor");
  var data = editor.val();
  var queries = data.split("\n");
  for (var i = 0; i < queries.length; i++) {
    queries[i] = queries[i].trim();
  }
  $.ajax({
      url: "/parse",
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify({
          "queries": queries,
          "parser": parser
      }),
      success: function(data) {
          // replace raw queries with parsed queries
          var response = JSON.parse(data);
          var queries = JSON.parse(response['queries']);
          $("#editor").val('');
          for (var i = 0; i < queries.length; i++) {
              editor.val(editor.val() + queries[i]['parsed_query'] + '\n');
          }
          $("#btsp_btn").html('Bootstrap');
      },
      error: function(data) {
          // IS_BUSY = false;
          alert('Parsing Error.');
          $("#btsp_btn").html('Bootstrap');
      }
  });
};