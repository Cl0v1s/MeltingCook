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
                case "addentry":
                    $this->AddEntry();
                    break;
                case "removeentry":
                    $this->RemoveEntry();
                    break;
                case "updateentry":
                    $this->UpdateEntry();
                    break;
                case "addentry_event":
                    $this->AddEntry_event();
                    break;
                case "removeentry_event":
                    $this->RemoveEntry_event();
                    break;
                case "updateentry_event":
                    $this->UpdateEntry_event();
                    break;
                case "addentryupdate":
                    $this->AddEntryUpdate();
                    break;
                case "removeentryupdate":
                    $this->RemoveEntryUpdate();
                    break;
                case "updateentryupdate":
                    $this->UpdateEntryUpdate();
                    break;
                case "addevent":
                    $this->AddEvent();
                    break;
                case "removeevent":
                    $this->RemoveEvent();
                    break;
                case "updateevent":
                    $this->UpdateEvent();
                    break;
                case "addstructure":
                    $this->AddStructure();
                    break;
                case "removestructure":
                    $this->RemoveStructure();
                    break;
                case "updatestructure":
                    $this->UpdateStructure();
                    break;
                case "addstructuretype":
                    $this->AddStructureType();
                    break;
                case "removestructuretype":
                    $this->RemoveStructureType();
                    break;
                case "updatestructuretype":
                    $this->UpdateStructureType();
                    break;
                case "addtag":
                    $this->AddTag();
                    break;
                case "removetag":
                    $this->RemoveTag();
                    break;
                case "updatetag":
                    $this->UpdateTag();
                    break;
                case "adduser":
                    $this->AddUser();
                    break;
                case "removeuser":
                    $this->RemoveUser();
                    break;
                case "updateuser":
                    $this->UpdateUser();
                    break;
                case "getentry":
                    $this->Get("Entry");
                    break;
                case "getentry_event":
                    $this->Get("Entry_Event");
                    break;
                case "getentryupdate":
                    $this->Get("EntryUpdate");
                    break;
                case "getevent":
                    $this->Get("Event");
                    break;
                case "getstructure":
                    $this->Get("Structure");
                    break;
                case "getstructuretype":
                    $this->Get("StructureType");
                    break;
                case "gettag":
                    $this->Get("Tag");
                    break;
                case "getuser":
                    $this->Get("User");
                    break;
                case "getentries":
                    $this->GetEntries();
                    break;
                case "getentry_events":
                    $this->GetAll("Entry_Event");
                    break;
                case "getentryupdates":
                    $this->GetAll("EntryUpdate");
                    break;
                case "getevents":
                    $this->GetAll("Event");
                    break;
                case "getstructures":
                    $this->GetAll("Structure");
                    break;
                case "getstructuretypes":
                    $this->GetAll("StructureType");
                    break;
                case "gettags":
                    $this->GetAll("Tag");
                    break;
                case "getusers":
                    $this->GetAll("User");
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
        if(isset($_POST["token"]) == false || isset($_POST["id"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $method = "Get".$class;
        $res = null;
        if(method_exists("API", $method) == false)
            $res = API::Get($_POST["token"], $class, $_POST["id"]);
        else
            $res = API::$method($_POST["token"], $_POST["id"]);
        $this->Write(APIController::$OK, $res);
    }

    private function GetAll($class)
    {
        if(isset($_POST["token"]) == false)
        {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $res = API::GetAll($_POST["token"], $class);
        $this->Write(APIController::$OK, $res);
    }

    private function Add($item)
    {
        if (isset($_POST["token"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $func = "Add" . get_class($item);
        $id = API::$func($_POST["token"], $item);
        $this->Write(APIController::$OK, $id);
    }

    private function Remove($class)
    {
        if (isset($_POST["token"]) == false || isset($_POST["id"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Data");
            return;
        }
        $func = "Remove" . $class;
        API::$func($_POST["token"], $_POST["id"]);
        $this->Write(APIController::$OK, null);
    }

    private function Update($item)
    {
        if (isset($_POST["token"]) == false) {
            $this->Write(APIController::$NO, null, "Missing Token");
            return;
        }
        $func = "Update" . get_class($item);
        API::$func($_POST["token"], $item);
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

    private function AddEntry()
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
    }*/

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
    }*/

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

}
