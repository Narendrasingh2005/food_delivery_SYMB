package com.fooddelivery.controller;

import com.fooddelivery.model.Order;
import com.fooddelivery.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000") 
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order created = orderService.createOrder(order);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Fixed: Explicitly named the PathVariable "id"
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable(name = "id") Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Fixed: Added names to RequestParams to solve the IllegalArgumentException
    @GetMapping("/filter")
    public ResponseEntity<List<Order>> filterOrders(
            @RequestParam(name = "isPaid", required = false) Boolean isPaid,
            @RequestParam(name = "maxDistance", required = false) Double maxDistance) {

        List<Order> result = orderService.getAllOrders();

        // Use Streams to apply multiple filters dynamically
        if (isPaid != null) {
            result = result.stream()
                    .filter(o -> o.isPaid() == isPaid)
                    .toList();
        }

        if (maxDistance != null) {
            result = result.stream()
                    .filter(o -> o.getDeliveryDistance() <= maxDistance)
                    .toList();
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/assign")
    public ResponseEntity<Map<String, Object>> assignDelivery(@RequestBody Map<String, Double> body) {
        Double maxDistance = body.get("maxDistance");

        if (maxDistance == null || maxDistance < 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid maxDistance value"));
        }

        Optional<Order> assigned = orderService.assignDelivery(maxDistance);

        if (assigned.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Delivery assigned successfully",
                    "order", assigned.get()
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "message", "No order available"
            ));
        }
    }

    // Fixed: Explicitly named the PathVariable "id"
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable(name = "id") Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}