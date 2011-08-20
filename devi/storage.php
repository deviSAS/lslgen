<?php
	require_once('config.php');
	
	$acc = $_POST['action'];
	if($acc == 'store') {
	
		$html    = $_POST['html'];
		$creator = $_POST['creator'];
		$title   = $_POST['title'];
		$desc    = $_POST['desc'];
		
		if( empty($html) || empty($creator) || empty($title) || empty($desc) ) {
			die('ERROR: All fields are needed.');
		}
		
		$mysql = mysql_connect(DB,USER,PASS);
		mysql_select_db(TABLE, $mysql) or die("ERROR: Problem while connecting to db");
		
		$code = sha1(md5($title).'+'.time());
		
		$re = mysql_query("INSERT INTO `scripts` (`code`, `title`, `creator`, `html`, `desc`) VALUES ('$code', '$title', '$creator', '$html', '$desc')") or die('ERROR: Unable to store');
		
		mysql_close($mysql);
		die($code);
			
	} else if($acc  == 'load') {
		$code = $_POST['code'];
		
		$mysql = mysql_connect(DB,USER,PASS);
		mysql_select_db(TABLE, $mysql) or die("ERROR: Problem while connecting to db");
		
		$req = mysql_query("SELECT * FROM `scripts` WHERE `code`='$code'") or die('ERROR: Problem while performing load request.');
		if(!$req) die('ERROR: Wrong code.');
		$row = mysql_fetch_array($req);
		if(empty($row["html"])) die('ERROR: Empty code, contact the admin.');
		mysql_close($mysql);
		die($row["html"]);		
	}
	
	die('ERROR: Action not defined');
	
?>