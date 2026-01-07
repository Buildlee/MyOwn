package com.example.itemtracker.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Transaction;
import androidx.room.Update;
import java.util.List;

@Dao
public interface ItemDao {
    @Transaction
    @Query("SELECT * FROM items ORDER BY purchaseDate DESC")
    LiveData<List<ItemFull>> getItemsFull();

    @Transaction
    @Query("SELECT * FROM items WHERE id=:id")
    LiveData<ItemFull> getItemFullById(long id);

    @Insert
    long insertItem(Item item);

    @Insert
    void insertCosts(List<ExtraCost> costs);

    @Insert
    void insertAttributes(List<Attribute> attrs);

    @Update
    void updateItem(Item item);

    @Query("UPDATE items SET status=:status, retireDate=:retireDate WHERE id=:id")
    void updateStatus(long id, ItemStatus status, Long retireDate);

    @Query("DELETE FROM items WHERE id=:id")
    void deleteItem(long id);
}
