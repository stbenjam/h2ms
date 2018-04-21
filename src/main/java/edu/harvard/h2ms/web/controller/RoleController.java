package edu.harvard.h2ms.web.controller;

import edu.harvard.h2ms.domain.core.Role;
import edu.harvard.h2ms.service.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/roles")
public class RoleController {

  final Logger log = LoggerFactory.getLogger(RoleController.class);

  @Autowired private RoleService roleService;

  @PreAuthorize("hasRole('ADMIN')")
  @RequestMapping(value = "/", method = RequestMethod.POST)
  @ResponseBody
  public Role createRole(@RequestBody Role resource) {
    return roleService.save(resource);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @RequestMapping(value = "/delete", method = RequestMethod.POST)
  @ResponseBody
  public void deleteRole(@RequestBody Role resource) {
    roleService.delete(resource);
  }
}
