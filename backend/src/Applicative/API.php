<?php

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 01/07/17
 * Time: 12:52
 */
class API
{
    /**
     * @param $token
     * @return User
     * @throws Exception
     */
    public static function Auth($token)
    {
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $users = null;
        $storage->findAll("User", $users);
        foreach ($users as $user)
        {
            if($user->checkAuth($token)) {
                return $user;
            }
        }
        throw new Exception("Invalid Token", 0);
    }

    public static function CheckRights($token, $level)
    {
        $user = API::Auth($token);
        if($user->Rights() < $level)
            throw new Exception("Not Enough Power", 1);
    }
    
    private static function Add($token, $item, $check = true)
    {
        if($item == null || $item->Id() != null)
            throw new InvalidArgumentException();
        if($check)
            API::CheckRights($token, 1);

        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $item->setStorage($storage);
        $storage->persist($item);
        $storage->flush();
        return $item->Id();
    }

    private static function Remove($token,$class, $id, $check = true)
    {
        if($check)
            API::CheckRights($token, 1);

        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $entry = new $class($storage, $id);
        $storage->remove($entry);
        $storage->flush();
    }
    
    private static function Update($token, $item, $check = true)
    {
        if($item == null || $item->Id() == null)
            throw new InvalidArgumentException();
        if($check)
            API::CheckRights($token, 1);

        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $item->setStorage($storage);
        $storage->persist($item, StorageState::ToUpdate);
        $storage->flush();
    }

    public static function GetAll($token, $class)
    {
        API::CheckRights($token, 1);
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $items = null;
        $storage->findAll($class, $items);
        return $items;
    }

