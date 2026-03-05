package com.wheelshare.cabbooking.helper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class FareHelper {

    @Value("${fare.base-fare:50}")
    private BigDecimal baseFare;

    @Value("${fare.per-km-rate:15}")
    private BigDecimal perKmRate;

    @Value("${commission.driver-percent:10}")
    private BigDecimal commissionPercent;

    public BigDecimal calculateEstimatedFare(double distanceKm) {
        return baseFare.add(perKmRate.multiply(BigDecimal.valueOf(distanceKm)));
    }

    public BigDecimal calculateDriverEarning(BigDecimal estimatedFare) {
        BigDecimal commission = estimatedFare.multiply(commissionPercent).divide(BigDecimal.valueOf(100));
        return estimatedFare.subtract(commission);
    }
}
