package h2ms.spring.mvc.domain;

import javax.persistence.*;
import java.io.Serializable;

//fixme design data model for all entities and attributes
@Entity
@Table(name = "doctor")
public class Doctor implements Serializable {

	private Long id;
	private String firstName;
	private String lastName;

	protected Doctor() {}

	public Doctor(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(name = "FIRST_NAME")
	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	@Column(name = "LAST_NAME")
	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
}
