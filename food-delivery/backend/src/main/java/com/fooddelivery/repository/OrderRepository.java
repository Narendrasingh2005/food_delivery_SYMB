package com.fooddelivery.repository;

import com.fooddelivery.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByIsPaidFalse();

    List<Order> findByIsPaid(boolean isPaid);

    @Query("SELECT o FROM Order o WHERE o.isPaid = false AND o.deliveryDistance <= :maxDistance ORDER BY o.deliveryDistance ASC")
    List<Order> findUnpaidOrdersWithinDistance(@Param("maxDistance") double maxDistance);

    @Query("SELECT o FROM Order o WHERE o.isPaid = false AND o.deliveryDistance <= :maxDistance ORDER BY o.deliveryDistance ASC")
    Optional<Order> findNearestUnpaidOrder(@Param("maxDistance") double maxDistance);
}
