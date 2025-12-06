package com.coursevibe.instruments.service;

import com.coursevibe.instruments.entity.MusicalInstrument;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MusicalInstrumentSpecifications {
    
    public static Specification<MusicalInstrument> withFilters(
            String type,
            String brand,
            String name,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            LocalDate startDate,
            LocalDate endDate,
            String conditionStatus) {
        
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            
            if (brand != null && !brand.isEmpty()) {
                predicates.add(cb.equal(root.get("brand"), brand));
            }
            
            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("currentValue"), minPrice));
            }
            
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("currentValue"), maxPrice));
            }
            
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("purchaseDate"), startDate));
            }
            
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("purchaseDate"), endDate));
            }
            
            if (conditionStatus != null && !conditionStatus.isEmpty()) {
                predicates.add(cb.equal(root.get("conditionStatus"), conditionStatus));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}





