package com.wheelshare.cabbooking.controller;

import com.wheelshare.cabbooking.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/public")
    public ResponseEntity<?> getPublicStats() {
        Map<String, Object> stats = statsService.getPublicStats();
        return ResponseEntity.ok(stats);
    }
}
