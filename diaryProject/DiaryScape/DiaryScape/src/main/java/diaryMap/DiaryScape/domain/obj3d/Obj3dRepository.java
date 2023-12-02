package diaryMap.DiaryScape.domain.obj3d;

import diaryMap.DiaryScape.domain.member.Member;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Obj3dRepository extends MongoRepository<Obj3d, String> {
    void deleteById(String id);
    List<Obj3d> findAll(); // 모든 객체를 가져오는 메서드
}
