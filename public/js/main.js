$(function() {

  'use strict';

  // Form

  var contactForm = function() {

    if ($('#contactForm').length > 0) {
      $("#contactForm").validate({
        rules: {
          ttitle: "required"
        },
        messages: {
          ttitle: "Lütfen Başlık Giriniz"
        },
        /* submit via ajax */
        submitHandler: function(form) {


					var data = {
				    "id": $("#tid").val(),
				    "title": $("#ttitle").val(),
				    "cid": $("#tcid").val(),
				    "media": $("#tmedia").val(),
				    "group": $("#tgroup").val(),
				    "url": $("#turl").val(),
				    "image": $("#timage").val(),
				    "vimeo": $("#tvimeo").val()
				  }

					updateContent(data);

          /* var $submit = $('.submitting'),
            waitText = 'Submitting...';

          $.ajax({
            type: "POST",
            url: "php/send-email.php",
            data: $(form).serialize(),

            beforeSend: function() {
              $submit.css('display', 'block').text(waitText);
            },
            success: function(msg) {
              if (msg == 'OK') {
                $('#form-message-warning').hide();
                setTimeout(function() {
                  $('#contactForm').fadeOut();
                }, 1000);
                setTimeout(function() {
                  $('#form-message-success').fadeIn();
                }, 1400);

              } else {
                $('#form-message-warning').html(msg);
                $('#form-message-warning').fadeIn();
                $submit.css('display', 'none');
              }
            },
            error: function() {
              $('#form-message-warning').html("Something went wrong. Please try again.");
              $('#form-message-warning').fadeIn();
              $submit.css('display', 'none');
            }
          }); */
        }

      });
    }
  };
  contactForm();
  //$.LoadingOverlay("show");
  setTimeout(function() {
    $.LoadingOverlay("hide");
  }, 3000);
  $('.tooltip').tooltipster();

  reStartServer();
  //getStats();

});

$(document).ready(function() {

  $('#tooltipvimeo').tooltipster({
     contentAsHTML: true,
     content: '<div class="vimeocontainer"> Sağdaki kutudan Vimeo ID yazarak aşağıdaki linklere ulaşılır. <br /><br /> <img src="images/vimeo.png" />  </div>'
  });


});

function reStartServer() {

  getData("/admin/restartserver", {
  		"id": ""
  	}, function(response) {

  		 setTimeout(function() { getStats(); } , 3000);

  	});


}

function getStats() {


	getData("/admin/getstats", {
		"id": ""
	}, function(response) {

		$("#totaluser").html(response.l2);
		$("#totalcontent").html(response.l1);
		$("#totalcontact").html(response.l3);
		 setTimeout(function() { getContents(); }, 501);

	});

}


function updateContent(data) {

	var $submit = $('.submitting'),
		waitText = 'Kaydediliyor...';

		$submit.css('display', 'block').text(waitText);

	getData("/admin/updatecontent", data, function(response) {
		 getContents();
		 $("#tid").val("");
	 	$("#ttitle").val("");
	 	$("#tcid").val("");
	 	$("#tmedia").val("0");
	 	$("#tgroup").val("0");
	 	$("#turl").val("");
	 	$("#timage").val("");
	 	$("#tvimeo").val("");
		  $('#form-message-success').fadeIn();
			  $submit.css('display', 'none');
	});



}

function getContents() {



  getData("/admin/getlist", {
    "id": ""
  }, function(response) {
    var data = [];
    for (var i = 0; i < response.list.length; i++) {
      var item = response.list[i];
      data.push([item.cid == undefined ? "#" + item._id : item.cid, item.title, item.media, item.group.title, item._id]);
    }
    updateGrid(data);

  });

}

function getData(url, data, _callback) {

  $.LoadingOverlay("show");
  var settings = {
    "url": url,
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer bb4c18c2595749ca8bce1d1e558055a67549943aef6861629b52eaa01393aa4474e079326a9e2500d58d425bed374d9d6000307d2bf7126b83c43cb0105abb0fd97b9e3991fe7a57c6d2fa3ca66199e83d8981c62437e2a1b21553759924fd5d604f954414aed9235577554ca1cd15d6aac1f0a06718fd81420f53a676be8c9bd918f88f38c579192e163fafa839e0dba09389a6df3b83de071756891ffda54d0ae6c7a4f73f",
      "Content-Type": "application/json"
    },
    "data": JSON.stringify(data),
  };

  $.ajax(settings).done(function(response) {
    setTimeout(function() {
      $.LoadingOverlay("hide");
    }, 500);
    _callback(response);
  });

}




function editEvent(id) {
  location.href = '#home';

  if (id == '') {
		$("#tid").val("");
    $("#ttitle").val("");
    $("#tcid").val("");
    $("#tmedia").val("0");
    $("#tgroup").val("0");
    $("#turl").val("");
    $("#timage").val("");
    $("#tvimeo").val("");
  } else {

    getData("/admin/getcontent", {
      "id": id
    }, function(response) {
      var item = response.list;
			$("#tid").val(id);
      $("#ttitle").val(item.title);
      $("#tcid").val(item.cid);
      $("#tmedia").val(item.media);
      $("#tgroup").val(item.group.id);
      $("#turl").val(item.url);
      $("#timage").val(item.image);
      $("#tvimeo").val(item.vimeo);
    });


  }



}
