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
    
    public static function Add($token, $item, $check = true)
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

    public static function Remove($token,$class, $id, $check = true)
    {
        if($check)
            API::CheckRights($token, 1);

        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $entry = new $class($storage, $id);
        $storage->remove($entry);
        $storage->flush();
    }
    
    public static function Update($token, $item, $check = true)
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

    public static function AddUser($token, $item)
    {
        return API::Add($token, $item, false);
    }






}
