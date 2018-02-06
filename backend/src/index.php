<?php

include_once 'Core/Engine.php';

$DEBUG = true;
if($DEBUG)
    include_once 'Configuration_debug.php';
else 
    include_once 'Configuration_prod.php';


/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 22/01/17
 * Time: 16:12
 */

date_default_timezone_set ("Europe/Paris");
ErrorLogger::register("http://www.clovis-portron.cf/ErrorManager/src/backoffice/v1.0/ErrorLog", "MeltingCook");
ErrorLogger::$LOGGER->warning("New connection from ".$_SERVER['REMOTE_ADDR']);


Engine::Instance()->setPersistence(new DatabaseStorage(Configuration::$DB_host, Configuration::$DB_database, Configuration::$DB_login, Configuration::$DB_password));
Engine::Instance()->run();


