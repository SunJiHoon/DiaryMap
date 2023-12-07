import {
  Box,
  Button,
  IconButton,
  Checkbox,
  Select,
  Textarea,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  IoChevronUp,
  IoChevronDown,
  IoChevronForward,
  IoSearch,
  IoAdd,
  IoRemove,
  IoPencil,
  IoBook,
  IoChevronBack,
  IoHome,
} from 'react-icons/io5';

const RightBarPageDay = ({
  isReadonly,
  reviews,
  setReviews,
  nodeInfoData,
  setNodeInfoData,
  currentDay,
  setCurrentDay,
  dayCheckedList,
  setDayCheckedList,
  dayModuleList,
  setDayModuleList,
  dayMenuOpenList,
  setDayMenuOpenList,
  setOnPlusDay,
  reviewMenuOpen,
  setReviewMenuOpen,
  nextDayMenuId,
  setNextDayMenuId,
  getCurNodeRef,
  changeDayNodeIndexRef,
  saveReviewsInSaveManager,
  removeDayNodeRef,
}) => {
  const {
    isOpen: isNodeInfoOpen,
    onOpen: onNodeInfoOpen,
    onClose: onNodeInfoClose,
  } = useDisclosure();

  return (
    <>
      <Box fontSize="2xl" fontWeight="semibold" mb={2}>
        Day 정보
      </Box>
      <Box display="flex" mb={4}>
        <Box w="100%" mr={2} display="flex" alignItems="center">
          {/* <Box w="160px" fontWeight="semibold">편집할 Day</Box> */}
          <Select
            value={currentDay}
            onChange={(e) => {
              setCurrentDay(e.target.value);
              // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
              // dayManager.printStateData()
            }}
          >
            {dayModuleList.map((dayModule) => (
              <option key={'option' + dayModule.id} value={dayModule.id}>
                {' '}
                Day {dayModule.id}
              </option>
            ))}
          </Select>
        </Box>

        {!isReadonly && (
          <IconButton
            icon={<IoAdd />}
            colorScheme="teal"
            onClick={(e) => {
              let curNode;
              if (getCurNodeRef.current) {
                curNode = getCurNodeRef.current();
                // console.log(curNode);
              }
              setDayCheckedList([...dayCheckedList, true]);
              setDayMenuOpenList([...dayMenuOpenList, true]);
              setDayModuleList([...dayModuleList, { id: nextDayMenuId, data: [curNode.userData] }]);
              setCurrentDay(nextDayMenuId);
              setOnPlusDay(nextDayMenuId);
              // dayManager.plusDay() // 이렇게 하면 plusDay 내에서 이전 currentDay 값 참조하게 됨
              setNextDayMenuId(nextDayMenuId + 1);
            }}
          />
        )}
      </Box>
      <Box mb={6} pt={2} pb={4}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box fontSize="2xl">Day {currentDay}</Box>
          <Checkbox
            defaultChecked
            isChecked={dayCheckedList[currentDay - 1]}
            onChange={(e) => {
              const nextDayCheckedList = dayCheckedList.map((dayChecked, i) => {
                if (i + 1 == currentDay) {
                  return !dayChecked;
                } else {
                  return dayChecked;
                }
              });
              setDayCheckedList(nextDayCheckedList);
              // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
              // dayManager.printStateData()
            }}
          ></Checkbox>
        </Box>
        <Box border="2px" borderRadius={4} borderColor="gray.300" p={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box fontWeight="semibold">Day 정보</Box>
            <IconButton
              variant="ghost"
              colorScheme="blackAlpha"
              size="sm"
              icon={dayMenuOpenList[currentDay - 1] ? <IoRemove /> : <IoChevronDown />}
              onClick={(e) => {
                const nextDayMenuOpenList = dayMenuOpenList.map((menuOpen, i) => {
                  if (i + 1 == currentDay) {
                    return !menuOpen;
                  } else {
                    return menuOpen;
                  }
                });
                setDayMenuOpenList(nextDayMenuOpenList);
                // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
                // dayManager.printStateData()
              }}
            />
          </Box>
          <Box
            textAlign="left"
            visibility={dayMenuOpenList[currentDay - 1] ? 'visible' : 'hidden'}
            opacity={dayMenuOpenList[currentDay - 1] ? '1' : '0'}
            maxH={dayMenuOpenList[currentDay - 1] ? '100vh' : '0vh'}
            mt={dayMenuOpenList[currentDay - 1] ? 1 : 0}
            overflowX="auto"
            transition="all 0.3s ease-in-out"
          >
            {/* {console.log(dayModuleList)} */}
            {dayModuleList &&
              dayModuleList[currentDay - 1] &&
              dayModuleList[currentDay - 1].data &&
              dayModuleList[currentDay - 1].data.map((node, i) => {
                const _key = 'day ' + currentDay + ': node ' + i;
                return (
                  <Box key={_key}>
                    <Box display="flex" h={12} alignItems="center" mt={1} mb={1}>
                      {!isReadonly && (
                        <Box display="flex" flexDirection="column" mr={2}>
                          <IconButton
                            h={6}
                            w="10px"
                            onClick={() => {
                              if (changeDayNodeIndexRef.current)
                                changeDayNodeIndexRef.current(i + 1, true);
                            }}
                            colorScheme="teal"
                            variant="outline"
                            icon={<IoChevronUp />}
                          />
                          <IconButton
                            h={6}
                            w="10px"
                            onClick={() => {
                              if (changeDayNodeIndexRef.current)
                                changeDayNodeIndexRef.current(i + 1, false);
                            }}
                            colorScheme="teal"
                            variant="outline"
                            icon={<IoChevronDown />}
                          />
                        </Box>
                      )}
                      <Box
                        display="flex"
                        alignItems="center"
                        h="100%"
                        pl={2}
                        w="100%"
                        fontWeight="semibold"
                        overflow="hidden"
                        onClick={() => {
                          setNodeInfoData({ day: currentDay, idx: i, node });
                          onNodeInfoOpen();
                        }}
                        _hover={{
                          bgColor: '#00ff0033',
                          transition: 'all .3s',
                        }}
                      >
                        {i + 1}. {node.title}
                      </Box>
                    </Box>
                    {dayModuleList[currentDay - 1].edge &&
                      dayModuleList[currentDay - 1].edge[i] && (
                        <Box
                          display="flex"
                          flexDirection="column"
                          p={2}
                          border="2px"
                          borderRadius="4px"
                          borderColor="gray.400"
                        >
                          <Box display="flex" mb={1}>
                            <Box
                              textAlign="center"
                              w="16"
                              border="1px"
                              borderRadius="4px"
                              borderColor="teal"
                              fontSize="0.8em"
                              fontWeight="semibold"
                              color="white"
                              bgColor="teal"
                              pl={1}
                              pr={1}
                              mr={2}
                            >
                              소요시간
                            </Box>
                            <Box fontWeight="semibold">
                              {(
                                Number(dayModuleList[currentDay - 1].edge[i].duration) / 60
                              ).toFixed(1)}
                            </Box>
                            분
                          </Box>
                          <Box display="flex" mb={1}>
                            <Box
                              w="16"
                              textAlign="center"
                              border="1px"
                              borderRadius="4px"
                              borderColor="teal"
                              fontSize="0.8em"
                              fontWeight="semibold"
                              color="white"
                              bgColor="teal"
                              pl={1}
                              pr={1}
                              mr={2}
                            >
                              거리
                            </Box>
                            <Box fontWeight="semibold">
                              {dayModuleList[currentDay - 1].edge[i].distance}
                            </Box>
                            m
                          </Box>
                          <Box display="flex">
                            <Box
                              w="16"
                              textAlign="center"
                              border="1px"
                              borderRadius="4px"
                              borderColor="teal"
                              fontSize="0.8em"
                              fontWeight="semibold"
                              color="white"
                              bgColor="teal"
                              pl={1}
                              pr={1}
                              mr={2}
                            >
                              택시요금
                            </Box>
                            <Box fontWeight="semibold">
                              {dayModuleList[currentDay - 1].edge[i].taxiFare}
                            </Box>
                            원
                          </Box>
                        </Box>
                      )}
                  </Box>
                );
              })}
          </Box>
        </Box>
        <Box mt={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box fontWeight="semibold">리뷰</Box>
            <IconButton
              variant="ghost"
              colorScheme="blackAlpha"
              size="sm"
              icon={reviewMenuOpen ? <IoRemove /> : <IoChevronDown />}
              onClick={(e) => {
                setReviewMenuOpen(!reviewMenuOpen);
              }}
            />
          </Box>

          <Box
            textAlign="left"
            visibility={reviewMenuOpen ? 'visible' : 'hidden'}
            opacity={reviewMenuOpen ? '1' : '0'}
            maxH={reviewMenuOpen ? '100vh' : '0vh'}
            mt={reviewMenuOpen ? 1 : 0}
            overflowX="auto"
            transition="all 0.3s ease-in-out"
          >
            <Textarea
              placeholder="리뷰를 작성해주세요!"
              border="2px"
              borderColor="gray.400"
              mt={2}
              h="200px"
              value={reviews[currentDay - 1]}
              boxShadow="md"
              readOnly={isReadonly}
              onChange={(e) => {
                const nextReviews = reviews.map((review, i) => {
                  if (i == currentDay - 1) {
                    return e.target.value;
                  } else {
                    return review;
                  }
                });
                setReviews(nextReviews);
                // console.log(nextReviews);
              }}
            />
          </Box>
        </Box>
      </Box>

      {nodeInfoData && nodeInfoData.node && (
        <Modal isOpen={isNodeInfoOpen} onClose={onNodeInfoClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Day {nodeInfoData.day} - {nodeInfoData.idx + 1}번째 노드
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box fontSize="3xl" fontWeight="semibold">
                {nodeInfoData.node.title}
              </Box>
              {/* {console.log(nodeInfoData.node)} */}
              <Box mb={6} fontSize="xl">
                {nodeInfoData.node.addr1}
              </Box>
              <Box mb={6} fontSize="xl">
                전화번호 : {nodeInfoData.node.tel}
              </Box>
              <Box mb={10} fontSize="xl">
                방문일 : {nodeInfoData.node.visitDate}
              </Box>
              <Button
                colorScheme="red"
                onClick={() => {
                  onNodeInfoClose();
                  if (removeDayNodeRef.current)
                    removeDayNodeRef.current(nodeInfoData.day, nodeInfoData.idx + 1);
                }}
              >
                노드 제거
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onNodeInfoClose} colorScheme="teal">
                닫기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {!isReadonly && (
        <Button
          w="100%"
          colorScheme="teal"
          mb={2}
          onClick={() => {
            if (saveReviewsInSaveManager.current) {
              saveReviewsInSaveManager.current();
            }
          }}
        >
          리뷰 저장
        </Button>
      )}
    </>
  );
};

export default RightBarPageDay;
