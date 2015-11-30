<?php
require 'connection.php';

$query = "SELECT * FROM note WHERE `active`=1 ORDER BY id DESC";

$result = mysqli_query($con,$query) or die ('Unable to execute query. '. mysqli_error($con));

$num_rows = mysqli_num_rows($result);

$notes = Array();
if($num_rows == 0)
{
	 
}else
{
	while($row = mysqli_fetch_array($result))
	{
		$notes[]= array('id'=>$row['id'],"title"=>$row['title'],"content"=>$row['content'],"time"=>$row['time']);
	}
}


echo json_encode($notes);
  
mysqli_close($con);
	


?>