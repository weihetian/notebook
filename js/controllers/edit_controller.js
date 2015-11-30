(function(){
    var app= angular.module('notebook');
    app.controller('editController', ['$scope','Current', function ($scope,Current) {
		
		$scope.edit={id:"", title: "",content:"",time:""};
		
		$scope.$watch( function() { return Current.getId(); }, function(newValue, oldValue) {
			
			if(Current.getId()!=""){
				var id =Current.getId();
				loadnote(id);
		}
		});
		
			
		
		// $scope.$watch(function(){return $scope.edit.content;},function(newValue,oldValue){
	//
	// 		if(newValue.length>oldValue.length){
	// 			console.log(newValue);
	// 			if(newValue[newValue.length-1]=="<"){
	//
	// 			}
	// 		}
	// 	})
		
		$scope.delete_confirm = false;
		
		function loadnote(id){
			
			
			var dataString = 'id='+id;
			$.ajax({
				type: "POST",
				url: "data_access/pull_note.php",
				datatype: "html",
				data: dataString,
				success: function(data) {
					var currentnote=$.parseJSON(data);
					$scope.edit.id=currentnote.id;
					$scope.edit.title=currentnote.title;
					$scope.edit.content=currentnote.content;
					$scope.edit.time=currentnote.time;
					$scope.$digest();
				}
			})
		}
		
		$scope.delete = function(){
			$scope.delete_confirm=true;
		}
		
		$scope.not_delete_note =function(){
			$scope.delete_confirm=false;
		}
		
		$scope.new_note = function(){
			$scope.edit={id:"", title: "",content:"",time:""};
			Current.setId(-1);
		}
		
		
		$scope.delete_note =function(){
			var id = $scope.edit.id;
			var dataString = "id="+id;
			$.ajax({
				type: "POST",
				url: "data_access/delete_note.php",
				datatype: "html",
				data: dataString,
				success: function(data) {
					//Current.setTime(data);
					$scope.delete_left(id);
					$scope.delete_confirm=false;
					$scope.new_note();
					$scope.notification("Done deleting!");
				}
			})
		}
		

		
		$scope.save = function(){
			var title=$scope.edit.title;
			var content=$scope.edit.content;
			var id = $scope.edit.id;
			
			var type;
			
			if(id==""||id==null||id==undefined){
				var dataString = 'title='+title+'&content='+content;
				
				type=1;
			}else{
				
				var dataString = 'id='+id+'&title='+title+'&content='+content;
				type=2;
			}
		
			//alert(dataString);
			$.ajax({
				type: "POST",
				url: "data_access/push_note.php",
				datatype: "html",
				data: dataString,
				success: function(data) {
					//Current.setTime(data);

					if(type==2){
						$scope.notification("Done saving!");
						$scope.update_left(id,title,content);
					}else{
						var newnote=$.parseJSON(data);

						$scope.notification("New note created!");
						$scope.add_left(newnote);
					}
				}
			})
			
		}
		
	}
])
}())