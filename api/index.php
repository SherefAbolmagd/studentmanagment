<?php
	require 'Slim/Slim.php';

	//JSON Web Token
	require_once './vendor/autoload.php';
	use \Firebase\JWT\JWT;

	$key = "example_key";

	class User
	{
    	var $login;
    	var $password;
    	var $usertype;
    	var $name;
	}

	class Book
	{
    	var $isbn;
    	var $title;
   	 	var $author;
   	 	var $publisher;
   	 	var $publishdate;
   	 	var $price;
	}

	function getConnection() {
    	$dbhost="127.0.0.1";
    	$dbuser="root";
    	$dbpass="";
    	$dbname="frontend";
    	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    	return $dbh;
	}

	function doAuth() {
		$request = \Slim\Slim::getInstance()->request();
		$user = json_decode($request->getBody());
		$sql = "SELECT *
			    FROM user
			    WHERE login = :login
			    AND password = :password";

		try
		{
	       	$db = getConnection();

			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("login", $user->login);
			$stmt->bindParam("password", $user->password);
	        $stmt->execute();

	    	$row_count = $stmt->rowCount();
	    	if ($row_count)
	    	{
	        	while($row = $stmt->fetch(PDO::FETCH_ASSOC))
	        	{
	           		//create user object
	            	//put user data in Model (User Object)
	            	$user = new User();
	            	$user->login = $row['login'];
					$user->usertype = $row['usertype'];
					$user->name = $row['name'];

			  		$db = null;

			  		//create JWT token
			  		$date = date_create();
					$jwtIAT = date_timestamp_get($date);
					$jwtExp = $jwtIAT + (20 * 60); //expire after 20 minutes

					$name = $user->name;
					$jwtToken = array(
    					"iss" => "rbk.net", //client key
    					"iat" => $jwtIAT, //issued at time
    					"exp" => $jwtExp, //expire
    					"name" => $name,
    					"admin" => true
					);
					$token = JWT::encode($jwtToken, $GLOBALS['key']);

					$tokenDecoded = JWT::decode($token, $GLOBALS['key'], array('HS256'));
					$file = 'jwt_token.txt';
        			file_put_contents($file, $tokenDecoded->name);


					//user info
	        		$login = $user->login;
	        		$usertype = $user->usertype;
	        		$name = $user->name;

					$arr = array("loginStatus" => "success", "token" => "$token", "login" => "$login", "name" => "$name", "usertype" => "$usertype");
	        		echo json_encode($arr);
	    		}
	    	}
	    	else
	    	{
	        	$db = null;
				$arr = array("loginStatus" => "failed");
	  			echo json_encode($arr);
	    	}
	    }
		catch(PDOException $e)
		{
	       	$file = 'error.txt';
	       	file_put_contents($file, $e->getMessage());
	    }
	}

	function getBooks()
	{
		$request = \Slim\Slim::getInstance()->request();
    	$headers = $request->headers;
    	$authToken = $headers->get('AUTH-TOKEN');

    	//verify token
    	try
    	{
    		$tokenDecoded = JWT::decode($authToken, $GLOBALS['key'], array('HS256'));

			$sql = "SELECT *
					FROM books
				    ORDER BY title";

			try
			{
	        	$db = getConnection();

				//no need to prepare, cause no data from users
	        	$stmt = $db->query($sql);
	        	$stmt->execute();
	    		$row_count = $stmt->rowCount();

	    		if ($row_count)
	    		{
	        		$data = array();

	        		while($row = $stmt->fetch(PDO::FETCH_ASSOC))
	        		{
	            		//create books object
	            		//put books data in Model (Books Object)
	            		$book = new Book();
	            		$book->isbn = $row['isbn'];
						$book->title = $row['title'];
						$book->author = $row['author'];
						$book->publisher = $row['publisher'];
						$book->publishdate = $row['publishdate'];
						$book->price = $row['price'];

	            		array_push($data, $book);
	        		}

			  		$db = null;
	        		echo json_encode($data);
	    		}
	    		else
	    		{
	        		$db = null;
					$data = array();
	        		echo json_encode($data);
	    		}
	    	}
			catch(PDOException $e)
			{
	        	echo '{"error":{"text":'. $e->getMessage() .'}}';
	    	}
		}
		catch(Exception $e)
		{
			$arr = array("error" => $e->getMessage());
			echo json_encode($arr);
		}
	}

	function addBook() {
		$request = \Slim\Slim::getInstance()->request();
		$headers = $request->headers;
    	$authToken = $headers->get('AUTH-TOKEN');

    	$file = 'debug.txt';
	    file_put_contents($file, '1');

    	try
    	{
    		file_put_contents($file, '2');
    		$tokenDecoded = JWT::decode($authToken, $GLOBALS['key'], array('HS256'));
    		file_put_contents($file, '3');

			$book = json_decode($request->getBody());
			$sql = "INSERT INTO books (isbn, title, author, publisher, publishdate, price)
			        VALUES (:isbn, :title, :author, :publisher, :publishdate, :price)";

			try
			{
				file_put_contents($file, '4');
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("isbn", $book->isbn);
				$stmt->bindParam("title", $book->title);
				$stmt->bindParam("author", $book->author);
				$stmt->bindParam("publisher", $book->publisher);
				$stmt->bindParam("publishdate", $book->publishdate);
				$stmt->bindParam("price", $book->price);
				$stmt->execute();
				$db = null;

				$data = Array(
					"insertStatus" => "success",
					"isbn" => $book->isbn,
					"title" => $book->title,
					"author" => $book->author,
					"publisher" => $book->publisher,
					"publishdate" => $book->publishdate,
					"price" => $book->price
				);

				echo json_encode($data);
			}
			catch(PDOException $e)
			{
				file_put_contents($file, '5');
				$errorMessage = $e->getMessage();
				$data = Array(
					"insertStatus" => "failed",
					"errorMessage" => $errorMessage
				);
				echo json_encode($data);
			}
		}
		catch(Exception $e)
		{
			file_put_contents($file, '6');
			$arr = array("error" => $e->getMessage());
			echo json_encode($arr);
		}
	}

	function updateBook($isbn)
	{
		$request = \Slim\Slim::getInstance()->request();
		$headers = $request->headers;
    	$authToken = $headers->get('AUTH-TOKEN');

    	//debug
    	$file = 'debugupdate.txt';
	    file_put_contents($file, '1');

    	try
    	{
    		file_put_contents($file, '2');
    		$tokenDecoded = JWT::decode($authToken, $GLOBALS['key'], array('HS256'));
    		file_put_contents($file, '3');

			//////////////////////////////////////////////////////////////////
			$body = $request->getBody();
			$book = json_decode($body);
			$sql = "UPDATE books
					SET title = :title,
					    author = :author,
					    publisher = :publisher,
					    publishdate = :publishdate,
					    price = :price
					WHERE isbn = :isbn";

			try
			{
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam("title", $book->title);
				$stmt->bindParam("author", $book->author);
				$stmt->bindParam("publisher", $book->publisher);
				$stmt->bindParam("publishdate", $book->publishdate);
				$stmt->bindParam("price", $book->price);
				$stmt->bindParam("isbn", $isbn);
				$stmt->execute();
				$db = null;

				$data = Array(
					"updateStatus" => "success",
					"isbn" => $book->isbn,
					"title" => $book->title,
					"author" => $book->author,
					"publisher" => $book->publisher,
					"publishdate" => $book->publishdate,
					"price" => $book->price
				);

				echo json_encode($data);
			}
			catch(PDOException $e)
			{
				$errorMessage = $e->getMessage();
				$data = Array(
					"updateStatus" => "failed",
					"errorMessage" => $errorMessage
				);
				echo json_encode($data);
			}
			//////////////////////////////////////////////////////////////////

		}
		catch(Exception $e)
		{
			file_put_contents($file, '4');
			$arr = array("error" => $e->getMessage());
			file_put_contents($file, json_encode($arr));
			echo json_encode($arr);
		}
	}

	function updateAuthor($isbn)
	{

		$request = \Slim\Slim::getInstance()->request();
		$body = $request->getBody();
		$book = json_decode($body);

		$sql = "UPDATE books
				SET author = :author
				WHERE isbn = :isbn";

		$file = 'debug.txt';
        file_put_contents($file, "1");

		try
		{
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("author", $book->author);
			$stmt->bindParam("isbn", $isbn);
			$stmt->execute();
			$db = null;

			$data = Array(
				"updateStatus" => "success",
				"author" => $book->author
			);

			echo json_encode($data);

			$file = 'debug.txt';
        	file_put_contents($file, "2");
		}
		catch(PDOException $e)
		{
			$errorMessage = $e->getMessage();
			$data = Array(
				"updateStatus" => "failed",
				"errorMessage" => $errorMessage
			);
			echo json_encode($data);

			$file = 'debug.txt';
        	file_put_contents($file, $errorMessage);
		}
	}

	function deleteBook($isbn)
	{
		$sql = "DELETE
				FROM books
				WHERE isbn = :isbn";

		try
		{
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("isbn", $isbn);
			$stmt->execute();
			$db = null;

			echo json_encode(array("deleteStatus" => "success"));
		}
		catch(PDOException $e)
		{
			$error = $e->getMessage();
			echo json_encode(array("deleteStatus" => "failed", "error" => $error));
		}
	}

	function findByName($query)
	{
		$sql = "SELECT *
				FROM student
				WHERE name LIKE :query
				ORDER BY name";

		try
		{
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$query = "%".$query."%";
			$stmt->bindParam("query", $query);
			$stmt->execute();

			$row_count = $stmt->rowCount();

    		if ( count($row_count) )
    		{
        		$data = array();

        		while($row = $stmt->fetch(PDO::FETCH_ASSOC))
        		{
            		//create Student object
            		//put std data in Model (Student Object)
            		$std = new Student();
            		$std->matriks = $row['matriks'];
					$std->name = $row['name'];
					$std->age = $row['age'];

            		array_push($data, $std);
        		}

		  		$db = null;
        		echo json_encode($data);
    		}
    		else
    		{
        		$db = null;
				$data = array();
        		echo json_encode($data);
    		}
		}
		catch(PDOException $e)
		{
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}

	function getStudentByMatriks($matriks)
	{
		$sql = "SELECT *
				FROM student WHERE matriks = :matriks";
		try
		{
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("matriks", $matriks);
			$stmt->execute();

			$row_count = $stmt->rowCount();

    		if ( $row_count == 1 )
        		echo json_encode(array("matriksExist" => "true"));
    		else if ( $row_count == 0 )
        		echo json_encode(array("matriksExist" => "false"));
		}
		catch(PDOException $e)
		{
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}



	\Slim\Slim::registerAutoloader();

	$app = new \Slim\Slim();

	$app->get('/', function () {
    	echo "Welcome to PHP SLIM REST Framework";
	});

	$app->get('/hello/:name', function ($name) {
    	echo "Hello, $name";
	});

	$app->post('/auth', 'doAuth'); //authentication and token generation
	$app->get('/books', 'getBooks'); //select all book
	$app->post('/books', 'addBook'); //insert book
	$app->put('/books/:isbn', 'updateBook'); //update whole book via isbn
	$app->put('/books/updateauthor/:isbn', 'updateAuthor'); //update book author via id
	$app->delete('/books/:isbn',	'deleteBook'); //delete book via isbn

	$app->run();
?>