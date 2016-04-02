<?php

require_once 'db_config.php';

try
{
	global $db;

    $query = "SELECT tname,score FROM high_scores ORDER BY score DESC;";
	$statement = $db->prepare( $query );
	$statement->execute();

	$rank = 1;
    $htmlString = "";
    while ($row = $statement->fetch(PDO::FETCH_ASSOC))
    	$htmlString .= "
    					<tr>
							<td>" . $rank++ . "</td>
							<td>" . htmlspecialchars($row['tname']) . "</td>
							<td>" . $row['score'] . "</td>
						</tr>";
}
catch (PDOException $ex)
{
    $error = true;
}

echo '
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tetris Scoreboard</title>
    <script src="js/jquery-1.11.2.min.js"></script>
	<script src="Bootstrap/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="Bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/global.css">
</head>

<body>
	<div class="background background-image"></div>

	<nav class="navbar navbar-inverse">
		<div class="container-fluid">
			<div class="navbar-header">

				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
      				<span class="sr-only">Toggle navigation</span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
		        </button>

				<a class="navbar-brand" href=".">Tetris</a>
			</div>
			<div aria-expanded="false" id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-info-sign"></span> Info</a>
						<ul class="dropdown-menu">
							<li><a href="../">Home</a></li>
							<li><a href="readme.html">Readme</a></li>
							<li><a href="#">All Scores</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<div class="container">';

if ($error)
{
	echo '
			<h2>There has been an error!</h2>';
}
else
{
	echo '
		<div class="panel panel-primary">
			<div class="panel-heading"><h2 class="text-center">High Scores</h2></div>
			<div class="panel-body">
				<table class="table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>User</th>
							<th>Score</th>
						</tr>
					</thead>
					<tbody id="high_scores">' .
					$htmlString
					. '</tbody>
				</table>
			</div>
		</div>';
}

echo '
	</div>
</body>
</html>';