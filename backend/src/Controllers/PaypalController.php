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

        $ipn = new IPN($_POST);
    }
}