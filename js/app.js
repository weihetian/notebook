var app =angular.module('notebook',['ngRoute'])

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
  
}
]);


//save the susor poition
var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;
        
        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection && document.body.createTextRange) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}

var savedSelection;
var insertrange;

function doSave() {
    savedSelection = saveSelection( document.getElementById("content_edit_area") );
	console.log(savedSelection);
}

function doRestore(offset) {
    if (savedSelection) {
		savedSelection.end = savedSelection.end+offset;
        restoreSelection(document.getElementById("content_edit_area"), savedSelection);
    }
}

//


function createRangeFromCharacterIndices(containerEl, start, end) {
    var charIndex = 0, range = document.createRange(), foundStart = false, stop = {};
    range.setStart(containerEl, 0);
    range.collapse(true);

    function traverseTextNodes(node) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && start >= charIndex && start <= nextCharIndex) {
                range.setStart(node, start - charIndex);
                foundStart = true;
            }
            if (foundStart && end >= charIndex && end <= nextCharIndex) {
                range.setEnd(node, end - charIndex);
                throw stop;
            }
            charIndex = nextCharIndex;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i]);
            }
        }
    }

    try {
        traverseTextNodes(containerEl);
    } catch (ex) {
        if (ex == stop) {
            return range;
        } else {
            throw ex;
        }
    }
}


app.directive("scroll", function () {
    return function(scope, element, attrs) {
		
		var old = $('#content_edit_area').position().top;
		element.bind('DOMMouseScroll', function(e){
			//alert();
			console.log(e.originalEvent.detail);
		     if(e.originalEvent.detail > 0) {
		         //scroll down
		         console.log('Down');
				 $('#content_edit_area').scrollTop -= 10;
		     }else {
		         //scroll up
		         console.log('Up');
				  $('#content_edit_area').scrollTop += 10;
		     }

		     //prevent page fom scrolling
		     return false;
		 });

		 //IE, Opera, Safari
		 element.bind('mousewheel', function(e){
			// alert();
			//	console.log(e.originalEvent.wheelDelta);
			var divheight = $('#content_edit_area').height();
			var display = element.height()
		     if(e.originalEvent.wheelDelta < 0) {
		         //scroll down
				 if($('#content_edit_area').position().top+divheight<display){
 				  	$('#content_edit_area').clearQueue();
 				    $('#content_edit_area').stop();
					 return;
				 }
				 if($('#content_edit_area').position().top + e.originalEvent.wheelDelta <= old){
				  $('#content_edit_area').animate({top: '+='+e.originalEvent.wheelDelta}, 10);
			  	}
		     }else {
				
		         //scroll up
				 if($('#content_edit_area').position().top + e.originalEvent.wheelDelta <= old){
				  $('#content_edit_area').animate({top: '+='+e.originalEvent.wheelDelta}, 10);
			  	}
		     }
			 
			  if($('#content_edit_area').position().top > old){
			  	$('#content_edit_area').clearQueue();
			    $('#content_edit_area').stop();
				   $('#content_edit_area').animate({top: 0}, 10);
			  }

		     //prevent page fom scrolling
		     return false;
		 });
    };
});

var oldhtml = $('.content_edit').html();

app.directive('htmleditor', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
 	   element.on('keyup', function(event) {
		 //  alert(element.val());
		   	if(event.which == 13){
			//	$('.content_edit').focus().html($('.content_edit').html());
			//	var tmpStr = $('.content_edit').html();
				
				$('.content_edit').addClass('stop-scrolling')
				
				
		    	$('.content_edit').focus();
		     //	 placeCaretAtEnd( document.getElementById("content_edit_area") );
			 
			 	 doRestore(insertrange.toString().length);
			 
				 $('.content_edit').removeClass('stop-scrolling')
			//	placeCaretAtEnd($('.content_edit'));
				
			//	$('.content_edit').html('');
			//	$('.content_edit').html(tmpStr);
			
			
			
				$('.html_edit_area').val("");
				$('.html_edit').hide();
				console.log(insertrange.endOffset);
				return;
			}
			
			
			
		
		
		    var el = document.createElement("div");
		    el.innerHTML = element.val();
			var frag = document.createDocumentFragment(), node, lastNode;
			            while ( (node = el.firstChild) ) {
			                lastNode = frag.appendChild(node);
						//	console.log("length is :" + node.length);
			            }
						
						
				//insertrange.
						insertrange.deleteContents();
			            insertrange.insertNode(frag);
					//	console.log(frag);
		//	range.insertNode();
			
		   //	 var end = oldhtml.substring(savedSelection.start);
		//     var newhtml = oldhtml.substring(0, savedSelection.start) + element.val() + end;
		//	 console.log(newhtml);
		 //	 $("#txtarea").html(newValue);
		  
		  
		//   var newhtml =oldhtml+element.val();
		//   $('.content_edit').html(newhtml);
		   
		   
 	   }
    );
	
    element.on('blur', function(event) {
      
		$('.html_edit_area').val("");
		$('.html_edit').hide();
		return;
    });
		
	}
	
}

}
);



app.directive('contenteditable', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };
	  
	  
	  var htmlStart = false;
	  
	   element.on('keydown', function(event) {
		   
   		if(event.which == 16){
			
			doSave();
   			htmlStart=true;
		
			oldhtml = $('.content_edit').html();
   			$('.html_edit').show();
   			var html = element.html();
			var div = document.getElementById("content_edit_area");
			
			
			// plus one so the html wont be affect by the html infront, this actually works out well as it goes to the next line when there is a line break
			insertrange = createRangeFromCharacterIndices(div, savedSelection.start+1, savedSelection.start+1);
			
			
			$('.html_edit_area').focus();
			
   			//html +="<h1>this is cood</h1>";
   		//	element.html(html);
		
	
   		}
	   }
   );

      // Listen for change events to enable binding
      element.on('blur keyup change focus', function(event) {
        
	
		scope.$apply(read);
      });
      read(); // initialize
	  
	  
	

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
});



app.factory('Current', function () {
    var current = {
       	id: '',
		time: ''
		
    };

    return {
        getTime: function () {
            return current.time;
        },
        setTime: function (time) {
            current.time = time;
        },
        getId: function () {
            return current.id;
        },
        setId: function (id) {
            current.id = id;
        }
    };
});