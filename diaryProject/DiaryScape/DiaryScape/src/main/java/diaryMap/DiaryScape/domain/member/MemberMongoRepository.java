package diaryMap.DiaryScape.domain.member;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberMongoRepository extends MongoRepository<Member, String> {
    public List<Member> findByName(String name);
    public List<Member> findByLoginId(String loginId);


}
