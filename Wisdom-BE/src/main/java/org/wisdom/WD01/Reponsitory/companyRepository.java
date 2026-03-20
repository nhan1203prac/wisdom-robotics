package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.Company;
import org.springframework.stereotype.Repository;

@Repository
public interface companyRepository extends JpaRepository<Company, Long> {

}