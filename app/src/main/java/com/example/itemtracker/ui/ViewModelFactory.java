package com.example.itemtracker.ui;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import com.example.itemtracker.repo.ItemRepository;

public class ViewModelFactory implements ViewModelProvider.Factory {
    private final ItemRepository repo;
    public ViewModelFactory(ItemRepository repo) { this.repo = repo; }
    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(ItemListViewModel.class)) {
            return (T) new ItemListViewModel(repo);
        }
        throw new IllegalArgumentException("Unknown ViewModel");
    }
}
