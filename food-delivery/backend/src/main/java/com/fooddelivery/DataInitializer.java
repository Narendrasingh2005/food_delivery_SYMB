package com.fooddelivery;

import com.fooddelivery.model.Order;
import com.fooddelivery.repository.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OrderRepository orderRepository;

    public DataInitializer(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        orderRepository.save(new Order("Pizza Palace",  3, false, 2.5));
        orderRepository.save(new Order("Burger Barn",   5, false, 7.2));
        orderRepository.save(new Order("Sushi Stop",    2, true,  4.1));
        orderRepository.save(new Order("Taco Town",     4, false, 11.0));
        orderRepository.save(new Order("Noodle Nest",   1, false, 5.8));
        orderRepository.save(new Order("Salad Garden",  2, true,  3.3));

        System.out.println(">> Sample orders loaded successfully.");
    }
}
