<?php
// 	 require_once('recaptchalib.php');
	$id = $_GET['id'];
	// Notes: 
	//		HTML escape char: htmlspecialchars()

	// Include db.php for db connection setup
	require "db.php";
	require_once 'ApnsPHP/Autoload.php';

	$task = $_GET["task"];
	
	switch($task)
	{
	
	case "registerdevice":
	{
	if($stmt = $mysqli->prepare("INSERT INTO device VALUES(default, ?, ?, ?);"))
			{
				// Bind all values
				$stmt->bind_param('sss', $_GET['id'], $_GET['type'], $_POST['code']);
				// Insert
				$stmt->execute();
				//$stmt->store_result();
				// Make sure we inserted a row successfully
				if($stmt->affected_rows == 0)
				{
					$stmt->close();
					echo 1;
					return;
				}
				// Store our new ID
				echo 0;
				// Close
				$stmt->close();
				}
	break;
	}
		case "reg":
		{		
			// TODO: Check for all values via isset()
			
		
 //  $privatekey = "6LcXn-0SAAAAAMzU1t0aQ-_tnI2jrnBIO1FJiK0G";
//   $resp = recaptcha_check_answer ($privatekey,
//                                 $_SERVER["REMOTE_ADDR"],
//                                 $_POST["recaptcha_challenge_field"],
//                                 $_POST["recaptcha_response_field"]);
// 
//   if (!$resp->is_valid) {
//     // What happens when the CAPTCHA was entered incorrectly
//     echo 5;
//          break;
//   } 
			
			// Check for unique email, error 2 on fail
			if($stmt = $mysqli->prepare("SELECT email FROM user WHERE email =?;"))
			{
				$stmt->bind_param('s', $_POST['email']);
				if($stmt->execute())
				{
					$stmt->store_result();
					// Any results?
					if($stmt->num_rows > 0)
					{
						echo 2;
						break;
					}
				}
				// Close
				$stmt->close();				
			}
			
			// Check for unique sm_id, error 3 on fail
			if($stmt = $mysqli->prepare("SELECT sm_id FROM user WHERE sm_id =?;"))
			{
				$stmt->bind_param('s', $_POST['sm_id']);
				if($stmt->execute())
				{
					$stmt->store_result();
					// Any results?
					if($stmt->num_rows>0)
					{
						echo 3;
						break;
					}
				}
				// Close
				$stmt->close();				
			}
			
			// Create user, error 1 on fail
			// Combine all for a single date string
			$birthday = $_POST['year'] . "/" . $_POST['month'] . "/" . $_POST['day'];			
			// Prepare the insert
			$id = -1;
			$confirm_code=md5(uniqid(rand())); 
			if($stmt = $mysqli->prepare("INSERT INTO user VALUES(default, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(),'',default,?);"))
			{
				// Bind all values
				$stmt->bind_param('sssssissss', $_POST['name'], $_POST['surname'], $_POST['gender'], $birthday, $_POST['email'], $_POST['phone'], $_POST['web'], $_POST['sm_id'], $_POST['password'], $confirm_code);
				// Insert
				$stmt->execute();
				//$stmt->store_result();
				// Make sure we inserted a row successfully
				if($stmt->affected_rows == 0)
				{
					$stmt->close();
					echo 1;
					return;
				}
				// Store our new ID
				$id = $stmt->insert_id;
				// Close
				$stmt->close();
				}
$to=$_POST['email'];

// Your subject
$subject="Your confirmation link here";

// From
$header="from: Austin Brown <austinbrown@cognishift.com>";

// Your message
$message="Your Comfirmation link \r\n";
$message.="Click on this link to activate your account \r\n";
$message.="http://www.54.186.32.195/confirmation.php?passkey=$confirm_code";

// send email
$sentmail = mail($to,$subject,$message,$header);

if(!$sentmail){
echo "Cannot send Confirmation link to your e-mail address";

}

			
			
			
			
			// Create default values for presence table
			if($stmt = $mysqli->prepare("INSERT INTO presence VALUES(default, ?, 1, 1, 1, 1, 1, 1, 1, 1);"))
			{
				// Bind all values
				$stmt->bind_param('i', $id);
				// Insert
				$stmt->execute();
				// Make sure we inserted a row successfully
				if($stmt->affected_rows == 0)
				{
					$stmt->close();
					echo 1;
					return;
				}
				// Close
				$stmt->close();
			}
			
			
				if($stmt = $mysqli->prepare("INSERT INTO optin VALUES(default, ?, 1, 1, 1, 1);"))
			{
				// Bind all values
				$stmt->bind_param('i', $id);
				// Insert
				$stmt->execute();
				// Make sure we inserted a row successfully
				if($stmt->affected_rows == 0)
				{
					$stmt->close();
					echo 1;
					return;
				}
				// Close
				$stmt->close();
			}
			
			
			
			
			// Create default values for profile table
			if($stmt = $mysqli->prepare('INSERT INTO profile VALUES(default, ?, "None", "images/profile/no_profile_image.jpg", "", default, "", "");'))
			{
				// Bind all values
				$stmt->bind_param('i', $id);
				// Insert
				$stmt->execute();
				// Make sure we inserted a row successfully
				if($stmt->affected_rows == 0)
				{
					$stmt->close();
					echo 1;
					return;
				}
				// Close
				$stmt->close();
			}
			
			// TODO: Create welcome message from SM
			
			// Store ID in PHP Session
			//$_SESSION['user_id']=$id;
			
			// 0 - All is well
			echo 0;
			break;
		}
		case "forgot":
                                     {

                                     if($stmt = $mysqli->prepare("SELECT password FROM user WHERE email =?;"))
                                     			{
                                     				$stmt->bind_param('s', $_GET['email2']);
                                     				if($stmt->execute())
                                     				{
                                     					$stmt->store_result();
                                     					// Any results?
                                     					if($stmt->num_rows > 0)
                                     					{
                                     						$stmt->bind_result($pass);
                                     						$stmt->fetch();
                                     						$stmt->close();
                                     						echo $pass;
                                     						$to=$_GET['email2'];

                                                            // Your subject
                                                            $subject="Reset your password";

                                                            // From
                                                            $header="from: Austin Brown <austinbrown@cognishift.com>";

                                                            // Your message
                                                           //  $message="Your Password \r\n";
// 
//                                                             $message.="$pass";

	$confirm_code2=md5(uniqid(rand())); 
			if($stmt2 = $mysqli->prepare("INSERT INTO forgot VALUES(default, ?, ?);"))
			{
				// Bind all values
				$stmt2->bind_param('ss', $_GET['email2'], $confirm_code2);
				// Insert
				$stmt2->execute();
				//$stmt->store_result();
				$stmt2->store_result();
				// Make sure we inserted a row successfully
				if($stmt2->affected_rows == 0)
				{
					$stmt2->close();
					echo 1;
					return;
				}
				// Store our new ID
				//$id = $stmt->insert_id;
				// Close
				$stmt2->close();
				
echo "success!";
// Your message
$message="Reset your Password \r\n";
$message.="Click on this link reset your account password \r\n";
$message.="http://www.54.186.32.195/reset2.php?passkey=$confirm_code2";


                                                            // send email
                                                            $sentmail = mail($to,$subject,$message,$header);

                                                            if(!$sentmail){
                                                            echo "Cannot send Confirmation link to your e-mail address";

                                                            }
                                                            // $stmt->close();
                                                            echo "Password sent to your email.";
                                                            break;
                                                            }
                                     					}
                                     					else{
                                     					echo "We do not have this email address in our system. Please try again.";
                                     					}

                                     				}
                                     				// Close
                                     				// $stmt->close();
                                     			}
                                        break;
                                     }
		case "logoutstatus":
                             {

		              $id = $_POST['id'];

		            $query = 'UPDATE user SET status = ? WHERE id = ?';
                                          if($stmt2 = $mysqli->prepare($query))
                  				{
                  					// Bind all values
                                      $val=0;
                  					$stmt2->bind_param('ii', $val, $id);
                  					// Insert
                  					$stmt2->execute();
                  					// Make sure we inserted a row successfully

                  					// Close
                  					$stmt2->close();
                  					echo 0;
                  				}
                         else{
                          echo 1;
                          break;
                         }
                            break;
                        }
                        
          	case "block":
                             {

		              $id = $_POST['id'];
						
						$pid = $_GET['pid'];
		            $query = 'INSERT INTO blocked VALUES(default, ?, ?, NOW());';
                                          if($stmt2 = $mysqli->prepare($query))
                  				{
                  					// Bind all values
                                      $val=0;
                  					$stmt2->bind_param('ii', $id, $pid);
                  					// Insert
                  					$stmt2->execute();
                  					// Make sure we inserted a row successfully

                  					// Close
                  					$stmt2->close();
                  					echo 0;
                  				}
                         else{
                          echo 1;
                          break;
                         }
                            break;
                        }

		
		case "unblock":
                             {

		              $id = $_POST['id'];
						
						$pid = $_GET['pid'];
		            $query = 'DELETE FROM blocked WHERE blocker_profile_id = ? AND blocked_profile_id = ?;';
                                          if($stmt2 = $mysqli->prepare($query))
                  				{
                  					// Bind all values
                                      $val=0;
                  					$stmt2->bind_param('ii', $id, $pid);
                  					// Insert
                  					$stmt2->execute();
                  					// Make sure we inserted a row successfully

                  					// Close
                  					$stmt2->close();
                  					echo 0;
                  				}
                         else{
                          echo 1;
                          break;
                         }
                            break;
                        }
		
		
		case "log":
		{
			// Check for unique email, error 2 on fail
			if($stmt = $mysqli->prepare("SELECT id, active FROM user WHERE email =? AND password =?;"))
			{
				$stmt->bind_param('ss', $_GET['email'], $_GET['password']);
				if($stmt->execute())
				{
					$stmt->store_result();
					// Any results?
					if($stmt->num_rows > 0)
					{
					$id = 0;
					$password = $_GET['password'];
					$stmt->bind_result($id, $active);
					
					$stmt->fetch();
					if ($stmt3 = $mysqli->prepare("SELECT * FROM deleted WHERE userid = ?;")){
			
				$stmt3->bind_param('i', $id);
				$stmt3->execute();
				
					$stmt3->store_result();
					
					// Any results?
					if($stmt3->num_rows > 0)
					{
					
					echo "DELETED";
					$stmt3->close();
					break;
					}
					else{
					$stmt3->close();
					
					}
					
					
					}
					
					
						// $id = 0;
// 						$password = $_GET['password'];
						// $stmt->bind_result($id, $active);
// 						$stmt->fetch();
						// Store ID in PHP Session
						//$_SESSION['user_id']=$id;
						// 0 - All is well
					
						if($active!=0){
						
						echo $id."|".$password;
                        $query = 'UPDATE user SET status = ? WHERE id = ?';
                        if($stmt2 = $mysqli->prepare($query))
				{
					// Bind all values
                    $val=1;
					$stmt2->bind_param('ii', $val, $id);
					// Insert
					$stmt2->execute();
					// Make sure we inserted a row successfully
					
					// Close
					$stmt2->close();
				}
				
                    }
                 
					else{
						echo "NOTHING";
						
						}
						
				
				}
				else{
				echo "NOTHING";
				
				}
				   }
			}
			
			
			break;			
	
		
		}
		
			case "logout":
		{
			// Check for unique email, error 2 on fail
			if($stmt = $mysqli->prepare("UPDATE user SET active = ? WHERE id =?;"))
			{
			$active=0;
				$stmt->bind_param('ss', $active, $id);
				
					$stmt->execute();
					// Make sure we inserted a row successfully
					
					// Close
					$stmt->close();
				}
				
                  
				   
			
			break;			
		}
		
		case "trashmsg":
		{
		if(isset($_GET['mid']))
		$id = $_POST['id'];
			{			
				if($stmt = $mysqli->prepare("INSERT INTO mtrash VALUES(default, ?, ?, NOW());"))
				{
					$stmt->bind_param('ii', $id ,$_GET['mid']);
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						break;
					}
					// Close
					$stmt->close();
					echo 0;
					break;
				}
				
				
			}
		
			break;
		}
		
		case "delmsg":
		{
		
		if(isset($_GET['msg']))
			{			
				if($stmt = $mysqli->prepare("INSERT INTO trash VALUES(default, ?, ?, NOW());"))
				{
					$stmt->bind_param('ii', $id ,$_GET['msg']);
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						break;
					}
					// Close
					$stmt->close();
					echo 0;
					break;
				}
				
				
			}
		
			break;
		}
	// 	case "getview":{
