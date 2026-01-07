package com.example.itemtracker.ui;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;
import com.example.itemtracker.R;
import com.example.itemtracker.db.AppDatabase;
import com.example.itemtracker.db.Item;
import com.example.itemtracker.db.ItemStatus;
import com.example.itemtracker.repo.ItemRepository;
import java.util.ArrayList;

public class AddItemFragment extends Fragment {
    public AddItemFragment() { super(R.layout.fragment_add_item); }
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        view.findViewById(R.id.btn_save).setOnClickListener(v -> save());
    }
    private void save() {
        ItemRepository repo = new ItemRepository(AppDatabase.get(requireContext()).itemDao());
        Item item = new Item();
        item.name = ((EditText) requireView().findViewById(R.id.input_name)).getText().toString();
        item.brand = ((EditText) requireView().findViewById(R.id.input_brand)).getText().toString();
        item.category = ((EditText) requireView().findViewById(R.id.input_category)).getText().toString();
        String priceText = ((EditText) requireView().findViewById(R.id.input_price)).getText().toString();
        item.purchasePrice = priceText.isEmpty() ? 0.0 : Double.parseDouble(priceText);
        item.purchaseDate = System.currentTimeMillis();
        item.status = ItemStatus.OWNED_NORMAL;
        item.note = ((EditText) requireView().findViewById(R.id.input_note)).getText().toString();
        repo.addItem(item, new ArrayList<>(), new ArrayList<>());
        NavHostFragment.findNavController(this).popBackStack();
    }
}
