package csd.adminmanagement.Model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultUpdateRequest {
    
    @JsonProperty("AS1")
    private double AS1;

    @JsonProperty("AS2")
    private double AS2;

}
