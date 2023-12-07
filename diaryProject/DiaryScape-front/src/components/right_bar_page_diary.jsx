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
import client from '../utility/client';

const RightBarPageDiary = ({
  children,
  isReadonly,
  totalReview,
  setTotalReview,
  generateDiaryRef,
  tripData,
}) => {
  return (
    <>
      <Box fontSize="2xl" fontWeight="semibold" mb={2}>
        일기
      </Box>
      {!isReadonly && (
        <Box>
          <Button
            w="100%"
            mb={2}
            colorScheme="teal"
            onClick={() => {
              if (generateDiaryRef.current) {
                generateDiaryRef.current().then((res) => {
                  console.log(res);
                  setTotalReview(res);
                });
              }
            }}
          >
            일기 생성
          </Button>
          <Button
            w="100%"
            mb={4}
            colorScheme="teal"
            onClick={() => {
              console.log(totalReview);
              client
                .post(
                  '/api/totalReview/save?mapId=' + tripData.mapId,
                  { review: totalReview },
                  { withCredentials: true }
                )
                .then((res) => {
                  console.log(res);
                });
            }}
          >
            일기 저장
          </Button>
        </Box>
      )}
      <Textarea
        w="100%"
        border="2px"
        borderRadius={4}
        borderColor="gray.400"
        minH="200px"
        p={2}
        value={totalReview}
        onChange={(e) => setTotalReview(e.target.value)}
        readOnly={isReadonly}
      />
    </>
  );
};

export default RightBarPageDiary;
