<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class EntryUpdate extends StorageItem
{

    /**
     * @Word
     * @Required
     * @Size(min=1,max=400)
     */
    public $reason;

    /**
     * @Required
     * @Numeric
     */
    public $date;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=400)
     */
    public $name;

    /**
     * @Required
     * @Numeric
     */
    public $gender;

    /**
     * @Word
     * @Size(min=1,max=400)
     */
    public $status;

    /**
     * @Word
     * @Size(min=1,max=1000)
     */
    public $mails;

    /**
     * @Word
     * @Size(min=1,max=1000)
     */
    public $phone;

    /**
     * @Word
     * @Size(min=1,max=1000)
     */
    public $phone_mobile;

    /**
     * @Word
     * @Size(min=1,max=400)
     */
    public $address;

    /**
     * @Word
     * @Size(min=1, max=100)
     */
    public $city;

    /**
     * @Word
     * @Size(min=1,max=20)
     */
    public $zip;

    /**
     * @Word
     * @Size(min=1,max=20)
     */
    public $country;

    /**
     * @Numeric
     */
    public $birthdate;


    /**
     * @Word
     * @Size(min=1,max=1000)
     */
    public $information;

    /**
     * @Word
     * @Size(min=1,max=1000)
     */
    public $tag;

    /**
     * @Required
     * @Numeric
     */
    public $Entry_id;

    /**
     * @Required
     * @Numeric
     */
    public $User_id;

    /**
     * @Numeric
     */
    public $Structure_id;

    /**
     * @return mixed
     */
    public function Reason()
    {
        return $this->reason;
    }

    /**
     * @param mixed $reason
     */
    public function setReason($reason)
    {
        $this->reason = $reason;
        $this->checkIntegrity("reason");
    }

    /**
     * @return mixed
     */
    public function Date()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
        $this->checkIntegrity("date");
    }

    /**
     * @return mixed
     */
    public function Name()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
        $this->checkIntegrity("name");
    }

    /**
     * @return mixed
     */
    public function Gender()
    {
        return $this->gender;
    }

    /**
     * @param mixed $gender
     */
    public function setGender($gender)
    {
        $this->gender = $gender;
        $this->checkIntegrity("gender");
    }

    /**
     * @return mixed
     */
    public function Status()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
        $this->checkIntegrity("status");
    }

    /**
     * @return mixed
     */
    public function Mails()
    {
        return $this->mails;
    }

    /**
     * @param mixed $mails
     */
    public function setMails($mails)
    {
        $this->mails = $mails;
        $this->checkIntegrity("mails");
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
    public function PhoneMobile()
    {
        return $this->phone_mobile;
    }

    /**
     * @param mixed $phone_mobile
     */
    public function setPhoneMobile($phone_mobile)
    {
        $this->phone_mobile = $phone_mobile;
        $this->checkIntegrity("phone_mobile");
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
    public function City()
    {
        return $this->city;
    }

    /**
     * @param mixed $city
     */
    public function setCity($city)
    {
        $this->city = $city;
        $this->checkIntegrity("city");
    }

    /**
     * @return mixed
     */
    public function Zip()
    {
        return $this->zip;
    }

    /**
     * @param mixed $zip
     */
    public function setZip($zip)
    {
        $this->zip = $zip;
        $this->checkIntegrity("zip");
    }

    /**
     * @return mixed
     */
    public function Country()
    {
        return $this->country;
    }

    /**
     * @param mixed $country
     */
    public function setCountry($country)
    {
        $this->country = $country;
        $this->checkIntegrity("country");
    }

    /**
     * @return mixed
     */
    public function Birthdate()
    {
        return $this->birthdate;
    }

    /**
     * @param mixed $birthdate
     */
    public function setBirthdate($birthdate)
    {
        $this->birthdate = $birthdate;
        $this->checkIntegrity("birthdate");
    }

    /**
     * @return mixed
     */
    public function Information()
    {
        return $this->information;
    }

    /**
     * @param mixed $information
     */
    public function setInformation($information)
    {
        $this->information = $information;
        $this->checkIntegrity("information");
    }

    /**
     * @return mixed
     */
    public function Tag()
    {
        return $this->tag;
    }

    /**
     * @param mixed $tag
     */
    public function setTag($tag)
    {
        $this->tag = $tag;
        $this->checkIntegrity("tag");
    }

    /**
     * @return mixed
     */
    public function EntryId()
    {
        return $this->Entry_id;
    }

    /**
     * @param mixed $Entry_id
     */
    public function setEntryId($Entry_id)
    {
        $this->Entry_id = $Entry_id;
        $this->checkIntegrity("Entry_id");
    }

    /**
     * @return mixed
     */
    public function UserId()
    {
        return $this->User_id;
    }

    /**
     * @param mixed $User_id
     */
    public function setUserId($User_id)
    {
        $this->User_id = $User_id;
        $this->checkIntegrity("User_id");
    }

    /**
     * @return mixed
     */
    public function StructureId()
    {
        return $this->Structure_id;
    }

    /**
     * @param mixed $Structure_id
     */
    public function setStructureId($Structure_id)
    {
        $this->Structure_id = $Structure_id;
        $this->checkIntegrity("Structure_id");
    }
    
    

}