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
     * @Size(min=1, max=400)
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
     * @Word
     * @Size(min=1,max=1000)
     */
    public $pins;

    /**
     * @Required
     * @Number
     */
    public $age;

    /**
     * @Word
     * @Size(min=1, max=400)
     */
    public $banner;

    /**
     * @Required
     * @Word
     * @Size(min=50, max=1000)
     */
    public $description;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=400)
     */
    public $firstname;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=400)
     */
    public $lastname;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=1000)
     */
    public $address;

    /**
     * @Boolean
     */
    public $forgot_password;

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

    /**
     * @return mixed
     */
    public function Pins()
    {
        return $this->pins;
    }

    /**
     * @param mixed $pins
     */
    public function setPins($pins)
    {
        $this->pins = $pins;
        $this->checkIntegrity("pins");
    }

    /**
     * @return mixed
     */
    public function Age()
    {
        return $this->age;
    }

    /**
     * @param mixed $age
     */
    public function setAge($age)
    {
        $this->age = $age;
        $this->checkIntegrity("age");
    }

    /**
     * @return mixed
     */
    public function Banner()
    {
        return $this->banner;
    }

    /**
     * @param mixed $banner
     */
    public function setBanner($banner)
    {
        $this->banner = $banner;
        $this->checkIntegrity("banner");
    }

    /**
     * @return mixed
     */
    public function Description()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
        $this->checkIntegrity("description");
    }

    /**
     * @return mixed
     */
    public function Firstname()
    {
        return $this->firstname;
    }

    /**
     * @param mixed $firstname
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
        $this->checkIntegrity("firstname");
    }

    /**
     * @return mixed
     */
    public function Lastname()
    {
        return $this->lastname;
    }

    /**
     * @param mixed $lastname
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;
        $this->checkIntegrity("lastname");
    }

    /**
     * @return mixed
     */
    public function Address()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
        $this->checkIntegrity("address");
    }

    /**
     * @return mixed
     */
    public function ForgotPassword()
    {
        return $this->forgot_password;
    }

    /**
     * @param mixed $forgot_password
     */
    public function setForgotPassword($forgot_password)
    {
        $this->forgot_password = $forgot_password;
        $this->checkIntegrity("forgot_password");
    }








    public function checkAuth($token)
    {
        if(md5($this->username.$this->password) == $token)
            return true;
        return false;
    }
    
    
}
