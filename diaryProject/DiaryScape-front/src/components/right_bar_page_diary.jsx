import { Box, Button, Textarea } from '@chakra-ui/react';
import client from '../utility/client';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';

const RightBarPageDiary = ({
  children,
  isReadonly,
  totalReview,
  setTotalReview,
  generateDiaryRef,
  tripData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(totalReview);
  return (
    <Box minH="400px">
      {/* <Box fontSize="2xl" fontWeight="semibold" mb={2}>
        일기
      </Box> */}
      {!isReadonly && (
        <Box>
          <Button
            w="100%"
            mb={2}
            colorScheme="teal"
            onClick={() => {
              setIsLoading(true);
              if (generateDiaryRef.current) {
                generateDiaryRef.current().then((res) => {
                  console.log(res);
                  setIsLoading(false);
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
      {isLoading && (
        <Box ml="150px" mt="130px">
          <Oval
            height={40}
            width={40}
            color="black"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="gray"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </Box>
      )}
      {!isLoading && (
        <Textarea
          w="100%"
          border="2px"
          borderRadius={4}
          borderColor="gray.400"
          minH="300px"
          p={2}
          value={totalReview}
          onChange={(e) => setTotalReview(e.target.value)}
          readOnly={isReadonly}
        />
      )}
    </Box>
  );
};

export default RightBarPageDiary;
