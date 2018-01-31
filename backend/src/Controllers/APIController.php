<?php

include_once "Core/Controller.php";
include_once 'Applicative/API.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 22/01/17
 * Time: 16:15
 */
class APIController extends Controller
{

    public static $OK = "OK";
    public static $NO = "NO";

    public function run($ctx)
    {
	    header("Access-Control-Allow-Origin: *");
        $ope = strtolower($ctx[0]);
        foreach ($_POST as $key => $value)
        {
            if($value == "null") {
                $_POST[$key] = null;
                continue;
            }else {
                $_POST[$key] = trim($_POST[$key]);
                $_POST[$key] = View::MakeTextSafe($value);
            }
        }

        try {
            switch ($ope) {
                case "auth":
                    $this->Auth();
                    break;
                case "adduser":
                    $this->AddUser();
                    break;
                case "addorigin":
                    $this->AddOrigin();
                    break;
                case "addpins":
                    $this->AddPins();
                break;
                case "addcomment":
                    $this->AddComment();
                    break;
                case "addreport":
                    $this->AddReport();
                    break;
                case "addreservation":
                    $this->AddReservation();
                    break;
                case "addnotification":
                    $this->AddNotification();
                    break;
                case "addrecipe":
                    $this->AddRecipe();
                    break;
                case "removeomment":
                    $this->Remove("Comment");
                    break;
                case "removenotification":
                    $this->Remove("Notification");
                    break;
                case "removerecipe":
                    $this->Remove("Recipe");
                    break;
                case "removeorigin":
                    $this->Remove("Origin");
                    break;
                case "removepins":
                    $this->Remove("Pins");
                break;
                case "updateorigin":
                    $this->UpdateOrigin();
                    break;
                case "updateuser":
                    $this->UpdateUser();
                    break;
                case "updatecomment":
                    $this->UpdateComment();
                    break;
                case "updatereport":
                    $this->UpdateReport();
                    break;
                case "updaterecipe":
                    $this->UpdateRecipe();
                    break;
                case "updatenotification":
                    $this->UpdateNotification();
                    break;
                case "getorigin":
                    $this->Get("Origin");
                    break;
                case "getpins":
                    $this->Get("Pins");
                break;
                case "getuser":
                    $this->Get("User");
                    break;
                case "getcomment":
                    $this->Get("Comment");
                    break;
                case "getreport":
                    $this->Get("Report");
                    break;
                case "getreservation":
                    $this->Get("Reservation");
                    break;
                case "getrecipe":
                    $this->Get("Recipe");
                    break;
                case "getnotification":
                    $this->Get("Notification");
                    break;
                case "getcomments":
                    $this->GetAll("Comment");
                    break;
                case "getreports":
                    $this->GetAll("Report");
                    break;
                case "getreservations":
                    $this->GetAll("Reservation");
                    break;
                case "getrecipes":
                    $this->GetAll("Recipe");
                    break;
                case "getusers":
                    $this->GetAll("User");
                    break;
                case "getnotifications":
                    $this->GetAll("Notification");
                    break;
                case "getorigins":
                    $this->GetAll("Origin");
                    break;
                case "getpinses":
                    $this->GetAll("Pins");
                    break;
                case "refundorcancelreservation":
                    $this->RefundOrCancelReservation();
                    break;
                case "fullfillreservation":
                    $this->FullFillReservation();
                    break;
                case "validatereservation":
                    $this->ValidateReservation();
                    break;
                case "beginresetpassword":
                    $this->BeginResetPassword();
                    break;
                case "endresetpassword":
                    $this->EndResetPassword();
                    break;
                default:
                    http_response_code(404);
                    return;

            }
        } catch (Exception $e) {
            $this->Write(APIController::$NO, $e->getCode(), $e->getMessage() . "\n\n" . $e->getTraceAsString());
            return;
        }
    }


