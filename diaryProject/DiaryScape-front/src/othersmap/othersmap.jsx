import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearUser } from '../reducer/user_slice';
import { selectTrip, clearTrip } from '../reducer/trip_slice';
import { selectStartnode, clearStartnode } from '../reducer/startnode_slice';
import { Box, Button, Heading, useDisclosure, IconButton } from '@chakra-ui/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../utility/client';
import axios from 'axios';
import { IoAdd, IoArrowForwardOutline, IoTrashOutline, IoSearch } from 'react-icons/io5';
import '../styles/animation.css';
import '../styles/custom.css';

const OthersMap = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.name);

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  const [reviewData, setReviewData] = useState([]);
  const [newReviewValue, setNewReviewValue] = useState([]);
  const [newReviewDateValue, setNewReviewDateValue] = useState(`${year}-${month}-${date}`);
  const [searchValue, setSearchValue] = useState('');
  const [searchResultData, setSearchResultData] = useState([]);
  const [startNodeSelected, setStartNodeSelected] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [searchResultDataLoading, setSearchResultDataLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    client.get('/api/obj/list/public').then((res) => {
      setReviewData(res.data);
    });
  }, []);

  const onReviewClicked = (review, readOnly = false) => {
    console.log(review);
    dispatch(
      selectTrip({
        title: review.title,
        mapId: review.mapId,
        startX: review.mapX,
        startY: review.mapY,
        date: review.visitDate,
        readOnly,
      })
    );
    dispatch(
      selectStartnode({
        reviewtitle: review.reviewtitle,
        mapId: review.mapId,
        contentId: review.contentId,
        contentTypeId: review.contentTypeId,
        title: review.title,
        tel: review.tel,
        mapx: review.mapX,
        mapy: review.mapY,
        relativeX: review.relativeX,
        relativeY: review.relativeY,
        addr1: review.addr1,
      })
    );
    navigate('/reviewspace');
  };

  const onNewReviewSubmit = useCallback((e) => {
    e.preventDefault();
    if (newReviewValue == '') {
      console.log('새 리뷰 제목 비어있음!');
      return;
    }
    if (!startNodeSelected) {
      console.log('시작 장소 선택되지 않음!');
      return;
    }
    const newReviewNameReplaced = newReviewValue.replace(/ /g, '%20');
    const addr1Replaced = selectedData.addr1.replace(/ /g, '%20');
    const telReplaced = selectedData.tel.replace(/ /g, '%20');
    const titleReplaced = selectedData.title.replace(/ /g, '%20');
    console.log(newReviewDateValue);
    client
      .post(
        '/api/obj/create?mapName=' +
          newReviewNameReplaced +
          '&date=' +
          newReviewDateValue +
          '&addr1=' +
          addr1Replaced +
          '&relativeX=' +
          selectedData.relativeX +
          '&relativeY=' +
          selectedData.relativeY +
          '&contentid=' +
          selectedData.contentid +
          '&contentTypeId=' +
          selectedData.contentTypeId +
          '&tel=' +
          telReplaced +
          '&title=' +
          titleReplaced +
          '&mapx=' +
          selectedData.mapx +
          '&mapy=' +
          selectedData.mapy,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        client.get('/api/obj/list').then((res) => {
          setReviewData(res.data);
        });
      });

    setNewReviewValue('');
    setStartNodeSelected(false);
    onClose();
  });

  return (
    <Box mt={2} p={4}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Box w="100%" maxW="500px" display="flex" justifyContent="flex-end">
          <Button
            size="sm"
            colorScheme="teal"
            variant="ghost"
            onClick={() => {
              navigate('/my_tripmap');
            }}
          >
            &gt; 나의 여행 맵으로 돌아가기
          </Button>
        </Box>
      </Box>

      <Heading as="h2" size="xl" mb={6}>
        다른 유저의 여행들
      </Heading>

      {/* <Button w="100%" maxW="500px" mb={6} onClick={() => dispatch(clearUser())}>
        로그아웃
      </Button> */}

      <Box>
        <Box display="flex" justifyContent="center" mb={10}>
          <Box w="100%" maxW="500px" display="flex" flexDirection="column">
            {/* <Box fontSize="1.8em" mb={4}>여행 리스트</Box> */}
            {console.log(reviewData)}
            {reviewData.map((review, i) => (
              <Box
                key={review.mapId}
                display="flex"
                mb={6}
                _hover={{
                  transform: 'scale(1.15)',
                }}
                transition="all .3s"
                // animation={`1s linear ${1 * (i+1)}s initial-down`}
              >
                <Box
                  display="flex"
                  w="100%"
                  justifyContent="space-between"
                  p={2}
                  border="2px"
                  borderRadius={4}
                  borderColor="gray.300"
                >
                  <Box w="100%" display="flex" flexDirection="column" justifyContent="center">
                    <Box fontWeight="semibold" fontSize="1.6em" mb={1}>
                      {review.reviewtitle}
                    </Box>
                    <Box fontSize="1.2em" mb={4}>
                      {review.visitDate}
                    </Box>

                    <Box display="flex" justifyContent="center" fontSize="1.3em" mb={1}>
                      <Box>작성자 :</Box>
                      <Box fontWeight="semibold">{review.userName}</Box>
                    </Box>
                  </Box>
                  <Box
                    w="52px"
                    mr={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <IconButton
                      icon={<IoArrowForwardOutline />}
                      mb={2}
                      colorScheme="blue"
                      onClick={(e) => onReviewClicked(review, true)}
                    />
                    {/* <IconButton
                      icon={<IoArrowForwardOutline />}
                      mb={1}
                      colorScheme="teal"
                      onClick={(e) => onReviewClicked(review)}
                    /> */}
                    <IconButton
                      icon={<IoTrashOutline />}
                      onClick={() => {
                        client.post('api/obj/delete?mapId=' + review.mapId).then((res) => {
                          console.log('삭제됨');
                          client.get('/api/obj/list').then((res) => {
                            setReviewData(res.data);
                          });
                        });
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
            {reviewData.length == 0 && <p>새 여행을 작성해주세요!</p>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OthersMap;
