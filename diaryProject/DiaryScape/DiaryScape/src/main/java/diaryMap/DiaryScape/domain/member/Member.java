package diaryMap.DiaryScape.domain.member;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

//import javax.persistence.Id;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;

//@Entity
@Document(collection = "members")
@Data
public class Member {
    @Id //@GeneratedValue(strategy = GenerationType.AUTO)
    private String realid;
    private Long id;

    @NotEmpty
    private String loginId; //로그인 ID
    @NotEmpty
    private String name; //사용자 이름
    @NotEmpty
    private String password;

    @DBRef
    private ArrayList<Obj3d> obj3dArrayList;
}
