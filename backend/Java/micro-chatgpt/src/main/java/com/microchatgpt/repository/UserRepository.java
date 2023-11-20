package com.microchatgpt.repository;

import com.microchatgpt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 *
 * User Repository
 *
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

}
