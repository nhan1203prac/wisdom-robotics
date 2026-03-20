package org.wisdom.WD01.Service;

import org.springframework.stereotype.Service;
import org.wisdom.WD01.Dto.OrderItemRequest;
import org.wisdom.WD01.Dto.OrderRequest;
import org.wisdom.WD01.Entity.*;
import org.wisdom.WD01.Reponsitory.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final OrderStatusRepository statusRepository;
    private final OrderRepository orderRepository;

    public OrderService(UserRepository userRepository,
                        ServiceRepository serviceRepository,
                        OrderStatusRepository statusRepository,
                        OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.statusRepository = statusRepository;
        this.orderRepository = orderRepository;
    }

    public Order createOrder(OrderRequest request){

        User user = userRepository.findById(request.getUserId()).orElseThrow();

        OrderStatus status = statusRepository.findById(request.getStatusId()).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setStatus(status);
        order.setBookingDate(request.getBookingDate());

        List<OrderItem> items = new ArrayList<>();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest item : request.getItems()) {

            ServiceEntity service = serviceRepository.findById(item.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setService(service);
            orderItem.setQuantity(item.getQuantity());

            items.add(orderItem);
        }

        order.setItems(items);
        order.setTotalPrice(total);

        return orderRepository.save(order);
    }
}