package edu.harvard.h2ms.service;

import static java.lang.Boolean.TRUE;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

import edu.harvard.h2ms.domain.core.Tag;
import edu.harvard.h2ms.repository.TagRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest
public class TagServiceTests {

  @Autowired private TagRepository tagRepository;

  @Before
  public void setup() {
    Tag tag = new Tag();
    tag.setBitFormat("bitformat");
    tag.setColor("black");
    tag.setId(1L);
    tag.setOrderNumber(42345235);
    tag.setLaserEngraved(TRUE);
    tag.setSku("S564360KF");
    tagRepository.save(tag);
  }

  @Test
  public void whenFindById_thenReturnTag() {
    Tag found = tagRepository.findOne(1L);
    assertThat(found, is(found));
  }
}
