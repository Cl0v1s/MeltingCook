<?php

require("Mailer.php");

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 01/07/17
 * Time: 12:52
 */
class API
{

    /**
     * Wrapper pour ajout de notification dans la base
     * @param $token
     * @param $User_id int
     * @param $type string
     * @param $content string
     */
    public static function GenerateNotification($token, $User_id,  $type, $content, $check = true)
    {
        $notification = new Notification(null);
        $notification->setUserId($User_id);
        $notification->setType($type);
        $notification->setContent($content);
        $notification->setNew("1");
        API::Add($token, $notification, $check);
    }


    // Fonctions spéciales liées aux processus de gestion de compte

    public static function BeginResetPassword($email)
    {
        $users = API::GetAll(null, "User", null, "AND mail = '".$email."'");
        if($users == null || count($users) <= 0)
            return;
        $user = $users[0];
        $user->setForgotPassword(1);
        API::Update(null, $user, false);
        $body = "<p>Bonjour ".$user->Firstname().",</p><p>Si vous avez demandé la mise à zéro de votre mot de passe Melting Cook, cliquez sur le lien ci-dessous. Sinon ignorez simplement ce message.</p>";
        $token = md5($user->Lastname().md5($user->Phone()));
        $link = "https://meltingcook.fr/#resetpassword/".$token;
        $body = $body."<p><a href='".$link."'>".$link."</a></p>";
        Mailer::SendMail($user->Mail(), "Remise à zéro de votre mot de passe", $body);
    }

    public static function EndResetPassword($token)
    {
        $users = API::GetAll(null, "User");
        if($users == null || count($users) <= 0)
            return;
        foreach ($users as $user)
        {
            if($token === md5($user->Lastname().md5($user->Phone())) && ($user->ForgotPassword() == 1 || $user->ForgotPassword() == "1" ))
            {
                $password = bin2hex(openssl_random_pseudo_bytes(4));
                $body = "<p>Bonjour ".$user->Firstname().",</p><p>Vous trouverez ci-dessous votre nouveau mot de passe Melting Cook. Pensez à vous connecter sur notre site et à le changer sous peu. Si vous n'avez pas demandé la remise à zéro de votre mot de passe, contactez nous.</p>";
                $body = $body."<p>".$password."</p>";
                Mailer::SendMail($user->Mail(), "Remise à zéro de votre mot de passe", $body);
                $password = md5($password);
                $user->setPassword($password);
                $user->setForgotPassword(0);
                API::Update($token, $user, false);
                return;
            }
        }
        throw new Exception();
    }


    // Fonctions spéciales liées aux processus de réservation

    /**
     * @param $token
     * @param $reservation Reservation
     * @throws Exception
     */
    public static function RefundOrCancelReservation($token, $reservation)
    {
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $reservation = $storage->find($reservation);
        if($reservation == null)
        {
            throw new Exception("Not Enought Power", 1);
        }

        $recipe = API::GetRecipe($token, $reservation->RecipeId());

        $user = API::Auth($token);
        // Seuls l'invité, l'hôte ou un admin peuvent effectuer cette action
        if($user->Id() != $reservation->GuestId() && $user->Id() != $reservation->HostId() && $user->Rights() < 2)
        {
            throw new Exception("Not Enought Power", 1);
        }

        // Si finalisé
        if($reservation->Done() == "1")
        {
            throw new Exception("Impossible d'annuler ou de demander un remboursement sur une réservation finalisée#", 2);
        }

        $guest = new User($storage, $reservation->GuestId());
        $guest = $storage->find($guest);
        $host = new User($storage, $reservation->HostId());
        $host = $storage->find($host);

        // Si pas provisionné, on supprime
        if($reservation->Paid() == "0")
        {
            if($guest != null)
                Mailer::SendMail($guest->Mail(), "Une mauvaise nouvelle a propos de la recette ".$recipe["name"], "Votre réservation concernant la recette ".$recipe["name"]." a été annulée.");
            API::GenerateNotification($token, $reservation->GuestId(), "info", "Votre réservation concernant la recette ".$recipe["name"]." a été annulée.");
            $reservation->setDone(-1);
            $reservation->setEndedAt(time());
            API::Update($token, $reservation);
            return;
        }

        // Si provisionné, on marque à rembourser
        if($reservation->Paid() == "1")
        {
            if($guest != null)
                Mailer::SendMail($guest->Mail(), "Une mauvaise nouvelle a propos de la recette ".$recipe["name"], "Votre réservation concernant la recette ".$recipe["name"]." a été annulée. Vous serez remboursé sous peu selon les conditions MeltingCook.");
            API::GenerateNotification($token, $reservation->GuestId(), "info", "Votre réservation concernant la recette ".$recipe["name"]." a été annulée. Vous serez remboursé sous peu selon les conditions MeltingCook.");
            if($host != null)
                Mailer::SendMail($host->Mail(),  "Une mauvaise nouvelle a propos de la recette ".$recipe["name"], "Une réservation concernant la recette ".$recipe["name"]." a été annulée.");
            API::GenerateNotification($token, $reservation->HostId(), "info", "Une réservation concernant la recette ".$recipe["name"]." a été annulée.");

            $reservation->setPaid(2);
            $reservation->setEndedAt(time());

            API::Update($token, $reservation);
            return;
        }
    }

