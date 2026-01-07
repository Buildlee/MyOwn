package com.example.itemtracker.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "items")
public class Item {
    @PrimaryKey(autoGenerate = true)
    public long id;
    @NonNull
    public String name;
    public String brand;
    public String category;
    public double purchasePrice;
    public long purchaseDate;
    @NonNull
    public ItemStatus status;
    public Long retireDate;
    public String imageUri;
    public String note;
}
