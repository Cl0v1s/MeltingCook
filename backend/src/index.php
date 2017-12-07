<?php

include_once 'Core/Engine.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 22/01/17
 * Time: 16:12
 */

Engine::$DEBUG = false;
date_default_timezone_set ("Europe/Paris");
Engine::Instance()->Logger()->warning("New connection from ".$_SERVER['REMOTE_ADDR']);

Engine::Instance()->setPersistence(new DatabaseStorage("localhost", "MC", "phpmyadmin", "root"));
Engine::Instance()->run();