    /**
     * @param $token
     * @param $reservation Reservation
     */
    public static function FullFillReservation($token, $reservation)
    {
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $reservation = $storage->find($reservation);
        if($reservation == null)
        {
            throw new Exception("Not Enought Power", 1);
        }

        $recipe = API::GetRecipe($token, $reservation->RecipeId());

        $user = API::Auth($token);
        // Seul un admin peut effectier cette action
        if($user->Rights() < 2)
        {
            throw new Exception("Not Enought Power", 1);
        }

        // la reservation doit avoir été provisionnée
        if($reservation->Paid() != "1" && $reservation->Paid() != "2")
        {
            throw new Exception("Impossible de terminer une réservation non provisionnée#",2);
        }

        $guest = new User($storage, $reservation->GuestId());
        $guest = $storage->find($guest);
        $host = new User($storage, $reservation->HostId());
        $host = $storage->find($host);

        if($reservation->Paid() == "1") {
            if($guest != null)
                Mailer::SendMail($guest->Mail(), "Une bonne nouvelle a propos de la recette ".$recipe["name"], "Votre réservation concernant la recette " . $recipe["name"] . " a été finalisée. Votre hôte va recevoir votre compensation et vous remercie !");
            
            API::GenerateNotification($token, $reservation->GuestId(), "success", "Votre réservation concernant la recette " . $recipe["name"] . " a été finalisée. Votre hôte va recevoir votre compensation et vous remercie !");
            
            if($host != null)
                Mailer::SendMail($host->Mail(), "Une mauvaise nouvelle a propos de la recette ".$recipe["name"], "Vous avez reçu une compensation relative à la recette " . $recipe["name"] . " ! Allez jeter un oeil à votre compte Paypal !");
            
            API::GenerateNotification($token, $reservation->HostId(), "success", "Vous avez reçu une compensation relative à la recette " . $recipe["name"] . " ! Allez jeter un oeil à votre compte Paypal !");
            $reservation->setDone(2);
        }

        if($reservation->Paid() == "2") {
            if($guest != null)
                Mailer::SendMail($guest->Mail(), "Une bonne nouvelle a propos de la recette ".$recipe["name"], "Votre réservation concernant la recette " . $recipe["name"] . " a été remboursée !");
            API::GenerateNotification($token, $reservation->GuestId(), "success", "Votre réservation concernant la recette " . $recipe["name"] . " a été remboursée !");
            $reservation->setDone(-1);
        }
        $reservation->setEndedAt(time());
        API::Update($token, $reservation);

    }

    /**
     * @param $token
     * @param $reservation Reservation
     */
    public static function ValidateReservation($token, $reservation)
    {
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $reservation = $storage->find($reservation);
        if($reservation == null)
        {
            throw new Exception("Not Enought Power", 1);
        }

        $user = API::Auth($token);
        // Seul l'invité peut effectuer cette action
        if($user->Id() != $reservation->GuestId())
        {
            throw new Exception("Not Enought Power", 1);
        }

        // Cette action ne peut être effectuée que sur une reservation provisionnée
        if($reservation->Paid() != "1")
        {
            throw new Exception("Impossible de valider une réservation non provisionnée#",2);
        }

        $recipe = new Recipe($storage, $reservation->RecipeId());
        $recipe = $storage->find($recipe);
        if(time() < intval($recipe->DateStart()))
        {
            throw new Exception("Impossible de valider une réservation n'ayant pas encore eu lieu#",2);
        }

        $host = new User($storage, $reservation->HostId());
        $host = $storage->find($host);

        if($host != null)
            Mailer::SendMail($host->Mail(), "Une bonne nouvelle a propos de la recette ".$recipe["name"], "Votre ancien invité ".$user->Username()." a lancé la procédure de finalisation de sa réservation! Vous devriez bientôt reçevoir votre compensation !");

        API::GenerateNotification($token, $reservation->HostId(), "success", "Votre ancien invité ".$user->Username()." a lancé la procédure de finalisation de sa réservation! Vous devriez bientôt reçevoir votre compensation !");

        $reservation->setDone(1);
        //$reservation->setEndedAt(time());
        API::Update($token, $reservation);
    }





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
                if($user->Banned() == 1 || $user->Banned() == "1")
                    throw new Exception("Votre compte a été banni par un administrateur. Vous pouvez contacter Melting Cook en cas de réclamation.#", 2);
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

