package com.example.itemtracker.ui;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.itemtracker.domain.Calculations;
import com.example.itemtracker.domain.Summary;
import com.example.itemtracker.db.ItemFull;
import com.example.itemtracker.repo.ItemRepository;
import java.util.Collections;
import java.util.List;

public class ItemListViewModel extends ViewModel {
    private final ItemRepository repo;
    public final LiveData<List<ItemFull>> items;
    public final MutableLiveData<Summary> summary = new MutableLiveData<>();
    public ItemListViewModel(ItemRepository repo) {
        this.repo = repo;
        this.items = repo.items();
        this.items.observeForever(list -> {
            long now = System.currentTimeMillis();
            summary.postValue(Calculations.buildSummary(list == null ? Collections.emptyList() : list, now));
        });
    }
}
