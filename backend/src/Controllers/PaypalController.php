<?php
/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 20/10/17
 * Time: 15:43
 */

include_once "Core/Controller.php";
include_once 'Applicative/Paypal.php';

class PaypalController extends Controller
{


    public function run($ctx)
    {
        if(count($_POST) <= 0)
        {
            // Il ne s'agit pas d'une requète POST
            http_response_code(404);
            return;
        }
        try {
            Engine::Instance()->Logger()->warning("Début du traitement d'un nouveau paiment.");            
            ob_start();
            header("HTTP/1.1 200 OK");
            header('Connection: close');
            header('Content-Length: '.ob_get_length());
            ob_end_flush();
            ob_flush();
            flush();
            $ipn = new IPN($_POST);
            Paypal::handleEvent($ipn);
        }
        catch (Exception $e)
        {
            Paypal::handleError($e);
        }
        Engine::Instance()->Logger()->warning("Fin du traitement du paiment.");            
        

    }
}