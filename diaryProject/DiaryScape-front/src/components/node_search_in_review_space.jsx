import { Box, Button, IconButton, Input } from '@chakra-ui/react';
import { IoSearch, IoAdd } from 'react-icons/io5';
import client from '../utility/client';
import { Oval } from 'react-loader-spinner';

const NodeSearchInReviewSpace = ({
  children,
  isReadonly,
  searchValue,
  setSearchValue,
  onNodeSearch,
  searchResultDataLoading,
  nodeSearchSelected,
  onNodeSearchSelect,
  selectedData,
  onPlusSearchNodeClick,
  searchResultData,
  dayModuleSelected,
  dayModuleSelectedData,
}) => {
  return (
    <>
      {!isReadonly && (
        <Box maxW="100%" mt={4}>
          <Box display="flex" mb={2}>
            <Input
              w="100%"
              type="text"
              placeholder="노드 이름"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              mr={1}
            />
            <IconButton icon={<IoSearch />} colorScheme="teal" onClick={onNodeSearch}>
              노드 검색
            </IconButton>
          </Box>
          <Box w="100%" textAlign="end" mb={2}></Box>
          <Box display="flex" justifyContent="center" mb={4}>
            <Box w="100%" maxW="500px" display="flex" flexDirection="column">
              {/* <Box fontSize="1.4em" mb={2}>노드 선택</Box> */}
              {/* {nodeSearchSelected && <Box>{selectedData.contentid}</Box>} */}
              {/* {searchValue.length == 0 && <Box>노드 이름을 입력해주세요!</Box>} */}
              <Box
                h={260}
                border="2px"
                borderRadius={4}
                borderColor="gray.400"
                overflowY="scroll"
                className="custom-scrollbar"
              >
                {searchResultDataLoading && (
                  <Box ml={20} mt={24}>
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
                {!searchResultDataLoading &&
                  searchResultData &&
                  searchResultData.map((result, idx) => (
                    <Button
                      minW="100%"
                      key={result.contentid}
                      border="0px"
                      borderBottom="1px"
                      borderColor="gray.300"
                      borderRadius="0px"
                      bgColor={
                        nodeSearchSelected && selectedData.contentid == result.contentid
                          ? 'blue.300'
                          : 'white'
                      }
                      color={
                        nodeSearchSelected && selectedData.contentid == result.contentid
                          ? 'white'
                          : 'black'
                      }
                      _hover={{}}
                      h="40px"
                      onClick={(e) => onNodeSearchSelect(result, "search", idx)}
                    >
                      {/* {result.contentid} */}
                      <Box fontWeight="semibold" mr={2}>
                        {result.title}
                      </Box>
                      <Box fontWeight="medium">{result.addr1}</Box>
                      {/* x: {result.mapx}, y: {result.mapy} */}
                    </Button>
                  ))}
              </Box>
            </Box>
          </Box>
          <IconButton
            w="100%"
            icon={<IoAdd />}
            colorScheme="teal"
            onClick={() => {
              if (nodeSearchSelected) onPlusSearchNodeClick(selectedData);
              if (dayModuleSelected) {
                console.log(dayModuleSelectedData);
                client
                  .post(
                    '/api/placeRecommend/setimportcount?importedMapId=' +
                      dayModuleSelectedData.data.importedMapId +
                      '&importedContentId=' +
                      selectedData.contentid +
                      '&importedDate=' +
                      dayModuleSelectedData.data.nodeDTO_for_updateArrayList[0].visitDate
                  )
                  .then((res) => {
                    console.log(res);
                  });
              }
            }}
          />
        </Box>
      )}
    </>
  );
};

export default NodeSearchInReviewSpace;
