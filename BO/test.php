<?php

include_once('./login.php');

sec_session_start();

if($_REQUEST['user'] != '' && $_REQUEST['pass'] != ''){
    if(login($_REQUEST['user'],$_REQUEST['pass'])){
        echo 'logged';
    }
    else{
        echo 'fail';
    }
}
else{
    if(login_check()){
        echo "OK";
    }
    else{
        echo 'NO';
    }
}