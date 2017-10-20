<?php
/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 20/10/17
 * Time: 15:43
 */

class IPN
{
    // Information concernant le service
    public $receiver_email;
    public $receiver_id;
    public $residence_country;
    // Information concernant la transaction
    public $test_ipn;
    public $transaction_subject;
    public $txn_id;
    public $txn_type;
    // Informations sur le client
    public $payer_email;
    public $payer_id;
    public $payer_status;
    public $first_name;
    public $last_name;
    public $address_city;
    public $address_country;
    public $address_state;
    public $address_status;
    public $address_country_code;
    public $address_name;
    public $address_street;
    public $address_zip;
    // Informations sur le payement
    public $custom;
    public $handling_amount;
    public $item_name;
    public $item_number;
    public $mc_currency;
    public $mc_fee;
    public $mc_gross;
    public $payment_date;
    public $payment_fee;
    public $payment_gross;
    public $payment_status;
    public $payment_type;
    public $protection_eligibility;
    public $quantity;
    public $shipping;
    public $tax;
    // Autre
    public $notify_version;
    public $charset;
    public $verify_sign;

    private $raw_data;

    function __construct($data)
    {
        $this->raw_data = $data;

        $properties = get_object_vars($this);
        foreach ($properties as $property => $value)
        {
            if($property == "raw_data")
                continue;
            if(array_key_exists($property, $data))
                $this->$property = $data[$property];
            else
                throw new InvalidArgumentException();
        }

    }

    public function rawData()
    {
        return $this->raw_data;
    }

}



class Paypal
{

    private static $SERVER =  "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr";
    //private static $SERVER =  "https://ipnpb.paypal.com/cgi-bin/webscr";



    /**
     * Gère les phases 1 et 2 du processus de vérification IPN
     */
    public function handleEvent($ipn)
    {
        // Envoi de la réponse 200 à Paypal
        ignore_user_abort(true);
        set_time_limit(0);
        ob_start();
        http_response_code(200);
// do initial processing here
        echo ""; // send the response
        header('Connection: close');
        header('Content-Length: '.ob_get_length());
        ob_end_flush();
        ob_flush();
        flush();
    }

    /**
     * Gère la phase 3 du processus de vérification IPN
     */
    private function returnEvent()
    {

    }

    /**
     * Gère la phase 4 du processus de vérification IPN
     */
    private function finalizeEvent()
    {

    }


}