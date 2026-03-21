package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.wisdom.WD01.Entity.ServiceRating;

public interface ServiceRatingRepository extends JpaRepository<ServiceRating, Long> {

    // =====================================
    // COUNT RATING BY SERVICE
    // =====================================
    int countByService_Id(Long serviceId);


    // =====================================
    // GET AVERAGE RATING
    // =====================================
    @Query("""
            SELECT AVG(r.rating)
            FROM ServiceRating r
            WHERE r.service.id = :serviceId
           """)
    Double getAverageRating(@Param("serviceId") Long serviceId);

}