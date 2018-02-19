package h2ms.spring.mvc.domain;

import javax.persistence.*;
import java.io.Serializable;

//fixme design data model for all entities and attributes
@Entity
@Table(name = "location")
public class Location implements Serializable {

	private Long id;
	private String hospitalName;
	private String wardName;

	protected Location() {}
	
	public Location(String hospitalName, String wardName) {
		this.hospitalName = hospitalName;
		this.wardName     = wardName;
	}

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(name = "HOSPITAL_NAME")
	public String getHospitalName() {
		return hospitalName;
	}

	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}

	@Column(name = "WARD_NAME")
	public String getWardName() {
		return wardName;
	}

	public void setWardName(String wardName) {
		this.wardName = wardName;
	}

	
	
	

}
