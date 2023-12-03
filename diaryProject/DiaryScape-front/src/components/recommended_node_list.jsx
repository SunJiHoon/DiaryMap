import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
const RecommendedNodeList = () => {
  const [nodeListData, setNodeListData] = useState(null);
  const [nodeListDataLoading, setNodeListDataLoading] = useState(false);
  const [nodeDataSelected, setNodeDataSelected] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  //   let source;
  //   const updateNodeList = (e) => {
  //     setNodeDataSelected(false);
  //     setNodeListDataLoading(true);

  //     if (!dayManager) return;

  //     if (source) {
  //       source.cancel();
  //     }

  //     source = axios.CancelToken.source();

  //     client
  //       .get(
  //         'api/kakaoOpenApi/keywordAndCoord/list?mapId=' +
  //           tripData.mapId +
  //           '&userKeyword=' +
  //           searchValueReplaced +
  //           '&mapX=' +
  //           dayManager.getCurNode().userData.mapX +
  //           '&mapY=' +
  //           dayManager.getCurNode().userData.mapY,
  //         { cancelToken: source.token }
  //       )
  //       .then((res) => {
  //         setNodeListDataLoading(false);
  //         setNodeListData(res.data);
  //         // console.log(res.data)

  //         loadSearchOptions(res.data);
  //       });

  const onNodeDataSelect = (nodeData, idx) => {
    setNodeDataSelected(true);
    setSelectedData(nodeData);
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="semibold" mb={2}>
        다른 유저의 동선
      </Box>
      <Box
        h={260}
        border="2px"
        borderRadius={4}
        borderColor="gray.400"
        overflowY="scroll"
        className="custom-scrollbar"
      >
        {!nodeListDataLoading &&
          nodeListData &&
          nodeListData.map((result, idx) => (
            <Button
              key={result.contentid}
              border="0px"
              borderBottom="1px"
              borderColor="gray.300"
              borderRadius="0px"
              bgColor={
                nodeDataSelected && selectedData.contentid == result.contentid
                  ? 'blue.600'
                  : 'white'
              }
              color={
                nodeDataSelected && selectedData.contentid == result.contentid ? 'white' : 'black'
              }
              _hover={{}}
              h="40px"
              onClick={(e) => onNodeDataSelect(result, idx)}
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
    </>
  );
};

export default RecommendedNodeList;
