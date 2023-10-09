package diaryMap.DiaryScape;

import diaryMap.DiaryScape.domain.item.Item;
import diaryMap.DiaryScape.domain.item.ItemRepository;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberMongoRepository;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.domain.obj3d.Obj3dRepository;
import diaryMap.DiaryScape.source.StringSource;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Component
@RequiredArgsConstructor
@Slf4j
public class TestDataInit {
    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;
    private final MemberMongoRepository memberMongoRepository;
    private final Obj3dRepository obj3dRepository;

    /**
     * 테스트용 데이터 추가
     */
    //@PostConstruct
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



        //memer 3, 4를 mongoDB에 저장하는 코드
        //memberMongoRepository.insert(Arrays.asList(member3, member4));


        StringSource stringSource = new StringSource();

        Obj3d obj3d1 = new Obj3d();
        obj3d1.setObjName("부산탐방기");
        //obj3d1.setSceneJSON(stringSource.getJsonInitData());
        obj3dRepository.save(obj3d1);
        List<Member> findmemberlist = memberMongoRepository.findByName("3");
        if (findmemberlist.size() > 0) {
            if(findmemberlist.get(0).getObj3dArrayList() == null){
                findmemberlist.get(0).setObj3dArrayList(new ArrayList<>());
                findmemberlist.get(0).getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(findmemberlist.get(0));
            }
            else{
                findmemberlist.get(0).getObj3dArrayList().add(obj3d1);
                memberMongoRepository.save(findmemberlist.get(0));
            }
        }


        Obj3d obj3d2 = new Obj3d();
        obj3d2.setObjName("대구탐방기");
        //obj3d2.setSceneJSON(stringSource.getJsonInitData());
        //obj3d 1, 2를 mongoDB에 저장하는 코드
        //obj3dRepository.save(obj3d1);
        //obj3dRepository.save(obj3d2);


        // get
        //List<Member> result = memberMongoRepository.findByName("4");
        //List<Member> result = memberMongoRepository.findBy()

        //log.info(result.toString());

    }

}