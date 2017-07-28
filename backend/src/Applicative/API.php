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

    public static function GetAll($token, $class, $filters = null)
    {
        API::CheckRights($token, 1);
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $items = null;
        $f = "";
        if($filters != null) {
            $filters=str_replace("\\","", $filters);
            $filters = json_decode($filters);
            foreach($filters as $key => $value)
            {
                if(is_array($value))
                {
                    for($i = 0; $i < count($value); $i++)
                    {
                        if(is_numeric($value[$i]))
                        {
                            $f .= $key." = '".$value[$i]."' OR ";
                        }
                        else
                        {
                            $f .= $key." LIKE '%".$value[$i]."%' OR ";
                        }
                    }
                    $f = substr($f,0, -3)."AND ";
                }
                else
                {
                    if(is_numeric($value))
                    {
                        $f .= $key." = '".$value."' AND ";
                    }
                    else
                    {
                        $f .= $key." LIKE '%".$value."%' AND ";
                    }
                }
            }
            $f = substr($f,0, -4);
        }
        $storage->findAll($class, $items, $f);
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
            /*if(strpos($key, "_id") !== false)
            {
                $nk = str_replace("_id", "", $key);
                $result[strtolower($nk)] = API::Get($token,$nk, $value);
            }*/
            if($key == "password") // On masque le champs password
                $result[$key] = null;
        }
        return $result;
    }

    public static function AddUser($token, $item)
    {
        return API::Add($token, $item, false);
    }

    private static function UpdateUserAsAdmin($token, $item)
    {
        API::Update($token, $item);
    }

    private static function UpdateUserAsSelf($token, $item, $current)
    {
        $item->setRights($current->Rights());
        $item->setBanned($current->Banned());
        API::Update($token, $item);
    }

    public static function UpdateUser($token, $item)
    {
        $current = Api::Auth($token);
        if($current->Rights() >= 2)
        {
            API::UpdateUserAsAdmin($token, $item);
        }
        else if($current->Id() == $item->Id())
            Api::UpdateUserAsSelf($token, $item, $current);
        else
            throw new Exception("Not Enough Power", 1);
    }

    public static function GetComment($token, $id)
    {
        $comment = API::Get($token, "Comment", $id);
        if($comment == null)
            return null;
        $comment["target"] = null;
        $comment["author"] = null;
        if($comment["target_id"] !=  "" && $comment["target_id"] != null)
        {
            $comment["target"] = API::Get($token, "User", $comment["target_id"]);
        }
        if($comment["author_id"] !=  "" && $comment["author_id"] != null)
        {
            $comment["author"] = API::Get($token, "User", $comment["author_id"]);

        }
        return $comment;
    }

    public static function GetReport($token , $id)
    {
        $report = API::Get($token, "Report", $id);
        if($report == null)
            return null;
        $report["target"] = null;
        $report["author"] = null;
        if($report["target_id"] !=  "" && $report["target_id"] != null)
        {
            $report["target"] = API::Get($token, "User", $report["target_id"]);
        }
        if($report["author_id"] !=  "" && $report["author_id"] != null)
        {
            $report["author"] = API::Get($token, "User", $report["author_id"]);

        }
        return $report;
    }

    public static function GetReservation($token, $id)
    {
        $reservation = API::Get($token, "Reservation", $id);
        if($reservation == null)
            return null;
        $reservation["host"] = null;
        $reservation["guest"] = null;
        $reservation["recipe"] = null;
        if($reservation["host_id"] != "" && $reservation["host_id"] != null)
        {
            $reservation["host"] = API::Get($token, "User", $reservation["host_id"]);
        }
        if($reservation["guest_id"] != "" && $reservation["guest_id"] != null)
        {
            $reservation["guest"] = API::Get($token, "User", $reservation["guest_id"]);
        }
        if($reservation["Recipe_id"] != "" && $reservation["Recipe_id"] != null)
        {
            $reservation["recipe"] = API::Get($token, "Recipe", $reservation["Recipe_id"]);
        }
        return $reservation;
    }

    public static function GetRecipe($token, $id)
    {
        $recipe = API::Get($token, "Recipe", $id);
        if($recipe == null)
            return null;
        $recipe["user"] = null;
        if($recipe["User_id"] != "" && $recipe["User_id"] != null)
        {
            $recipe["user"] = API::Get($token, "User", $recipe["User_id"]);
        }
        return $recipe;
    }

    public static function GetNotification($token, $id)
    {
        $notification = API::Get($token, "Notification", $id);
        if($notification == null)
            return null;
        $notification["user"] = null;
        if($notification["User_id"] != "" && $notification["User_id"] != null)
        {
            $notification["user"] = API::Get($token, "User", $notification["User_id"]);
        }
        return $notification;
    }






}
