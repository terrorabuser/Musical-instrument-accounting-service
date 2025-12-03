package com.coursevibe.instruments.repository;

import com.coursevibe.instruments.entity.MusicalInstrument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MusicalInstrumentRepository extends JpaRepository<MusicalInstrument, Long>, JpaSpecificationExecutor<MusicalInstrument> {
    
    Optional<MusicalInstrument> findBySerialNumber(String serialNumber);
    
    List<MusicalInstrument> findByType(String type);
    
    List<MusicalInstrument> findByBrand(String brand);
    
    @Query("SELECT SUM(i.currentValue) FROM MusicalInstrument i")
    BigDecimal calculateTotalValue();
    
    @Query("SELECT AVG(i.currentValue) FROM MusicalInstrument i")
    BigDecimal calculateAverageValue();
    
    Page<MusicalInstrument> findByType(String type, Pageable pageable);
    
    Page<MusicalInstrument> findByBrand(String brand, Pageable pageable);
    
    Page<MusicalInstrument> findByTypeAndBrand(String type, String brand, Pageable pageable);
    
    Page<MusicalInstrument> findByCurrentValueBetween(BigDecimal minValue, BigDecimal maxValue, Pageable pageable);
    
    Page<MusicalInstrument> findByPurchaseDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    Page<MusicalInstrument> findByNameContainingIgnoreCase(String name, Pageable pageable);
}


