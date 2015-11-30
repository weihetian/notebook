<?php
require 'connection.php';

$id = $_POST['id'];
$query = "UPDATE note set `active`=0 WHERE id ='$id'";

$result = mysqli_query($con,$query) or die ('Unable to execute query. '. mysqli_error($con));


  
mysqli_close($con);
	
?>