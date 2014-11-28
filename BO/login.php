<?php
$winSleep = 500000; //délai volontaire de reponse en cas de success = 0,5s
$failSleep = 3000000; //delai volontaire de reponse en cas d'echec = 3s
$salt = 'AddThisFreackingSalt';
$users = array(
    '****NOPE****' => '****NOPE****'//salt.'test123'.salt
);

function sec_session_start(){
    $session_name = 'sec_session_id';   // Set a custom session name
    $secure = true;
    // This stops JavaScript being able to access the session id.
    $httponly = true;
    // Forces sessions to only use cookies.
    ini_set('session.use_only_cookies', 1);
    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"],
        $cookieParams["path"], 
        $cookieParams["domain"], 
        $secure,
        $httponly);
    // Sets the session name to the one set above.
    session_name($session_name);
    session_start();            // Start the PHP session 
    session_regenerate_id();    // regenerated the session, delete the old one. 
}

function login($username, $password){
    // Using prepared statements means that SQL injection is not possible. 
    if (isset($users[$username])) {
        $db_password = $users[$username];
        // hash the password with the unique salt.
        $password = hash('sha512', $salt . $password . $salt);
        
        //TODO une verification contre le brute force
        
        if ($db_password == $password) {
            // Password is correct!
            // Get the user-agent string of the user.
            $user_browser = $_SERVER['HTTP_USER_AGENT'];
            // XSS protection as we might print this value
            $user_id = preg_replace("/[^0-9]+/", "", $user_id);
            $_SESSION['user_id'] = $user_id;
            // XSS protection as we might print this value
            $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);
            $_SESSION['username'] = $username;
            $_SESSION['login_string'] = hash('sha512', $password . $user_browser);
            // Login successful.
            return true;
        } else {
            // Password is not correct
            // We record this attempt in the database
            $now = time();
            //$mysqli->query("INSERT INTO login_attempts(user_id, time) VALUES ('$user_id', '$now')");
            usleep($failSleep);
            return false;
        }
        
        
    }
    else{
        //ralentir les attaques brute force sur le username
        usleep($failSleep);
        return false;
    }
}

function login_check() {
    // Check if all session variables are set 
    if (isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['login_string'])) {
 
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $username = $_SESSION['username'];
        
        $login_check = hash('sha512', $salt . $password . $salt . $user_browser);
        
        if ($login_check == $login_string) {
            // Logged In!!!! 
            return true;
        } else {
            // Not logged in 
            return false;
        }
    } else {
        // Not logged in 
        return false;
    }
}

?>