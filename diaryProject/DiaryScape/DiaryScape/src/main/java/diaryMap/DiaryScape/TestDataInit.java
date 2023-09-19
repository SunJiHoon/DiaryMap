package diaryMap.DiaryScape;

import diaryMap.DiaryScape.domain.item.Item;
import diaryMap.DiaryScape.domain.item.ItemRepository;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.Arrays;
import java.util.List;


@Component
@RequiredArgsConstructor
@Slf4j
public class TestDataInit {
    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;
    private final MemberMongoRepository memberMongoRepository;

    /**
     * 테스트용 데이터 추가
     */
    @PostConstruct
    public void init() {
        itemRepository.save(new Item("itemA", 10000, 10));
        itemRepository.save(new Item("itemB", 20000, 20));


        Member member1 = new Member();
        member1.setLoginId("test");
        member1.setPassword("test!");
        member1.setName("테스터");
        memberRepository.save(member1);

        Member member2 = new Member();
        member2.setLoginId("2");
        member2.setPassword("2!");
        member2.setName("2");
        memberRepository.save(member2);

        Member member3 = new Member();
        member3.setLoginId("3");
        member3.setPassword("3!");
        member3.setName("3");
//        memberMongoRepository.save(member3);

        Member member4 = new Member();
        member4.setLoginId("4");
        member4.setPassword("4!");
        member4.setName("4");
//        memberMongoRepository.save(member4);

        //memberMongoRepository.insert(Arrays.asList(member3, member4));

        // get
        //List<Member> result = memberMongoRepository.findByName("4");
        //List<Member> result = memberMongoRepository.findBy()

        //log.info(result.toString());

    }

}