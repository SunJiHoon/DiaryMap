package diaryMap.DiaryScape.domain.member;

import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberMongoRepository extends MongoRepository<Member, String> {
    public List<Member> findByName(String name);
    public List<Member> findByLoginId(String loginId);
    List<Member> findAll(); // 모든 객체를 가져오는 메서드
}