    // Fonctions spéciales liées aux processus de compte utilisateur
    private function BeginResetPassword()
    {
        if(isset($_POST["email"]) == false){
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        API::BeginResetPassword($_POST["email"]);
        $this->Write(APIController::$OK, null);
    }

    private function EndResetPassword()
    {
        if(isset($_POST["token"]) == false){
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        API::EndResetPassword($_POST["token"]);
        $this->Write(APIController::$OK, null);
    }

    // Fonctions spéciales liées aux processus de réservation

    private function RefundOrCancelReservation()
    {
        if(isset($_POST["id"]) == false || isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $reservation = new Reservation(null, $_POST["id"]);
        API::RefundOrCancelReservation($_POST["token"], $reservation);
        $this->Write(APIController::$OK, null);
    }


    private function FullFillReservation()
    {
        if(isset($_POST["id"]) == false || isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $reservation = new Reservation(null, $_POST["id"]);
        API::FullFillReservation($_POST["token"], $reservation);
        $this->Write(APIController::$OK, null);
    }

    private function ValidateReservation()
    {
        if(isset($_POST["id"]) == false || isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $reservation = new Reservation(null, $_POST["id"]);
        API::ValidateReservation($_POST["token"], $reservation);
        $this->Write(APIController::$OK, null);
    }

    private function Auth()
    {
        if(isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $user = API::Auth($_POST["token"]);
        $user = get_object_vars($user);
        $user["password"] = null;
        $this->Write(APIController::$OK, $user);
    }

    private function Get($class)
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $method = "Get".$class;
        $res = null;
        $token = null;
        if(isset($_POST["token"]))
            $token = $_POST["token"];
        if(method_exists("API", $method) == false)
            $res = API::Get($token, $class, $_POST["id"]);
        else
            $res = API::$method($token, $_POST["id"]);
        $this->Write(APIController::$OK, $res);
    }

    private function GetAll($class)
    {
        $filters = null;
        /*if(isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }*/
        if(isset($_POST["filters"]))
        {
            $filters = $_POST["filters"];
        }
        $method = "GetAll".$class;
        $token = null;
        if(isset($_POST["token"]))
            $token = $_POST["token"];
        $res = null;
        if(method_exists("API", $method) == false)
            $res = API::GetAll($token, $class, $filters);
        else
            $res = API::$method($token, $filters);
        $this->Write(APIController::$OK, $res);
    }

    private function Add($item)
    {
        if (isset($_POST["token"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $func = "Add" . get_class($item);
        $id = null;
        if(method_exists("API", $func) == false)
            $id = API::Add($_POST["token"], $item);
        else
            $id = Api::$func($_POST["token"], $item);
        $this->Write(APIController::$OK, $id);
    }

    private function Remove($class)
    {
        if (isset($_POST["token"]) == false || isset($_POST["id"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $func = "Remove" . $class;
        if(method_exists("API", $func) == false)
            API::Remove($_POST["token"],$class,  $_POST["id"]);
        else
            Api::$func($_POST["token"], $_POST["id"]);
        $this->Write(APIController::$OK, null);
    }

    private function Update($item)
    {
        if (isset($_POST["token"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $func = "Update" . get_class($item);
        //API::$func($_POST["token"], $item);
        if(method_exists("API", $func) == false)
            API::Update($_POST["token"], $item);
        else
            Api::$func($_POST["token"], $item);
        $this->Write(APIController::$OK, null);
    }

    private function Write($state, $data, $message = "")
    {
	header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json');
        $result = array();
        $result["state"] = $state;
        $result["message"] = $message;
        $result["data"] = $data;
        print json_encode($result);
    }

    private function AddOrigin()
    {
        if(isset($_POST["name"]) == false )
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $origin = new Origin(null);
        $origin->setName($_POST["name"]);
        $this->Add($origin);
    }

    private function AddPins()
    {
        if(isset($_POST["name"]) == false )
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $origin = new Pins(null);
        $origin->setName($_POST["name"]);
        $this->Add($origin);
    }

    private function AddComment()
    {
        if(isset($_POST["target_id"]) == false || isset($_POST["author_id"]) == false || isset($_POST["content"]) == false || isset($_POST["note"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $comment = new Comment(null);
        $comment->setAuthorId($_POST["author_id"]);
        $comment->setTargetId($_POST["target_id"]);
        $comment->setContent($_POST["content"]);
        $comment->setNote($_POST["note"]);
        $this->Add($comment);
    }

    private function AddReport()
    {
        if(isset($_POST["target_id"]) == false || isset($_POST["author_id"]) == false || isset($_POST["content"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $report = new Report(null);
        $report->setAuthorId($_POST["author_id"]);
        $report->setTargetId($_POST["target_id"]);
        $report->setContent($_POST["content"]);
        $report->setProgress(1);
        $this->Add($report);
    }

    private function AddReservation()
    {
        if(isset($_POST["host_id"]) == false || isset($_POST["guest_id"]) == false || isset($_POST["Recipe_id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $reservation = new Reservation(null);
        $reservation->setGuestId($_POST["guest_id"]);
        $reservation->setHostId($_POST["host_id"]);
        $reservation->setRecipeId($_POST["Recipe_id"]);
        $reservation->setDone("0");
        $reservation->setPaid("0");
        $this->Add($reservation);
    }

    private function AddNotification()
    {
        if(isset($_POST["User_id"]) == false || isset($_POST["type"]) == false || isset($_POST["content"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $notification = new Notification(null);
        $notification->setUserId($_POST["User_id"]);
        $notification->setContent($_POST["content"]);
        $notification->setType($_POST["type"]);
        $notification->setNew(1);
        $this->Add($notification);

    }

    private function AddRecipe()
    {
        if(isset($_POST["name"]) == false || isset($_POST["description"]) == false || isset($_POST["picture"]) == false ||
        isset($_POST["origin"]) == false || isset($_POST["items"]) == false || isset($_POST["date_start"]) == false || isset($_POST["date_end"]) == false || isset($_POST["price"]) == false || isset($_POST["places"]) == false
        || isset($_POST["place"]) == false || isset($_POST["latitude"]) == false || isset($_POST["longitude"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $recipe = new Recipe(null);
        $recipe->setName($_POST["name"]);
        $recipe->setDescription($_POST["description"]);
        $recipe->setPicture($_POST["picture"]);
	    $user = API::auth($_POST["token"]);
        $recipe->setUserId($user->Id());
        $recipe->setLatitude($_POST["latitude"]);
        $recipe->setLongitude($_POST["longitude"]);
        /*if($user->Geolocation() != null)
        {
            $recipe->setLatitude(explode(",",$user->Geolocation())[0]);
            $recipe->setLongitude(explode(",",$user->Geolocation())[1]);
        }*/
        $recipe->setOrigin($_POST["origin"]);
        $recipe->setItems($_POST["items"]);
        $recipe->setDateStart($_POST["date_start"]);
        $recipe->setDateEnd($_POST["date_end"]);
        $recipe->setPrice($_POST["price"]);
        $recipe->setPlaces($_POST["places"]);
	    $recipe->setPlace($_POST["place"]);
        if(isset($_POST["pins"]))
            $recipe->setPins($_POST["pins"]);
        $this->Add($recipe);
    }

    private function AddUser()
    {
        if(isset($_POST["username"]) == false || isset($_POST["password"]) == false || isset($_POST["phone"]) == false || isset($_POST["mail"]) == false
            || isset($_POST["age"]) == false || isset($_POST["description"]) == false || isset($_POST["lastname"]) == false || isset($_POST["firstname"]) == false || isset($_POST["address"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $user = new User(null);
        $user->setUsername($_POST["username"]);
        $user->setPassword($_POST["password"]);
        $user->setPhone($_POST["phone"]);
        $user->setMail($_POST["mail"]);
        $user->setDescription($_POST["description"]);
        $user->setFirstname($_POST["firstname"]);
        $user->setLastname($_POST["lastname"]);
        $user->setAddress($_POST["address"]);
        $user->setAge($_POST["age"]);

        if(isset($_POST["geolocation"]))
            $user->setGeolocation($_POST["geolocation"]);
        if(isset($_POST["picture"]))
            $user->setPicture($_POST["picture"]);
        if(isset($_POST["discease"]))
            $user->setDiscease($_POST["discease"]);
        if(isset($_POST["preference"]))
            $user->setPreference($_POST["preference"]);
        if(isset($_POST["favorite"]))
            $user->setFavorite($_POST["favorite"]);
        if(isset($_POST["pins"]))
            $user->setPins($_POST["pins"]);
        if(isset($_POST["banner"]))
            $user->setBanner($_POST["banner"]);
        $user->setBanned(0);
        $user->setRights(0);
        // On peut créer un  compte sans token. Du coup on passe directement sans à API::AddUser
        $id = API::AddUser(null, $user);
        $this->Write(APIController::$OK, $id);
    }

    private function UpdateOrigin()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $origin = new Origin(null, $_POST["id"]);
        if(isset($_POST["name"]))
            $origin->setName($_POST["name"]);
        $this->Update($origin);
    }

    public function UpdateUser()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $user = new User(null, $_POST["id"]);
        if(isset($_POST["username"]))
            $user->setUsername($_POST["username"]);
        if(isset($_POST["password"]))
            $user->setPassword($_POST["password"]);
        if(isset($_POST["picture"]))
            $user->setPicture($_POST["picture"]);
        if(isset($_POST["geolocation"]))
            $user->setGeolocation($_POST["geolocation"]);
        if(isset($_POST["phone"]))
            $user->setPhone($_POST["phone"]);
        if(isset($_POST["banned"]))
            $user->setBanned($_POST["banned"]);
        if(isset($_POST["rights"]))
            $user->setRights($_POST["rights"]);
        if(isset($_POST["discease"]))
            $user->setDiscease($_POST["discease"]);
        if(isset($_POST["preference"]))
            $user->setPreference($_POST["preference"]);
        if(isset($_POST["favorite"]))
            $user->setFavorite($_POST["favorite"]);
        if(isset($_POST["mail"]))
            $user->setMail($_POST["mail"]);
        if(isset($_POST["pins"]))
            $user->setPins($_POST["pins"]);
        if(isset($_POST["age"]))
            $user->setAge($_POST["age"]);
        if(isset($_POST["banner"]))
            $user->setBanner($_POST["banner"]);
        if(isset($_POST["description"]))
            $user->setDescription($_POST["description"]);
        if(isset($_POST["lastname"]))
            $user->setLastname($_POST["lastname"]);
        if(isset($_POST["firstname"]))
            $user->setFirstname($_POST["firstname"]);
        if(isset($_POST["address"]))
            $user->setAddress($_POST["address"]);
        $this->Update($user);
    }

    public function UpdateComment()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $comment = new Comment(null, $_POST["id"]);
        if(isset($_POST["content"]))
            $comment->setContent($_POST["content"]);
        if(isset($_POST["note"]))
            $comment->setNote($_POST["note"]);
        $this->Update($comment);
    }

    public function UpdateReport()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $report = new Report(null, $_POST["id"]);
        if(isset($_POST["progress"]))
            $report->setProgress($_POST["progress"]);
        if(isset($_POST["content"]))
            $report->setContent($_POST["content"]);
        $this->Update($report);
    }

    public function UpdateRecipe()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $recipe = new Recipe(null, $_POST["id"]);
        if(isset($_POST["name"]))
            $recipe->setName($_POST["name"]);
        if(isset($_POST["description"]))
            $recipe->setDescription(($_POST["description"]));
        if(isset($_POST["picture"]))
            $recipe->setPicture($_POST["picture"]);
        if(isset($_POST["origin"]))
            $recipe->setOrigin($_POST["origin"]);
        if(isset($_POST["items"]))
            $recipe->setItems($_POST["items"]);
        if(isset($_POST["date_start"]))
            $recipe->setDateStart($_POST["date_start"]);
        if(isset($_POST["date_end"]))
            $recipe->setDateEnd($_POST["date_end"]);
        /*if(isset($_POST["price"]))
            $recipe->setPrice($_POST["price"]);*/
        if(isset($_POST["places"]))
            $recipe->setPlaces($_POST["places"]);
        if(isset($_POST["pins"]))
            $recipe->setPins($_POST["pins"]);
	    if(isset($_POST["place"]))
	        $recipe->setPlace($_POST["place"]);
        $this->Update($recipe);

    }

    public function UpdateNotification()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $notification = new Notification(null, $_POST["id"]);
        if(isset($_POST["new"]))
            $notification->setNew($_POST["new"]);
        $this->Update($notification);
    }





    /*private function AddEntry()
    {
        $entry = new Entry(null);
        $this->Add($entry);
    }

    private function RemoveEntry()
    {
        $this->Remove("Entry");
    }

    /*private function GetEntry()
    {
        if(isset($_POST["token"]) == false || isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $res = API::GetEntry($_POST["token"], $_POST["id"]);
        $this->Write(APIController::$OK, $res);
    }*/

    /*private function GetEntryUpdate()
    {
        if(isset($_POST["token"]) == false || isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $res = API::GetEntryUpdate($_POST["token"], $_POST["id"]);
        $this->Write(APIController::$OK, $res);
    }

    private function GetEntries()
    {
        if(isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $res = API::GetEntries($_POST["token"]);
        $this->Write(APIController::$OK, $res);
    }

    private function AddEntry_Event()
    {
        if (isset($_POST["Entry_id"]) == false || isset($_POST["Event_id"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $item = new Entry_Event(null);
        $item->setEntryId($_POST["Entry_id"]);
        $item->setEventId($_POST["Event_id"]);
        $this->Add($item);
    }

    private function RemoveEntry_Event()
    {
        $this->Remove("Entry_Event");
    }

    private function AddEntryUpdate()
    {
        if(isset($_POST["name"]) == false || isset($_POST["reason"]) == false || isset($_POST["Entry_id"]) == false )
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $entry = new EntryUpdate(null);
        $tmp_name = explode(" ",$_POST["name"]);
        $tmp_name[0] = strtoupper($tmp_name[0]);
        $tmp_name = join(" ", $tmp_name);
        $entry->setName($tmp_name);
        $entry->setReason($_POST["reason"]);
        $entry->setEntryId($_POST["Entry_id"]);
        if(isset($_POST["gender"]))
            $entry->setGender($_POST["gender"]);
        if(isset($_POST["status"]))
            $entry->setStatus($_POST["status"]);
        if(isset($_POST["Structure_id"]))
            $entry->setStructureId($_POST["Structure_id"]);
        if(isset($_POST["mails"]))
            $entry->setMails($_POST["mails"]);
        if(isset($_POST["phone"]))
            $entry->setPhone($_POST["phone"]);
        if(isset($_POST["phone_mobile"]))
            $entry->setPhoneMobile($_POST["phone_mobile"]);
        if(isset($_POST["address"]))
            $entry->setAddress($_POST["address"]);
        if(isset($_POST["zip"]))
            $entry->setZip($_POST["zip"]);
        if(isset($_POST["city"]))
            $entry->setCity($_POST["city"]);
        if(isset($_POST["country"]))
            $entry->setCountry($_POST["country"]);
        if(isset($_POST["birthdate"]))
            $entry->setBirthdate($_POST["birthdate"]);
        if(isset($_POST["information"]))
            $entry->setInformation($_POST["information"]);
        if(isset($_POST["tag"]))
            $entry->setTag($_POST["tag"]);
        $this->Add($entry);
    }

    private function RemoveEntryUpdate()
    {
        $this->Remove("EntryUpdate");
    }



    private function AddEvent()
    {
        if (isset($_POST["name"]) == false || isset($_POST["description"]) == false || isset($_POST["date_start"]) == false || isset($_POST["date_end"]) == false ||
            isset($_POST["address"]) == false || isset($_POST["zip"]) == false || isset($_POST["country"]) == false
        ) {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $event = new Event(null);
        $event->setName($_POST["name"]);
        $event->setDescription($_POST["description"]);
        $event->setAddress($_POST["address"]);
        $event->setCity($_POST["city"]);
        $event->setZip($_POST["zip"]);
        $event->setCountry($_POST["country"]);
        $event->setDateStart($_POST["date_start"]);
        $event->setDateEnd($_POST["date_end"]);
        $this->Add($event);
    }

    private function RemoveEvent()
    {
        $this->Remove("Event");
    }

    private function UpdateEvent()
    {
        if (isset($_POST["id"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $event = new Event(null, $_POST["id"]);
        if (isset($_POST["name"]))
            $event->setName($_POST["name"]);
        if (isset($_POST["description"]))
            $event->setDescription($_POST["description"]);
        if (isset($_POST["address"]))
            $event->setAddress($_POST["address"]);
        if (isset($_POST["zip"]))
            $event->setZip($_POST["zip"]);
        if (isset($_POST["country"]))
            $event->setCountry($_POST["country"]);
        if(isset($_POST["city"]))
            $event->setCity($_POST["city"]);
        if (isset($_POST["date_start"]))
            $event->setDateStart($_POST["date_start"]);
        if (isset($_POST["date_end"]))
            $event->setDateEnd($_POST["date_end"]);
        $this->Update($event);
    }

    private function AddStructure()
    {
        if(isset($_POST["name"]) == false || isset($_POST["StructureType_id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $structure = new Structure(null);
        $structure->setName($_POST["name"]);
        $structure->setStructureTypeId($_POST["StructureType_id"]);
        $this->Add($structure);
    }

    private function RemoveStructure()
    {
        $this->Remove("Structure");
    }

    private function UpdateStructure()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $structure = new Structure(null, $_POST["id"]);
        if(isset($_POST["name"]))
            $structure->setName($_POST["name"]);
        if(isset($_POST["StructureType_id"]))
            $structure->setStructureTypeId($_POST["StructureType_id"]);
        $this->Update($structure);
    }

    /*private function GetStructure()
    {
        if(isset($_POST["token"]) == false || isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $res = API::GetStructure($_POST["token"], $_POST["id"]);
        $this->Write(APIController::$OK, $res);
    }

    private function AddStructureType()
    {
        if(isset($_POST["name"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Name");
            return;
        }
        $structure = new StructureType(null);
        $structure->setName($_POST["name"]);
        $this->Add($structure);
    }

    private function RemoveStructureType()
    {
        $this->Remove("StructureType");
    }

    private function UpdateStructureType()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $structure = new StructureType(null, $_POST["id"]);
        if(isset($_POST["name"]))
            $structure->setName($_POST["name"]);
        $this->Update($structure);
    }

    private function AddTag()
    {
        if(isset($_POST["name"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Name");
            return;
        }
        $structure = new Tag(null);
        $structure->setName($_POST["name"]);
        $this->Add($structure);
    }

    private function RemoveTag()
    {
        $this->Remove("Tag");
    }

    private function UpdateTag()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }
        $structure = new Tag(null, $_POST["id"]);
        if(isset($_POST["name"]))
            $structure->setName($_POST["name"]);
        $this->Update($structure);
    }

    private function AddUser()
    {
        if(isset($_POST["username"]) == false || isset($_POST["password"]) ==  false || isset($_POST["rights"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $user = new User(null);
        $user->setUsername($_POST["username"]);
        $user->setPassword($_POST["password"]);
        $user->setRights($_POST["rights"]);
        $this->Add($user);
    }

    private function RemoveUser()
    {
        $this->Remove("User");
    }

    private function UpdateUser()
    {
        if(isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Id");
            return;
        }

        $user = new User(null, $_POST["id"]);
        if(isset($_POST["username"]))
            $user->setUsername($_POST["username"]);
        if(isset($_POST["password"])) {
            $user->setPassword($_POST["password"]);
        }
        if(isset($_POST["rights"]))
            $user->setRights($_POST["rights"]);
        $this->Update($user);
    }
    */

}
