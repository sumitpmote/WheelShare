package com.wheelshare.cabbooking.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RideRequestDto {
    private Double sourceLat;
    private Double sourceLng;
    private String sourceAddress;
    private Double destinationLat;
    private Double destinationLng;
    private String destinationAddress;
    private BigDecimal estimatedFare;
}
