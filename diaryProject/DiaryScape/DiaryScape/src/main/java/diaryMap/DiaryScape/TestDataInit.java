package diaryMap.DiaryScape;

import diaryMap.DiaryScape.domain.item.Item;
import diaryMap.DiaryScape.domain.item.ItemRepository;
import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.member.MemberRepository;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;


@Component
@RequiredArgsConstructor
public class TestDataInit {

    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;

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


        //
        /*
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");

        EntityManager em = emf.createEntityManager();

        EntityTransaction tx = em.getTransaction();
        tx.begin();
        //추가
        Member member1 = new Member();
        member1.setLoginId("test");
        member1.setPassword("test!");
        member1.setName("테스터");
        em.persist(member1);

        Member member2 = new Member();
        member2.setLoginId("2");
        member2.setPassword("2!");
        member2.setName("2");
        em.persist(member2);

        Obj3d obj3d_1 = new Obj3d();
        obj3d_1.setObjName("축구공");

        obj3d_1.setJson_obj("{\n" +
                "    \"metadata\": {\n" +
                "        \"version\": 4.6,\n" +
                "        \"type\": \"Object\",\n" +
                "        \"generator\": \"Object3D.toJSON\"\n" +
                "    },\n" +
                "    \"geometries\": [\n" +
                "        {\n" +
                "            \"uuid\": \"d19b4909-73f9-4460-9b71-0be7ef41d770\",\n" +
                "            \"type\": \"PlaneGeometry\",\n" +
                "            \"width\": 2,\n" +
                "            \"height\": 3,\n" +
                "            \"widthSegments\": 1,\n" +
                "            \"heightSegments\": 1\n" +
                "        },\n" +
                "        {\n" +
                "            \"uuid\": \"bcdd51ef-7bfb-4e06-9c54-3a8726c56a12\",\n" +
                "            \"type\": \"CircleGeometry\",\n" +
                "            \"radius\": 1.5,\n" +
                "            \"segments\": 32,\n" +
                "            \"thetaStart\": 0,\n" +
                "            \"thetaLength\": 6.283185307179586\n" +
                "        }\n" +
                "    ],\n" +
                "    \"materials\": [\n" +
                "        {\n" +
                "            \"uuid\": \"4ffe05b0-07d6-43c3-a2dd-97c2bf96bb61\",\n" +
                "            \"type\": \"MeshBasicMaterial\",\n" +
                "            \"color\": 255,\n" +
                "            \"reflectivity\": 1,\n" +
                "            \"refractionRatio\": 0.98,\n" +
                "            \"depthFunc\": 3,\n" +
                "            \"depthTest\": true,\n" +
                "            \"depthWrite\": true,\n" +
                "            \"colorWrite\": true,\n" +
                "            \"stencilWrite\": false,\n" +
                "            \"stencilWriteMask\": 255,\n" +
                "            \"stencilFunc\": 519,\n" +
                "            \"stencilRef\": 0,\n" +
                "            \"stencilFuncMask\": 255,\n" +
                "            \"stencilFail\": 7680,\n" +
                "            \"stencilZFail\": 7680,\n" +
                "            \"stencilZPass\": 7680\n" +
                "        }\n" +
                "    ],\n" +
                "    \"object\": {\n" +
                "        \"uuid\": \"d20d3da9-f67f-4806-ab65-f03a19d42430\",\n" +
                "        \"type\": \"Scene\",\n" +
                "        \"layers\": 1,\n" +
                "        \"matrix\": [\n" +
                "            1,\n" +
                "            0,\n" +
                "            0,\n" +
                "            0,\n" +
                "            0,\n" +
                "            1,\n" +
                "            0,\n" +
                "            0,\n" +
                "            0,\n" +
                "            0,\n" +
                "            1,\n" +
                "            0,\n" +
                "            0,\n" +
                "            0,\n" +
                "            0,\n" +
                "            1\n" +
                "        ],\n" +
                "        \"up\": [\n" +
                "            0,\n" +
                "            1,\n" +
                "            0\n" +
                "        ],\n" +
                "        \"children\": [\n" +
                "            {\n" +
                "                \"uuid\": \"e492e968-2b4b-416b-a49e-4331143dadd0\",\n" +
                "                \"type\": \"AmbientLight\",\n" +
                "                \"layers\": 1,\n" +
                "                \"matrix\": [\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1\n" +
                "                ],\n" +
                "                \"up\": [\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0\n" +
                "                ],\n" +
                "                \"color\": 16777215,\n" +
                "                \"intensity\": 1\n" +
                "            },\n" +
                "            {\n" +
                "                \"uuid\": \"73722e99-a615-4a2b-a7fb-b966345c6d57\",\n" +
                "                \"type\": \"Mesh\",\n" +
                "                \"name\": \"plane\",\n" +
                "                \"layers\": 1,\n" +
                "                \"matrix\": [\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1\n" +
                "                ],\n" +
                "                \"up\": [\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0\n" +
                "                ],\n" +
                "                \"geometry\": \"d19b4909-73f9-4460-9b71-0be7ef41d770\",\n" +
                "                \"material\": \"4ffe05b0-07d6-43c3-a2dd-97c2bf96bb61\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"uuid\": \"db7a71fb-d4bd-4503-a25d-53693cd5eff4\",\n" +
                "                \"type\": \"Mesh\",\n" +
                "                \"layers\": 1,\n" +
                "                \"matrix\": [\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1\n" +
                "                ],\n" +
                "                \"up\": [\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0\n" +
                "                ],\n" +
                "                \"geometry\": \"bcdd51ef-7bfb-4e06-9c54-3a8726c56a12\",\n" +
                "                \"material\": \"4ffe05b0-07d6-43c3-a2dd-97c2bf96bb61\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"uuid\": \"73722e99-a615-4a2b-a7fb-b966345c6d57\",\n" +
                "                \"type\": \"Mesh\",\n" +
                "                \"name\": \"plane\",\n" +
                "                \"layers\": 1,\n" +
                "                \"matrix\": [\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    0,\n" +
                "                    1\n" +
                "                ],\n" +
                "                \"up\": [\n" +
                "                    0,\n" +
                "                    1,\n" +
                "                    0\n" +
                "                ],\n" +
                "                \"geometry\": \"d19b4909-73f9-4460-9b71-0be7ef41d770\",\n" +
                "                \"material\": \"4ffe05b0-07d6-43c3-a2dd-97c2bf96bb61\"\n" +
                "            }\n" +
                "        ]\n" +
                "    }\n" +
                "}");

        em.persist(obj3d_1);


        tx.commit();

        em.close();
        emf.close();
        //*/
    }

}