    public static function GetAll($token, $class, $filters = null, $sqlconditions = null)
    {
        //API::CheckRights($token, 1);
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
        if($sqlconditions != null) {
            if($f == "")
                $f = "id = id ".$sqlconditions;
            else
                $f = $f." ".$sqlconditions;

        }
        $storage->findAll($class, $items, $f);
        return $items;
    }

    public static function Get($token, $class, $id)
    {
        //API::CheckRights($token, 1);
        if($id == null)
            return null;
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $item = new $class($storage, $id);
        $item = $storage->find($item);
        if($item == null)
            return null;
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

    /***
     * @param $token
     * @param $item Reservation
     */
    public static function AddReservation($token, $item)
    {
        $user = API::Auth($token);

        if($item->GuestId() == $item->HostId())
            throw new Exception("Vous ne pouvez prendre de réservation pour vos propres recettes#", 2);

        $existing = API::GetAll($token, "Reservation", '{ "Recipe_id" : "'.$item->RecipeId().'", "guest_id" : "'.$item->GuestId().'"  }');
        if(count($existing) > 0)
            throw new Exception("Impossible de réserver deux fois pour la même recette#", 2);

        $recipe = API::GetRecipe($token, $item->RecipeId());
        /*if(time() > $recipe["date_start"])
            throw new Exception("Impossible de réserver une recette après sa date de début#", 2);*/
        $storage = Engine::Instance()->Persistence("DatabaseStorage");

        $guest = new User($storage, $item->GuestId());
        $guest = $storage->find($guest);
        $host = new User($storage, $item->HostId());
        $host = $storage->find($host);

        if($host != null)
            Mailer::SendMail($host->Mail(), "Une bonne nouvelle à propos de la recette ".$recipe["name"], $user->Username()." a lancé une procédure de réservation relative à votre recette ".$recipe["name"].".");
        API::GenerateNotification($token, $item->HostId(), "success", $user->Username()." a lancé une procédure de réservation relative à votre recette ".$recipe["name"].".");

        if($guest != null)
            Mailer::SendMail($guest->Mail(), "A propos de la recette ".$recipe["name"], "Nous avons bien pris en compte votre réservation concernant la recette ".$recipe["name"].".");
    

        $item->setCreatedAt(time());

        return API::Add($token, $item);
    }

    private static function UpdateUserAsAdmin($token, $item)
    {
        API::Update($token, $item);
    }

    private static function UpdateUserAsSelf($token, $item, $current)
    {
        $item->setRights($current->Rights());
        $item->setBanned($current->Banned());
        API::Update($token, $item, false);
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

    public static function UpdateReport($token, $item)
    {
        $current = API::Auth($token);
        if($current->Rights() < 2)
            throw new Exception("Not Enough Power", 1);
        else
            API::Update($token, $item, false);
    }

    public static function RemoveRecipe($token, $id)
    {
        $reservations = API::GetAllReservation($token, '{ "Recipe_id" : "'.$id.'" }');
        foreach ($reservations as $reservation)
        {
            try {
                API::RefundOrCancelReservation($token, $reservation);
            }
            catch(Exception $e)
            {
                // On avale les exceptions
            }
        }
        API::Remove($token, "Recipe", $id);
    }


    public static function GetUser($token, $id, $hide = true)
    {
        $user = API::Get($token, "User", $id);
        if($user == null)
            return null;
        $current = null;
        if($token != null)
            $current = API::Auth($token);
        // Suppresion des données sensibles
        if($current == null || ($current->Id() != $user["id"] && $current->Rights() < 2 && $hide == true))
        {
            $user["phone"] = "";
            $user["mail"] = "";
        }

        $user["likes"] = 0;
        $user["comments"] = [];

        $user["comments"] = API::GetAllComment($token, '{ "target_id" : "'.$id.'" }');
        if($user["comments"] != null) {
            foreach ($user["comments"] as $comment) {
                $user["likes"] += intval($comment["note"]);
            }
            if (count($user["comments"]) > 0)
                $user["likes"] = floor($user["likes"] / count($user["comments"]));
        }
        return $user;
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
            $reservation["host"] = API::GetUser($token, $reservation["host_id"], false);
        }
        if($reservation["guest_id"] != "" && $reservation["guest_id"] != null)
        {
            $reservation["guest"] = API::GetUser($token,  $reservation["guest_id"], false);
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
        $reservations = API::GetAll($token, "Reservation", '{ "Recipe_id" : "'.$id.'" }');
        $recipe["reservations"] = $reservations;
        $recipe["users"] = array();
        foreach ($reservations as $reservation)
        {
            $user = API::GetUser($token, $reservation->GuestId());
            array_push($recipe["users"], $user);
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

    public static function GetAllRecipe($token, $filters = null)
    {
        //API::CheckRights($token, 1);
        $storage = Engine::Instance()->Persistence("DatabaseStorage");
        $items = null;
        $f = "";
        if($filters != null) {
            $filters=str_replace("\\","", $filters);
            $filters = get_object_vars(json_decode($filters));
            
            if(isset($filters["id"]))
            {
                if(is_array($filters["id"]))
                {
                    $f .= "id IN (".join(",",$filters["id"]).") AND ";
                }
            }

            if(isset($filters["origin"]))
            {
                $f .= "origin LIKE '%".$filters["origin"]."%' AND ";
            }
            if(isset($filters["date_start"]))
            {
                $f .= "date_end >= '".$filters["date_start"]."' AND ";
            }
            if(isset($filters["date_end"]))
            {
                $f .= "date_start <= '".$filters["date_end"]."' AND ";
            }
            if(isset($filters["geolocation"]))
            {
                $geolocation = explode(";",$filters["geolocation"]);
                $latitude = floatval($geolocation[0]);
                $longitude = floatval($geolocation[1]);
                $min_latitude = $latitude - 0.3;
                $max_latitude = $latitude + 0.3;
                $min_longitude = $longitude - 0.3;
                $max_longitude = $longitude + 0.3;
                $f .= "latitude >= '".$min_latitude."' AND ";
                $f .= "latitude <= '".$max_latitude."' AND ";
                $f .= "longitude >= '".$min_longitude."' AND ";
                $f .= "longitude <= '".$max_longitude."' AND ";
            }
            if(isset($filters["price_start"]))
            {
                $f .= "price >= '".$filters["price_start"]."' AND ";
            }
            if(isset($filters["price_end"]))
            {
                $f .= "price <= '".$filters["price_end"]."' AND ";
            }
            $f = substr($f,0, -4);
        }
        $storage->findAll("Recipe", $items, $f);

        $results = array();
        for($i =0; $i < count($items); $i++)
        {
            $recipe = get_object_vars($items[$i]);
            $recipe["user"] = API::GetUser($token, $recipe["User_id"]);
            $reservations = API::GetAll($token, "Reservation", '{ "Recipe_id" : "'.$recipe["id"].'" }');
            $recipe["users"] = array();
            foreach ($reservations as $reservation)
            {
                array_push($recipe["users"], $reservation->GuestId());
            }
            array_push($results, $recipe);
        }
        return $results;
    }

    public static function GetAllComment($token, $filters = null)
    {
        $comments = API::GetAll($token, "Comment", $filters);
        $results = array();
        for($i =0; $i < count($comments); $i++)
        {
            $comment = get_object_vars($comments[$i]);
            $comment["author"] = API::Get($token, "User", $comment["author_id"]);
            array_push($results, $comment);
        }
        return $results;
    }

    public static function GetAllUser($token, $filters = null)
    {
        $users = API::GetAll($token, "User", $filters);
        $results = array();
        for($i =0; $i < count($users); $i++)
        {
            $user = get_object_vars($users[$i]);
            $user["phone"] = "";
            $user["mail"] = "";
            $user["password"] = "";
            array_push($results, $user);
        }
        return $results;
    }

    public static function GetAllReport($token, $filters = null)
    {
        $reports = API::GetAll($token, "Report", $filters);
        $results = array();
        for($i =0; $i < count($reports); $i++)
        {
            $report = get_object_vars($reports[$i]);
            $report["author"] = API::Get($token, "User", $report["author_id"]);
            $report["target"] = API::Get($token, "User", $report["target_id"]);
            array_push($results, $report);
        }
        return $results;
    }

    public static function GetAllReservation($token, $filters = null)
    {
        //$current = API::Auth($token);
        $reservations = API::GetAll($token, "Reservation", $filters);
        $results = array();
        for($i =0; $i < count($reservations); $i++)
        {
            $reservation = get_object_vars($reservations[$i]);
            $reservation["recipe"] = API::Get($token, "Recipe", $reservation["Recipe_id"]);
            /* On ne retourne pas les réservations de recettes passées
            if(intval($reservation["recipe"]["date_end"]) < time() && $current->Rights() < 2)
                continue;*/
            $reservation["host"] = API::Get($token, "User",  $reservation["host_id"]);
            $reservation["guest"] = API::Get($token, "User",  $reservation["guest_id"]);

            array_push($results, $reservation);
        }
        return $results;
    }


    public static function GetAllPins($token, $filters = null)
    {
        return API::GetAll($token, "Pins", $filters, "ORDER BY name ASC");
    }
    
    public static function GetAllOrigin($token, $filters = null)
    {
        return API::GetAll($token, "Origin", $filters, "ORDER BY name ASC");
    }






}
