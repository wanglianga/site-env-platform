package com.site.env.repository;

import com.site.env.entity.ConstructionSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConstructionSiteRepository extends JpaRepository<ConstructionSite, Long> {
    List<ConstructionSite> findByConstructionUnit(String constructionUnit);
}
