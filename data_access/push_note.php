<?php
require 'connection.php';


if(isset($_POST['title']))
{
	$title = addslashes($_POST['title']);
	
}

if(isset($_POST['content']))
{
	$content = addslashes($_POST['content']);
	
}

if(isset($_POST['id']))
{
	$id = $_POST['id'];
	$query = "REPLACE INTO note (id,title,content) VALUE ('$id','$title','$content')";
	
}else
{
	$query = "INSERT INTO note (title,content) VALUE ('$title','$content')";
}


$result = mysqli_query($con,$query) or die ('Unable to execute query. '. mysqli_error($con));

$last_id = mysqli_insert_id($con);

$query2 = "SELECT * FROM note WHERE `id` = $last_id";

$result2 = mysqli_query($con,$query2) or die ('Unable to execute query. '. mysqli_error($con));
while($row = mysqli_fetch_array($result2))
	{
		$note= array('id'=>$row['id'],"title"=>$row['title'],"content"=>$row['content'],"time"=>$row['time']);
	}


echo json_encode($note);
  
mysqli_close($con);
	
?>