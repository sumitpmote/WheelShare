package com.wheelshare.cabbooking.dto;

import lombok.Data;

@Data
public class EstimateFareDto {
    private Double sourceLat;
    private Double sourceLng;
    private String sourceAddress;
    private Double destinationLat;
    private Double destinationLng;
    private String destinationAddress;
}
