package edu.harvard.h2ms.service;

import edu.harvard.h2ms.domain.core.Role;

public interface RoleService {

  public Role save(Role role);

  public void delete(Role role);
}
