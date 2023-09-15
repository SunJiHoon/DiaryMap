package diaryMap.DiaryScape.web.obj3d;

import diaryMap.DiaryScape.domain.member.Member;
import diaryMap.DiaryScape.domain.obj3d.Obj3d;
import diaryMap.DiaryScape.web.login.LoginForm;
import diaryMap.DiaryScape.web.member.MemberWithoutId;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class Obj3dController {

    @GetMapping("/Obj")
    public ResponseEntity<String[]> getObj_string() {
        log.info("obj를 요청하는 query가 들어왔다.");


        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        /*

        tx.begin();
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
 */

        tx.begin();
        //찾기
        Obj3d obj3d = em.find(Obj3d.class, 1L);
        String[] strings = new String[1];
        strings[0] = obj3d.getJson_obj();
        tx.commit();
        em.close();
        emf.close();
        // 문자열 배열을 생성하거나 가져옵니다.

        // ResponseEntity를 사용하여 문자열 배열을 응답으로 반환합니다.
        return ResponseEntity.ok(strings);
    }

    @PostMapping("/Obj")//@Valid//@Valid @ModelAttribute //requestBody
    public ResponseEntity<String> registerObj(@RequestBody String str,
                                 BindingResult bindingResult,
                                 HttpServletResponse response) {
        log.info("obj를 등록해보자");
        log.info(str);

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        tx.begin();
        //추가

        Obj3d obj3d_1 = new Obj3d();
        obj3d_1.setObjName("축구공");
        obj3d_1.setJson_obj(str);

        em.persist(obj3d_1);
        tx.commit();
        em.close();
        emf.close();
        return ResponseEntity.ok("sucess");
    }
}
