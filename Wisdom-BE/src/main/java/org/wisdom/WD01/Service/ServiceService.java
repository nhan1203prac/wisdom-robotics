package org.wisdom.WD01.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Entity.Company;
import org.wisdom.WD01.Entity.ServiceEntity;
import org.wisdom.WD01.Entity.ServiceRating;
import org.wisdom.WD01.Reponsitory.CompanyRepository;
import org.wisdom.WD01.Reponsitory.ServiceRatingRepository;
import org.wisdom.WD01.Reponsitory.ServiceRepository;

import java.math.BigDecimal;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;
    private final ServiceRatingRepository serviceRatingRepository;

    // =====================================
    // GET ALL SERVICES
    // =====================================
    public List<ServiceEntity> getAll() {
        return serviceRepository.findAllWithCompany();
    }

    // =====================================
    // GET SERVICE DETAIL + VIEW COUNT
    // =====================================
    @Transactional
    public ServiceEntity getById(Long id) {

        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Integer view = service.getViewCount();

        if (view == null) {
            view = 0;
        }

        service.setViewCount(view + 1);

        return serviceRepository.save(service);
    }

    // =====================================
    // UPDATE SERVICE
    // =====================================
    public ServiceEntity update(Long id, ServiceEntity newService) {

        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setServiceName(newService.getServiceName());
        service.setDescription(newService.getDescription());
        service.setCategory(newService.getCategory());
        service.setBasePrice(newService.getBasePrice());
        service.setThumbnail(newService.getThumbnail());
        service.setCompany(newService.getCompany());

        return serviceRepository.save(service);
    }

    // =====================================
    // DELETE SERVICE
    // =====================================
    public void delete(Long id) {

        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        serviceRepository.delete(service);
    }

    // =====================================
    // SEARCH SERVICE + SEARCH COUNT
    // =====================================
    @Transactional
    public List<ServiceEntity> search(String keyword) {

        List<ServiceEntity> services = serviceRepository.search(keyword);

        services.forEach(service -> {

            Integer searchCount = service.getSearchCount();

            if (searchCount == null) {
                searchCount = 0;
            }

            service.setSearchCount(searchCount + 1);

            serviceRepository.save(service);
        });

        return services;
    }

    // =====================================
    // SEARCH SERVICE BY CATEGORY
    // =====================================
    public List<ServiceEntity> searchByCategory(Long categoryId) {
        return serviceRepository.findByCategory_Id(categoryId);
    }

    // =====================================
    // RATE SERVICE
    // =====================================
    @Transactional
    public void rateService(Long serviceId, int rating) {

        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        ServiceRating serviceRating = new ServiceRating();

        serviceRating.setService(service);
        serviceRating.setRating(rating);

        serviceRatingRepository.save(serviceRating);

        Double avg = serviceRatingRepository.getAverageRating(serviceId);

        int count = serviceRatingRepository.countByService_Id(serviceId);

        service.setRatingAvg(BigDecimal.valueOf(avg));
        service.setRatingCount(count);

        serviceRepository.save(service);
    }

    // ==========================
// POPULAR SERVICES
// ==========================
    public List<ServiceEntity> getPopularServices() {
        return serviceRepository.findPopularServices();
    }

    // ==========================
// TOP RATED SERVICES
// ==========================
    public List<ServiceEntity> getTopRatedServices() {
        return serviceRepository.findTopRatedServices();
    }

    // ==========================
// LATEST SERVICES
// ==========================
    public List<ServiceEntity> getLatestServices() {
        return serviceRepository.findLatestServices();
    }


    @Autowired
    private CompanyRepository companyRepository;

    public ServiceEntity create(ServiceEntity service){

        Company company = companyRepository.findById(1L).orElse(null);

        service.setCompany(company);

        return serviceRepository.save(service);
    }
}