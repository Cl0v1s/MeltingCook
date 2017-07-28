<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class User extends StorageItem
{
    /**
     * @Word
     * @Size(min=1,max=100)
     * @Required
     */
    public $username;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=32)
     */
    public $password;


    /**
     * @Word
     * @Size(min=1, max=100)
     */
    public $picture;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=100)
     */
    public $geolocation;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=20)
     */
    public $phone;

    /**
     * @Boolean
     */
    public $banned;

    /**
     * @Numeric
     */
    public $rights;

    /**
     * @Word
     * @Size(min=1,max=1000)
     */
    public $discease;

    /**
     * @Word
     * @Size(min=1, max=1000)
     */
    public $preference;

    /**
     * @Word
     * @Size(min=1, max=400)
     */
    public $favorite;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=400)
     */
    public $mail;

    /**
     * @return mixed
     */
    public function Username()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
        $this->checkIntegrity("username");
    }

    /**
     * @return mixed
     */
    public function Password()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
        $this->checkIntegrity("password");
    }

    /**
     * @return mixed
     */
    public function Rights()
    {
        return $this->rights;
    }

    /**
     * @param mixed $rights
     */
    public function setRights($rights)
    {
        $this->rights = $rights;
        $this->checkIntegrity("rights");
    }

    /**
     * @return mixed
     */
    public function Picture()
    {
        return $this->picture;
    }

    /**
     * @param mixed $picture
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;
        $this->checkIntegrity("picture");
    }

    /**
     * @return mixed
     */
    public function Geolocation()
    {
        return $this->geolocation;
    }

    /**
     * @param mixed $geolocation
     */
    public function setGeolocation($geolocation)
    {
        $this->geolocation = $geolocation;
        $this->checkIntegrity("geolocation");

    }

    /**
     * @return mixed
     */
    public function Phone()
    {
        return $this->phone;
    }

    /**
     * @param mixed $phone
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        $this->checkIntegrity("phone");

    }

    /**
     * @return mixed
     */
    public function Banned()
    {
        return $this->banned;
    }

    /**
     * @param mixed $banned
     */
    public function setBanned($banned)
    {
        $this->banned = $banned;
        $this->checkIntegrity("banned");

    }

    /**
     * @return mixed
     */
    public function Discease()
    {
        return $this->discease;
    }

    /**
     * @param mixed $discease
     */
    public function setDiscease($discease)
    {
        $this->discease = $discease;
        $this->checkIntegrity("discease");

    }

    /**
     * @return mixed
     */
    public function Preference()
    {
        return $this->preference;
    }

    /**
     * @param mixed $preference
     */
    public function setPreference($preference)
    {
        $this->preference = $preference;
        $this->checkIntegrity("preference");

    }

    /**
     * @return mixed
     */
    public function Favorite()
    {
        return $this->favorite;
    }

    /**
     * @param mixed $favorite
     */
    public function setFavorite($favorite)
    {
        $this->favorite = $favorite;
        $this->checkIntegrity("favorite");

    }

    /**
     * @return mixed
     */
    public function Mail()
    {
        return $this->mail;
    }

    /**
     * @param mixed $mail
     */
    public function setMail($mail)
    {
        $this->mail = $mail;
        $this->checkIntegrity("mail");
    }





    public function checkAuth($token)
    {
        if(md5($this->username.$this->password) == $token)
            return true;
        return false;
    }
    
    
}
