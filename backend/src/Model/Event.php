<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Event extends StorageItem
{

    /**
     * @Required
     * @Word
     * @Size(min=1,max=400)
     */
    public $name;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=1000)
     */
    public $description;

    /**
     * @Required
     * @Numeric
     */
    public $date_start;

    /**
     * @Required
     * @Numeric
     */
    public $date_end;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=400)
     */
    public $address;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=100)
     */
    public $city;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=20)
     */
    public $zip;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=20)
     */
    public $country;

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
    public function DateStart()
    {
        return $this->date_start;
    }

    /**
     * @param mixed $date_start
     */
    public function setDateStart($date_start)
    {
        $this->date_start = $date_start;
        $this->checkIntegrity("date_start");
    }

    /**
     * @return mixed
     */
    public function DateEnd()
    {
        return $this->date_end;
    }

    /**
     * @param mixed $date_end
     */
    public function setDateEnd($date_end)
    {
        $this->date_end = $date_end;
        $this->checkIntegrity("date_end");
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
    
    
}