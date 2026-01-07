package com.example.itemtracker.db;

import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.Index;
import androidx.room.PrimaryKey;

@Entity(tableName = "extra_costs",
        foreignKeys = @ForeignKey(entity = Item.class, parentColumns = "id", childColumns = "itemId", onDelete = ForeignKey.CASCADE),
        indices = {@Index("itemId")})
public class ExtraCost {
    @PrimaryKey(autoGenerate = true)
    public long id;
    public long itemId;
    public double amount;
    public String description;
    public long date;
}
