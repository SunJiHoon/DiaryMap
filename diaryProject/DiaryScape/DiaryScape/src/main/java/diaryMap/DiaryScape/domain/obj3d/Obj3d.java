package diaryMap.DiaryScape.domain.obj3d;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Obj3d {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String objName;
    @Lob
    private String json_obj;
}
