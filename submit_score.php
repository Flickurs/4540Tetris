<?php

$verify_ajax = true;

//
// AJAX check
//
if ($verify_ajax &&
    (empty($_SERVER['HTTP_X_REQUESTED_WITH']) ||
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest'))
{
    echo json_encode(array(error=>true, html=>""));
    die();
}
session_start();

require_once 'db_config.php';

function echoScores($error)
{
	try
	{
	    $db = new PDO("mysql:host=$server_name;dbname=$db_name;charset=utf8", $db_user_name, $db_password);
	    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

	    $query = "SELECT tname,score FROM high_scores ORDER BY score DESC LIMIT 10;";

	    $statement = $db->prepare( $query );
	    $statement->execute();

	    $rank = 1;
	    $htmlString = "";
	    while ($row = $statement->fetch(PDO::FETCH_ASSOC))
	    	$htmlString .= "
	    					<tr>
								<td>{$rank++}</td>
								<td>" . htmlspecialchars($row['tname']) . "</td>
								<td>{$row['score']}</td>
							</tr>";

	    echo json_encode(array(error=>$error, html=>$htmlString));
	}
	catch (PDOException $ex)
	{
	    echo json_encode(array(error=>true, html=>""));
	}
}

$error = false;

if (isset($_REQUEST['name']) && isset($_REQUEST['score']))
{
	try
	{
	    $db = new PDO("mysql:host=$server_name;dbname=$db_name;charset=utf8", $db_user_name, $db_password);
	    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

	    $query = "INSERT INTO high_scores (tname,score) VALUES (?,?);";
		$statement = $db->prepare( $query );
		$statement->bindParam(1, $_REQUEST['name'], PDO::PARAM_STR);
		$statement->bindParam(2, $_REQUEST['score'], PDO::PARAM_INT);
		$statement->execute();
	}
	catch (PDOException $ex)
	{
	    $error = true;
	}
}

echoScores($error);