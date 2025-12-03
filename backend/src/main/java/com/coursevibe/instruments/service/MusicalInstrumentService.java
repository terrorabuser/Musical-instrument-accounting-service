package com.coursevibe.instruments.service;

import com.coursevibe.instruments.config.SecurityUtils;
import com.coursevibe.instruments.dto.MusicalInstrumentDTO;
import com.coursevibe.instruments.entity.MusicalInstrument;
import com.coursevibe.instruments.entity.User;
import com.coursevibe.instruments.repository.MusicalInstrumentRepository;
import com.coursevibe.instruments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MusicalInstrumentService {
    
    private final MusicalInstrumentRepository repository;
    private final UserRepository userRepository;
    
    @Autowired
    public MusicalInstrumentService(MusicalInstrumentRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }
    
    public MusicalInstrumentDTO create(MusicalInstrumentDTO dto) {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) {
            throw new AccessDeniedException("Authentication required");
        }
        
        User owner = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (dto.getSerialNumber() != null && !dto.getSerialNumber().isEmpty()) {
            repository.findBySerialNumber(dto.getSerialNumber())
                .ifPresent(instrument -> {
                    throw new RuntimeException("Instrument with serial number " + dto.getSerialNumber() + " already exists");
                });
        }
        
        MusicalInstrument instrument = convertToEntity(dto);
        instrument.setOwner(owner);
        MusicalInstrument saved = repository.save(instrument);
        return convertToDTO(saved);
    }
    
    public MusicalInstrumentDTO update(Long id, MusicalInstrumentDTO dto) {
        MusicalInstrument instrument = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Instrument not found with id: " + id));
        
        String username = SecurityUtils.getCurrentUsername();
        if (username == null || !instrument.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException("Only the owner can update this instrument");
        }
        
        if (dto.getSerialNumber() != null && !dto.getSerialNumber().isEmpty()) {
            repository.findBySerialNumber(dto.getSerialNumber())
                .filter(i -> !i.getId().equals(id))
                .ifPresent(i -> {
                    throw new RuntimeException("Serial number already exists");
                });
        }
        
        instrument.setName(dto.getName());
        instrument.setType(dto.getType());
        instrument.setBrand(dto.getBrand());
        instrument.setModel(dto.getModel());
        instrument.setPurchasePrice(dto.getPurchasePrice());
        instrument.setCurrentValue(dto.getCurrentValue());
        instrument.setPurchaseDate(dto.getPurchaseDate());
        instrument.setConditionStatus(dto.getConditionStatus());
        instrument.setDescription(dto.getDescription());
        instrument.setSerialNumber(dto.getSerialNumber());
        
        if (dto.getImageBase64() != null) {
            if (dto.getImageBase64().isEmpty() || "null".equals(dto.getImageBase64())) {
                instrument.setImageData(null);
                instrument.setImageContentType(null);
            } else {
                try {
                    String base64Data = dto.getImageBase64();
                    if (base64Data.contains(",")) {
                        base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
                    }
                    instrument.setImageData(Base64.getDecoder().decode(base64Data));
                    instrument.setImageContentType(dto.getImageContentType());
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid base64 image data", e);
                }
            }
        }
        
        MusicalInstrument updated = repository.save(instrument);
        return convertToDTO(updated);
    }
    
    @Transactional(readOnly = true)
    public MusicalInstrumentDTO findById(Long id) {
        MusicalInstrument instrument = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Instrument not found with id: " + id));
        return convertToDTO(instrument);
    }
    
    @Transactional(readOnly = true)
    public Page<MusicalInstrumentDTO> findAll(
            String type,
            String brand,
            String name,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            LocalDate startDate,
            LocalDate endDate,
            String conditionStatus,
            int page,
            int size,
            String sortBy,
            String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Specification<MusicalInstrument> spec = MusicalInstrumentSpecifications.withFilters(
            type, brand, name, minPrice, maxPrice, startDate, endDate, conditionStatus
        );
        
        Page<MusicalInstrument> instruments = repository.findAll(spec, pageable);
        return instruments.map(this::convertToDTO);
    }
    
    @Transactional(readOnly = true)
    public List<MusicalInstrumentDTO> findAll() {
        return repository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MusicalInstrumentDTO> findByType(String type) {
        return repository.findByType(type).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MusicalInstrumentDTO> findByBrand(String brand) {
        return repository.findByBrand(brand).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<String> findAllTypes() {
        return repository.findAll().stream()
            .map(MusicalInstrument::getType)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<String> findAllBrands() {
        return repository.findAll().stream()
            .map(MusicalInstrument::getBrand)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
    
    public void delete(Long id) {
        MusicalInstrument instrument = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Instrument not found with id: " + id));
        
        String username = SecurityUtils.getCurrentUsername();
        if (username == null || !instrument.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException("Only the owner can delete this instrument");
        }
        
        repository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public BigDecimal getTotalValue() {
        BigDecimal total = repository.calculateTotalValue();
        return total != null ? total : BigDecimal.ZERO;
    }
    
    @Transactional(readOnly = true)
    public BigDecimal getAverageValue() {
        BigDecimal average = repository.calculateAverageValue();
        return average != null ? average : BigDecimal.ZERO;
    }
    
    private MusicalInstrument convertToEntity(MusicalInstrumentDTO dto) {
        MusicalInstrument instrument = new MusicalInstrument();
        instrument.setName(dto.getName());
        instrument.setType(dto.getType());
        instrument.setBrand(dto.getBrand());
        instrument.setModel(dto.getModel());
        instrument.setPurchasePrice(dto.getPurchasePrice());
        instrument.setCurrentValue(dto.getCurrentValue());
        instrument.setPurchaseDate(dto.getPurchaseDate());
        instrument.setConditionStatus(dto.getConditionStatus());
        instrument.setDescription(dto.getDescription());
        instrument.setSerialNumber(dto.getSerialNumber());
        
        if (dto.getImageBase64() != null && !dto.getImageBase64().isEmpty()) {
            try {
                String base64Data = dto.getImageBase64();
                if (base64Data.contains(",")) {
                    base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
                }
                instrument.setImageData(Base64.getDecoder().decode(base64Data));
                instrument.setImageContentType(dto.getImageContentType());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid base64 image data", e);
            }
        }
        
        return instrument;
    }
    
    private MusicalInstrumentDTO convertToDTO(MusicalInstrument instrument) {
        MusicalInstrumentDTO dto = new MusicalInstrumentDTO();
        dto.setId(instrument.getId());
        dto.setName(instrument.getName());
        dto.setType(instrument.getType());
        dto.setBrand(instrument.getBrand());
        dto.setModel(instrument.getModel());
        dto.setPurchasePrice(instrument.getPurchasePrice());
        dto.setCurrentValue(instrument.getCurrentValue());
        dto.setPurchaseDate(instrument.getPurchaseDate());
        dto.setConditionStatus(instrument.getConditionStatus());
        dto.setDescription(instrument.getDescription());
        dto.setSerialNumber(instrument.getSerialNumber());
        
        if (instrument.getOwner() != null) {
            dto.setOwnerId(instrument.getOwner().getId());
            dto.setOwnerNickname(instrument.getOwner().getNickname());
        }
        
        if (instrument.getImageData() != null && instrument.getImageData().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(instrument.getImageData());
            String contentType = instrument.getImageContentType() != null ? instrument.getImageContentType() : "image/jpeg";
            dto.setImageBase64("data:" + contentType + ";base64," + base64Image);
            dto.setImageContentType(contentType);
        }
        
        return dto;
    }
}


