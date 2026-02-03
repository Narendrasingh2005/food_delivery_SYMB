package com.fooddelivery.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false)
    private String restaurantName;

    @Column(nullable = false)
    private int itemCount;

    @Column(nullable = false)
    private boolean isPaid;

    @Column(nullable = false)
    private double deliveryDistance; 

    public Order() {}

    public Order(String restaurantName, int itemCount, boolean isPaid, double deliveryDistance) {
        this.restaurantName = restaurantName;
        this.itemCount = itemCount;
        this.isPaid = isPaid;
        this.deliveryDistance = deliveryDistance;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }

    public double getDeliveryDistance() {
        return deliveryDistance;
    }

    public void setDeliveryDistance(double deliveryDistance) {
        this.deliveryDistance = deliveryDistance;
    }
}
