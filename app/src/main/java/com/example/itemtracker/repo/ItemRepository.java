package com.example.itemtracker.repo;

import androidx.lifecycle.LiveData;
import com.example.itemtracker.db.*;
import java.util.List;

public class ItemRepository {
    private final ItemDao dao;
    public ItemRepository(ItemDao dao) { this.dao = dao; }
    public LiveData<List<ItemFull>> items() { return dao.getItemsFull(); }
    public LiveData<ItemFull> item(long id) { return dao.getItemFullById(id); }
    public long addItem(Item item, List<ExtraCost> costs, List<Attribute> attrs) {
        long id = dao.insertItem(item);
        if (costs != null) {
            for (ExtraCost c : costs) c.itemId = id;
            dao.insertCosts(costs);
        }
        if (attrs != null) {
            for (Attribute a : attrs) a.itemId = id;
            dao.insertAttributes(attrs);
        }
        return id;
    }
    public void retireItem(long id, long date) { dao.updateStatus(id, ItemStatus.RETIRED, date); }
}
