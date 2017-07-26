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
    
    
    
}
