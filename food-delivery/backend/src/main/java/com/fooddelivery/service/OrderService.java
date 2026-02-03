package com.fooddelivery.service;

import com.fooddelivery.model.Order;
import com.fooddelivery.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> filterByPaidStatus(boolean isPaid) {
        return orderRepository.findByIsPaid(isPaid);
    }

    public List<Order> filterUnpaidWithinDistance(double maxDistance) {
        return orderRepository.findUnpaidOrdersWithinDistance(maxDistance);
    }

    public Optional<Order> assignDelivery(double maxDistance) {
        List<Order> candidates = orderRepository.findUnpaidOrdersWithinDistance(maxDistance);

        if (candidates.isEmpty()) {
            return Optional.empty(); 
        }

        Order nearest = candidates.get(0); 
        nearest.setPaid(true);          
        orderRepository.save(nearest);     

        return Optional.of(nearest);
    }
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }
}