    public static function Get($token, $class, $id)
    {
        API::CheckRights($token, 1);
        if($id == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $item = new $class($storage, $id);
        $item = $storage->find($item);
        $result = get_object_vars($item);
        foreach($item as $key => $value)
        {
            if(strpos($key, "_id") !== false)
            {
                $nk = str_replace("_id", "", $key);
                $result[strtolower($nk)] = API::Get($token,$nk, $value);
            }
            if($key == "password") // On masque le champs password
                $result[$key] = null;
        }
        return $result;
    }

    public static function AddEntry($token, $entry)
    {
        return API::Add($token, $entry);
    }

    public static function RemoveEntry($token, $id)
    {
        API::Remove($token, "Entry", $id);
    }

    public static function GetEntry($token, $id)
    {
        Api::CheckRights($token, 0);
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $items = null;
        $storage->findAll("EntryUpdate", $items, "id = (SELECT MAX(id) FROM EntryUpdate WHERE Entry_id = '" . $id . "')");
        if(count($items) <= 0)
            return null;
        $item = $items[0];
        $item = API::GetEntryUpdate($token, $item->Id());
        return $item;
    }

    public static function GetEntries($token)
    {
        Api::CheckRights($token, 0);
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $entries = Null;
        $conditions = "id = (SELECT MAX(id) FROM EntryUpdate WHERE Entry_id = T.Entry_id)";
        $conditions = $conditions . " ORDER BY name";
        $storage->findAll("EntryUpdate", $entries, $conditions);
        return $entries;
    }

    public static function AddEntry_Event($token, $entry)
    {
        return API::Add($token, $entry);
    }

    public static function RemoveEntry_Event($token, $id)
    {
        API::Remove($token, "Entry_Event", $id);
    }

    /**
     * @param $token
     * @param $entry EntryUpdate
     * @return mixed
     */
    public static function AddEntryUpdate($token, $entry)
    {
        $loged = API::Auth($token);
        if($loged->Rights() < 1)
            throw new Exception("Not Enough Power", 1);
        $date = new DateTime();
        $entry->setDate($date->getTimestamp());
        $entry->setUserId($loged->Id());
        return API::Add($token, $entry, false);
    }

    public static function RemoveEntryUpdate($token, $id)
    {
        API::Remove($token, "EntryUpdate", $id);
    }

    public static function GetEntryUpdate($token, $id)
    {
        Api::CheckRights($token, 0);
        $item = API::Get($token, "EntryUpdate", $id);
        if($item == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");

        // récupération des autres updates
        $updates = null;
        $storage->findAll("EntryUpdate", $updates, "Entry_id = '" . $item["Entry_id"] . "' ORDER BY date DESC");
        $item["updates"] = array();
        foreach ($updates as $update)
        {
            $update = get_object_vars($update);
            $update["structure"] = null;
            if($update["Structure_id"] != null && $update["Structure_id"] != "")
            {
                $update["structure"] = API::Get($token, "Structure", $update["Structure_id"]);
            }
            $update["user"] = null;
            if($update["User_id"] != null && $update["User_id"] != "")
            {
                $update["user"] = API::Get($token, "User", $update["User_id"]);
            }
            array_push($item["updates"], $update);
        }

        // Récupération des liens avec les évents
        $links = null;
        $storage->findAll("Entry_Event", $links, "Entry_id = '" . $item["Entry_id"] . "'");
        $item["links"] = array();
        foreach ($links as $link) {
            $link = get_object_vars($link);
            $link["event"] = null;
            if($link["Event_id"] != "" && $link["Event_id"] != "")
            {
                $link["event"] = API::Get($token, "Event", $link["Event_id"]);
            }
            array_push($item["links"], $link);
        }

        return $item;
    }


    public static function AddEvent($token, $entry)
    {
        return API::Add($token, $entry);
    }

    public static function RemoveEvent($token, $id)
    {
        API::Remove($token, "Event", $id);
    }

    public static function UpdateEvent($token, $event)
    {
        API::Update($token, $event);
    }

    public static function GetEvent($token, $id)
    {
        $item = API::Get($token, "Event", $id);
        if($item == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $links = Null;
        $entries = array();
        $storage->findAll("Entry_Event", $links, "Event_id = '".$id."'");
        foreach ($links as $link)
        {
            $entry = API::GetEntry($token, $link->EntryId());
            if($entry == null)
                continue;
            array_push($entries, $entry);
        }
        $item["entries"] = $entries;
        return $item;
    }

    public static function AddStructure($token, $entry)
    {
        return API::Add($token, $entry);
    }

    public static function RemoveStructure($token, $id)
    {
        API::Remove($token, "Structure", $id);
    }

    public static function GetStructure($token, $id)
    {
        $item = API::Get($token, "Structure", $id);
        if($item == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $entries = Null;
        $storage->findAll("EntryUpdate", $entries, "id = (SELECT MAX(id) FROM EntryUpdate WHERE Entry_id = T.Entry_id) AND Structure_id = '".$item["id"]."'");
        $item["entries"]=  $entries;
        return $item;
    }

    public static function UpdateStructure($token, $event)
    {
        API::Update($token, $event);
    }

    public static function AddStructureType($token, $entry)
    {
        return API::Add($token, $entry);
    }

    public static function RemoveStructureType($token, $id)
    {
        API::Remove($token, "StructureType", $id);
    }

    public static function GetStructureType($token, $id)
    {
        $item = API::Get($token, "StructureType", $id);
        if($item == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $structures = Null;
        $storage->findAll("Structure", $structures, "StructureType_id = '".$item["id"]."'");
        $item["structures"]=  $structures;
        return $item;
    }

    public static function UpdateStructureType($token, $event)
    {
        API::Update($token, $event);
    }

    public static function AddTag($token, $entry)
    {
        return API::Add($token, $entry);
    }

    public static function RemoveTag($token, $id)
    {
        API::Remove($token, "Tag", $id);
    }

    public static function UpdateTag($token, $event)
    {
        API::Update($token, $event);
    }

    public static function GetTag($token, $id)
    {
        $item = API::Get($token, "Tag", $id);
        if($item == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $entries = Null;
        $storage->findAll("EntryUpdate", $entries, "id = (SELECT MAX(id) FROM EntryUpdate WHERE Entry_id = T.Entry_id) AND tag LIKE '%".$item["name"]."%'");
        $item["entries"]=  $entries;
        return $item;
    }

    public static function AddUser($token, $entry)
    {
        API::CheckRights($token, 2);
        return API::Add($token, $entry, false);
    }

    public static function RemoveUser($token, $id)
    {
        API::CheckRights($token, 2);
        API::Remove($token, "User", $id, false);
    }

    public static function GetUser($token,$id)
    {
        $user = API::Get($token, "User", $id);
        $user["password"] = null;
        return $user;
    }


    /**
     * @param $token
     * @param $user User
     */
    public static function UpdateUser($token, $user)
    {
        $loged = API::Auth($token);
        if($loged->Rights() >= 2)
            API::Update($token, $user, false);
        else if($loged->Id() === $user->Id()) // On empeche la modification de ses propres droits par un non-administrateur
        {
            $user->setRights($loged->Rights());
            API::Update($token, $user, false);
        }
        else
            throw new Exception("Not Enough Power", 1);
    }





}
