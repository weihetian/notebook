<?php
require 'connection.php';

$id = $_POST['id'];
$query = "SELECT * FROM note WHERE id ='$id'";

$result = mysqli_query($con,$query) or die ('Unable to execute query. '. mysqli_error($con));

$num_rows = mysqli_num_rows($result);

$note;
if($num_rows == 0)
{
	 
}else
{
	while($row = mysqli_fetch_array($result))
	{
		$note= array('id'=>$row['id'],"title"=>$row['title'],"content"=>$row['content'],"time"=>$row['time']);
	}
}


echo json_encode($note);
  
mysqli_close($con);
	
?>