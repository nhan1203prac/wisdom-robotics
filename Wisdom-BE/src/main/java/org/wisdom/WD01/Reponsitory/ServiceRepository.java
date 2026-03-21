package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.wisdom.WD01.Entity.ServiceEntity;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    // =====================================
    // SEARCH SERVICE BY NAME OR DESCRIPTION
    // =====================================
    @Query("""
SELECT s
FROM ServiceEntity s
WHERE LOWER(s.serviceName) LIKE LOWER(CONCAT('%', :keyword, '%'))
   OR s.description LIKE CONCAT('%', :keyword, '%')
ORDER BY s.id DESC
""")
    List<ServiceEntity> search(@Param("keyword") String keyword);


    // =====================================
    // GET ALL SERVICES WITH COMPANY
    // tránh lỗi LazyInitialization
    // =====================================
    @Query("""
            SELECT s
            FROM ServiceEntity s
            LEFT JOIN FETCH s.company
           """)
    List<ServiceEntity> findAllWithCompany();


    // =====================================
    // SEARCH SERVICE BY CATEGORY
    // =====================================
    List<ServiceEntity> findByCategory_Id(Long categoryId);

    @Query("""
        SELECT s
        FROM ServiceEntity s
        ORDER BY s.viewCount DESC
       """)
    List<ServiceEntity> findPopularServices();

    @Query("""
        SELECT s
        FROM ServiceEntity s
        ORDER BY s.ratingAvg DESC
       """)
    List<ServiceEntity> findTopRatedServices();

    @Query("""
        SELECT s
        FROM ServiceEntity s
        ORDER BY s.createdAt DESC
       """)
    List<ServiceEntity> findLatestServices();

}