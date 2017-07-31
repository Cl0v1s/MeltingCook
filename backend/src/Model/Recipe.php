<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Recipe extends StorageItem
{
    /**
     * @Required
     * @Word
     * @Size(min=1, max=400)
     */
    public $name;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=1000)
     */
    public $description;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=100)
     */
    public $picture;

    /**
     * @Required
     * @Numeric
     */
    public $User_id;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=400)
     */
    public $origin;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=1000)
     */
    public $items;

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
     * @Numeric
     */
    public $price;

    /**
     * @Required
     * @Numeric
     */
    public $latitude;

    /**
     * @Required
     * @Numeric
     */
    public $longitude;

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
    public function Origin()
    {
        return $this->origin;
    }

    /**
     * @param mixed $origin
     */
    public function setOrigin($origin)
    {
        $this->origin = $origin;
        $this->checkIntegrity("origin");

    }

    /**
     * @return mixed
     */
    public function Items()
    {
        return $this->items;
    }

    /**
     * @param mixed $items
     */
    public function setItems($items)
    {
        $this->items = $items;
        $this->checkIntegrity("items");

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
    public function Price()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     */
    public function setPrice($price)
    {
        $this->price = $price;
        $this->checkIntegrity("price");
    }

    /**
     * @return mixed
     */
    public function Latitude()
    {
        return $this->latitude;
    }

    /**
     * @param mixed $latitude
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
        $this->checkIntegrity("latitude");
    }

    /**
     * @return mixed
     */
    public function Longitude()
    {
        return $this->longitude;
    }

    /**
     * @param mixed $longitude
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
        $this->checkIntegrity("longitude");

    }




    
    
    
}
