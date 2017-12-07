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
                throw new InvalidArgumentException("IPN Message was Malformed");
        }

    }

    public function rawData()
    {
        return $this->raw_data;
    }

}

require("PaypalIPN.php");

use PaypalIPN;

class Paypal
{

    // Email du compte paypal de la boutique
    private static $EMAIL = "mc.rachedba@gmail.com";
    // Prix de l'argent allant à MC
    private static $MC_PRICE = 2;

    // Adresse email de l'administrateur
    private static $ManagerEmail = "chaipokoi@gmail.com";


    public static function handleError($e)
    {
        Engine::Instance()->Logger()->error($_POST["payment_date"]."(".$_POST["txn_id"].") ".$_POST["mc_gross"]."€: ".$e->getMessage());
        $body = ""
            . "Bonjour,<br>\r\n"
            . "La transaction ".$_POST["txn_id"]."(".$_POST["payer_email"].") pour un montant de ".$_POST["mc_gross"]." a échouée pour la raison suivante: <br>\r\n"
            . $e->getMessage()
            . "<br>\n" . "<br>\n". "Le ".$_POST["payment_date"];

        mail(PaypalController::$ManagerEmail, "Erreur transaction #".$_POST["txn_id"], $body);

        //TODO: envoyer un mail au payer en cas d'échec

    }


    public static function handleEvent($ipn)
    {
        $paypal = new PaypalIPN();
        $paypal->useSandbox();
        if($paypal->verifyIPN() !=  true)
        {
            throw new LogicException("Failed to verify IPN Message");
        }

        // (Avertir administrateur par mail ?)
        // Ou faire avant de dire verified
        // Réaliser les vérifications
        $storage = Engine::Instance()->Persistence("DatabaseStorage");

        // Vérification pas un spoof
        if($ipn->receiver_email != PAYPAL::$EMAIL)
            throw new LogicException("Receiver email doesnt match.");

        // Vérification txn_id
        $reservations = null;
        $storage->findAll("Reservation", $reservations, "txn_id = '".$ipn->txn_id."'");
        if(count($reservations) > 0)
        {
            throw new LogicException("Txn_id already present.");
        }

        // Vérification item
        $reservation = new Reservation($storage, $ipn->item_number);
        $reservation = $storage->find($reservation);
        if($reservation == null)
            throw new LogicException("Unable to find reservation.");

        // Vérification guest
        $guest = new User($storage, $reservation->GuestId());
        $guest = $storage->find($guest);
        if($guest == null)
            throw new LogicException("Unable to find guest.");

        // verification status
        if($reservation->Paid() != "0" && $reservation->Paid() != 0)
            throw new LogicException("Invalid reservation status.");

        // vérfication mail guest = mail payement
        if($guest->Mail() !== $ipn->payer_email)
            throw new LogicException("Guest email different from Payer Email");

        // Vérification recette
        $recipe = new Recipe($storage, $ipn->RecipeId());
        $recipe = $storage->find($recipe);
        if($recipe == null)
            throw new LogicException("Unable to find recipe.");

        // Vérification prix
        if(floatval($recipe->Price()) + Paypal::$MC_PRICE != floatval($ipn->payment_gross))
            throw new LogicException("Invalid price.");

        // Mise à jour de l'état de la réservation
        $reservation->setPaid("1");
        $reservation->setPaidAt(time());
        $reservation->setTxnId($ipn->txn_id);
        $storage->persist($reservation, StorageState::ToUpdate);
        $storage->flush();
        Engine::Instance()->Logger()->warning($_POST["payment_date"]."(".$_POST["txn_id"].") ".$_POST["mc_gross"]."€: OK");
        

        // TODO: envoyer mail au guest avec numéro de téléphone du host
        // TODO: envoyer mail à l'hote avec numéro de téléphone du guest
        API::GenerateNotification(null, $reservation->GuestId(), "info", "Votre payement concernant la recette ".$recipe["name"]." a été traité ! Vous allez recevoir un mail contenant le numéro de votre hôte.", false);
        API::GenerateNotification(null, $reservation->HostId(), "info", "Une réservation concernant la recette ".$recipe["name"]." a été payée ! Vous allez recevoir un mail contenant le numéro de votre invité !", false);
    }


}