// 		
// 		if($stmt = $mysqli->prepare("SELECT COUNT(1) FROM view WHERE view_profile_id = ?;"))
// 	{		
// 		$stmt->bind_param('i', $_GET['id']);
// 		$stmt->execute();
// 		$stmt->bind_result($views);
// 		$stmt->fetch();
// 		$stmt->close();
// 		echo $views;
// 	}
// 	break;
// 		}
// 		case "addview":{
// 		if($stmt = $mysqli->prepare("INSERT INTO view VALUES(default, ?, ?, NOW());"))
// 	{		
// 		$stmt->bind_param('ii', $id, $pid);
// 		$stmt->execute();
// 		$stmt->close();
// 	}
// 	break;
// 		}
		case "update_presence":
		{
			if(isset($_POST['field']) && isset($_POST['val']) && isset($_GET['id']))
			{
				$field =  $_POST['field'];
				$val =  $_POST['val'];
				$id = $_GET['id'];
				
				if($field == 'user')
					$query = 'UPDATE presence SET user_searchability = ? WHERE user_id = ?;';
				elseif($field == 'motive')
					$query = 'UPDATE presence SET motive_viewability = ? WHERE user_id = ?;';
				elseif($field == 'map')
					$query = 'UPDATE presence SET map_viewability = ? WHERE user_id = ?;';
				elseif($field == 'res')
					$query = 'UPDATE presence SET residence = ? WHERE user_id = ?;';
				elseif($field == 'rel')
					$query = 'UPDATE presence SET relationship = ? WHERE user_id = ?;';
				elseif($field == 'occ')
					$query = 'UPDATE presence SET occupation = ? WHERE user_id = ?;';
				elseif($field == 'til')
					$query = 'UPDATE presence SET things_i_like = ? WHERE user_id = ?;';
				elseif($field == 'gen')
                	$query = 'UPDATE presence SET gender = ? WHERE user_id = ?;';
				else
				{
					echo -1;
					return;
				}
				
				// Create default values for profile table
				if($stmt = $mysqli->prepare($query))
				{
					// Bind all values
					$stmt->bind_param('ii', $val, $id);
					// Insert
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						return;
					}
					// Close
					$stmt->close();
				}
			}
			else
				echo -1;
				
			break;
		}
			case "update_optin":
		{
			if(isset($_POST['field']) && isset($_POST['val']) && isset($_GET['id']))
			{
				$field =  $_POST['field'];
				$val =  $_POST['val'];
				$id = $_GET['id'];
				
				if($field == 'updateemails')
					$query = 'UPDATE optin SET updateemails = ? WHERE userid = ?;';
				elseif($field == 'marketingemails')
					$query = 'UPDATE optin SET marketingemails = ? WHERE userid = ?;';
				elseif($field == 'emailpush')
					$query = 'UPDATE optin SET emailpush = ? WHERE userid = ?;';
				elseif($field == 'pushnotifications')
					$query = 'UPDATE optin SET pushnotifications = ? WHERE userid = ?;';
				
				else
				{
					echo -1;
					return;
				}
				
				// Create default values for profile table
				if($stmt = $mysqli->prepare($query))
				{
					// Bind all values
					$stmt->bind_param('ii', $val, $id);
					// Insert
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						return;
					}
					// Close
					$stmt->close();
				}
			}
			else
				echo -1;
				
			break;
		}
		case "update_profile":
		{
			if(isset($_POST['field']) && isset($_POST['val'])  )
			{
				$field =  $_POST['field'];
				$val =  $_POST['val'];
				//$id = $_SESSION['user_id'];
				
				if($field == 'motive')
					$query = 'UPDATE profile SET motive = ? WHERE user_id = ?;';
				elseif($field == 'res')
					$query = 'UPDATE profile SET residence = ? WHERE user_id = ?;';
				elseif($field == 'rel')
					$query = 'UPDATE profile SET relationship = ? WHERE user_id = ?;';
				elseif($field == 'occ')
					$query = 'UPDATE profile SET occupation = ? WHERE user_id = ?;';
				elseif($field == 'til')
					$query = 'UPDATE profile SET things_i_like = ? WHERE user_id = ?;';
				elseif($field == 'gen') {
				    if($val=='1'){
				    $val = "Male";
				    }
				    if($val=='2'){
				     $val = "Female";
				    }
                	$query = 'UPDATE user SET gender = ? WHERE id = ?;';
                	}
				else
				{
					echo -1;
					return;
				}
			
				// Create default values for profile table
				if($stmt = $mysqli->prepare($query))
				{
					// Bind all values
					$stmt->bind_param('si', $val, $id);
					// Insert
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						// fail, close and return error
						$stmt->close();
						echo -1;
						return;
					}
					// Close
					$stmt->close();
				}
			}
			else
				echo -1;
				
			break;		
		}
		case "updateLocation":
		{
			if(isset($_POST['lat']) && isset($_POST['lon']) && isset($id))
			{
				$lat =  $_POST['lat'];
				$lon =  $_POST['lon'];
				//$id = $_SESSION['user_id'];
						
				// Create default values for profile table
				if($stmt = $mysqli->prepare('UPDATE profile SET latitude = ?, longitude = ? WHERE user_id = ?;'))
				{
					// Bind all values
					$stmt->bind_param('ddi', $lat, $lon, $id);
					// Insert
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						// fail, close and return error
						$stmt->close();
						echo -1;
						return;
					}
					// Close
					$stmt->close();
				}
			}
			else
				echo -2;
				
			break;		
		}
		case "update_user":
		{
			if(isset($_POST['field']) && isset($_POST['val']) && isset($id))
			{
				$field =  $_POST['field'];
				$val =  $_POST['val'];
				//$id = $_SESSION['user_id'];
				$query = "";
				if($field == 'sm_id')
				{
					// First check if that sm_id already exists
					if($stmt = $mysqli->prepare('SELECT id FROM user WHERE sm_id = ?;'))
					{
						$stmt->bind_param('s', $val);
						if($stmt->execute())
						{
							$stmt->store_result();
							// Any results?
							if($stmt->num_rows>0)
							{
								// Is it our own id? If so ignore
								$checkid = 0;
								$stmt->bind_result($checkid);
								$stmt->fetch();
								if($checkid == $id)
									echo 0;
								else
									echo 1;
								return;
								break;
							}
						}
						// Close
						$stmt->close();				
						$query = 'UPDATE user SET sm_id = ? WHERE id = ?;';
					}
					else
					{
						echo -1;
						break;
					}
					
				}
				elseif($field == 'password')
					$query = 'UPDATE user SET password = ? WHERE id = ?;';
				else
				{
					echo -1;
					return;
				}
			
				// Create default values for profile table
				if($stmt = $mysqli->prepare($query))
				{
					// Bind all values
					$stmt->bind_param('si', $val, $id);
					// Insert
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 0;
						return;
					}
					echo 0;
					// Close
					$stmt->close();
				}
				else
				{
					echo -1;
					return;
				}
			}
			else
				echo -1;
				
			break;			
		}
		case "send_msg":
		{
			if(isset($_POST['to']) && isset($_POST['from']) && isset($_POST['subject']) && isset($_POST['msg']))
			{			
				if($stmt = $mysqli->prepare("INSERT INTO message VALUES(default, ?, ?, ?, ?, NOW(), 1);"))
				{
					// Bind all values
					$stmt->bind_param('ssss', $_POST['to'], $_POST['from'], $_POST['subject'],$_POST['msg']);
					// Insert
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						return;
					}
					
					
					if($stmt3 = $mysqli->prepare("SELECT sm_id FROM user WHERE id = ?;"))
				{
					// Bind all values
					$stmt3->bind_param('s', $_POST['from']);
					// Insert
					$stmt3->execute();
					// Make sure we inserted a row successfully
					$stmt3->store_result();
					$stmt3->bind_result($smid);
					
					$stmt3->fetch();	
					}
					// Close
						if($stmt2 = $mysqli->prepare("SELECT type,code FROM device WHERE userid=? ORDER BY id DESC LIMIT 1;"))
			{
				$stmt2->bind_param('s', $_POST['to']);
				if($stmt2->execute())
				{
					$stmt2->store_result();
					// Any results?
					if($stmt2->num_rows > 0)
					{
					
					$stmt2->bind_result($type, $code);
					
					$stmt2->fetch();
				
					
					
						// $id = 0;
// 						$password = $_GET['password'];
						// $stmt->bind_result($id, $active);
// 						$stmt->fetch();
						// Store ID in PHP Session
						//$_SESSION['user_id']=$id;
						// 0 - All is well
					
						if($type == "apns"){

$push = new ApnsPHP_Push(
	ApnsPHP_Abstract::ENVIRONMENT_PRODUCTION,
	'serverpro.pem'
);


 $push->setRootCertificationAuthority('safe.cer');


$push->connect();


$message = new ApnsPHP_Message($code);


$message->setCustomIdentifier("Message-Badge-3");

$message->setBadge(1);

$text = $smid." - ".$_POST['msg'];
$message->setText($text);


$message->setSound();

$message->setCustomProperty('acme2', array('bang', 'whiz'));

// Set another custom property
$message->setCustomProperty('acme3', array('bing', 'bong'));

// Set the expiry value to 30 seconds
// $message->setExpiry(30);

// Add the message to the message queue
$push->add($message);

// Send all messages in the message queue
$push->send();

// Disconnect from the Apple Push Notification Service
$push->disconnect();

 }
                    if($type == "gcm"){
						$apiKey = "AIzaSyCaeGTWwH1RHElbTzUopJ5FADCbYMhtpsA";

// Replace with real client registration IDs 
$registrationIDs = array( $code );

// Message to be sent
$message = $_POST['msg'];

// Set POST variables
$url = 'https://android.googleapis.com/gcm/send';
$text = $smid;
$fields = array(
                'registration_ids'  => $registrationIDs,
                'data'              => array( "message" => $message,
                								"title" => $text ),
                );

$headers = array( 
                    'Authorization: key=' . $apiKey,
                    'Content-Type: application/json'
                );

// Open connection
$ch = curl_init();

// Set the url, number of POST vars, POST data
curl_setopt( $ch, CURLOPT_URL, $url );

curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );

// Execute post
$result = curl_exec($ch);

// Close connection
curl_close($ch);

// echo $result;
					
				
                    }
                 
					$stmt3->close();
						$stmt2->close();
				
				}
				
				   }
			}
					// Close
					$stmt->close();
					echo 0;
					return;
				}
				
			}
			break;
		}
		case "setview":
		{
		if($stmt = $mysqli->prepare("INSERT INTO view VALUES(default, ?, ?, NOW())"))
		{
		 $stmt->bind_param('ii',$id,$_POST['val']);
		  $stmt->execute();
		  $stmt->close();
		}
		break;
		}
		case "add_friend":
		{
			// TODO: Send msg to confirm friend?

			if(isset($_POST['val']) && isset($id))
			{			
				if($stmt = $mysqli->prepare("UPDATE friend SET status = 'friends' WHERE user_id=? AND friend_user_id = ?;"))
				{
				  $stmt->bind_param('ii',$_POST['val'],$id);
				  $stmt->execute();
				if($stmt->affected_rows == 0)
					{
				
				$stmt->close();
				if($stmt = $mysqli->prepare("INSERT INTO friend VALUES(default, ?, ?, NOW(), 'Pending');"))
				{
					$stmt->bind_param('ii', $id, $_POST['val']);
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						break;
					}
					// Close
					$stmt->close();
					echo 0;
					break;
				}				
			
			}
			else{
			$stmt->close();
			echo 3;
			break;
			}
			}
			break;
		}
		}
		 	case "delete":
                             {

		              $id = $_POST['id'];
						
					
		            $query = 'INSERT INTO deleted VALUES(default, ?, NOW());';
                                          if($stmt2 = $mysqli->prepare($query))
                  				{
                  					// Bind all values
                                      $val=0;
                  					$stmt2->bind_param('i', $id);
                  					// Insert
                  					$stmt2->execute();
                  					// Make sure we inserted a row successfully

                  					// Close
                  					
                  					
                  					  $query2 = 'UPDATE presence SET user_searchability = ?, motive_viewability = ?, map_viewability = ?, residence = ?, relationship = ?, occupation = ?, things_i_like = ?, gender = ? WHERE user_id =?;';
                                          if($stmt3 = $mysqli->prepare($query2))
                  				{
                  					// Bind all values
                                      $val2=4;
                  					$stmt3->bind_param('iiiiiiiii', $val2,$val2,$val2,$val2,$val2,$val2,$val2,$val2,$id);
                  					// Insert
                  					$stmt3->execute();
                  					// Make sure we inserted a row successfully

                  					// Close
                  					$stmt3->close();
                  					$stmt2->close();
                  					echo 0;
                  				}
                  				else{
                   				$stmt3->close();
                  					$stmt2->close();
                  					}
                  				}
                         else{
                          echo 1;
                          break;
                         }
                  					
                            break;
                        }
		case "del_friend":
		{
			if(isset($_POST['val']) && isset($id))
			{			
				if($stmt = $mysqli->prepare("DELETE FROM friend WHERE (user_id = ? AND friend_user_id = ?) OR (user_id = ? AND friend_user_id = ?);"))
				{
					$stmt->bind_param('iiii', $_POST['val'],$id,$id,$_POST['val']);
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						break;
					}
					// Close
					$stmt->close();
					echo 0;
					break;
				}
				
			}
		
			break;
		}
		case "profile_picture":
		{
			if(isset($_FILES["file"]) && isset($_POST['secretive']))
			{
				$id = $_POST['secretive'];
				if($_FILES["file"]["error"] > 0)
				{
					echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
				}
				else
				{
					//$id = $_SESSION['user_id'];
				
					$newfile = "images/profile/profile_" . $id . "_" . $_FILES["file"]["name"];
					move_uploaded_file($_FILES["file"]["tmp_name"],$newfile);
					// 	$img = imagecreatefromjpeg($newfile);
// header("Content-Type: image/jpeg");
// imagejpeg($img, $newfile, 100);
					// Update profile with new location
					$query = 'UPDATE profile SET picture = ? WHERE user_id = ?;';

					// Create default values for profile table
					if($stmt = $mysqli->prepare($query))
					{
						// Bind all values
						$stmt->bind_param('si', $newfile, $id);
						// Insert
						$stmt->execute();
						// Make sure we inserted a row successfully
						if($stmt->affected_rows == 0)
						{
							$stmt->close();
							echo '<img src="images/profile/profile_' . $id . '_' . $_FILES["file"]["name"].'">';
							return;
						}
						// Close
						$stmt->close();
						echo '<img src="http://54.186.32.195/images/profile/profile_' . $id . '_' . $_FILES["file"]["name"].'">';
					}
					else
						echo -2;
				}
			}
			else
				echo -3;
			break;
		}
		case "place_checkin":
		{
			if(isset($_POST['name']) && isset($_POST['lat']) && isset($_POST['lon']) && isset($_POST['id']))
			{	
			$coordies = $_POST['lat'] +","+ $_POST['lon'];		
				if($stmt = $mysqli->prepare("INSERT INTO place VALUES(default, ?, 'IN', ?, ?, 1, NOW());"))
				{
					$stmt->bind_param('isd', $_POST['id'], $_POST['name'], $coordies);
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						break;
					}
					// Close
					$stmt->close();
					echo 0;
					break;
				}				
			}
			break;
		}
		case "place_del":
		{
			if(isset($_POST['val']) && isset($id))
			{			
				if($stmt = $mysqli->prepare("DELETE FROM place WHERE user_id = ? AND id = ?;"))
				{
					$stmt->bind_param('ii', $id, $_POST['val']);
					$stmt->execute();
					// Make sure we inserted a row successfully
					if($stmt->affected_rows == 0)
					{
						$stmt->close();
						echo 1;
						break;
					}
					// Close
					$stmt->close();
					echo 0;
					break;
				}
				else
				{
					echo 2;
					break;
				}
			}
			echo 3;
			break;	
				}
		default:
		{
			echo -1;
			break;
		}
	};
?>