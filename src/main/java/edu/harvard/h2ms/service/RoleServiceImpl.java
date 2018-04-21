package edu.harvard.h2ms.service;

import edu.harvard.h2ms.domain.core.Role;
import edu.harvard.h2ms.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("roleService")
@Repository
@Transactional
public class RoleServiceImpl implements RoleService {

  final Logger log = LoggerFactory.getLogger(RoleServiceImpl.class);

  @Autowired private RoleRepository roleRepository;

  @Override
  public Role save(Role role) {
    return roleRepository.save(role);
  }

  @Override
  public void delete(Role role) {
    roleRepository.delete(role);
  }
}
