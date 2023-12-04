import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import client from '../utility/client';
import axios from 'axios';
import { useEffect } from 'react';

const RecommendedNodeList = ({ getCurNodeRef, tripData, curNode }) => {
  const [nodeListData, setNodeListData] = useState(null);
  const [nodeListDataLoading, setNodeListDataLoading] = useState(false);
  const [nodeDataSelected, setNodeDataSelected] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  let source;
  useEffect(() => {
    console.log('update');
    setNodeDataSelected(false);
    setNodeListDataLoading(true);

    if (source) {
      source.cancel();
    }

    source = axios.CancelToken.source();

    client
      .get(
        'api/placeRecommend/recommendPlace?contentid=' +
          curNode.contentid +
          '&mapid=' +
          tripData.mapId,
        { cancelToken: source.token }
      )
      .then((res) => {
        setNodeListDataLoading(false);
        setNodeListData(res.data);
      });
  }, [curNode]);

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
              key={result.username}
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
              <Box fontWeight="semibold" mr={2}>
                {result.username}
              </Box>
              <Box fontWeight="medium">
                {result.nodeDTO_for_updateArrayList.map((nodeData) => (
                  <Box key={result.username + ' ' + nodeData.id}>{nodeData.title}&nbsp;</Box>
                ))}
              </Box>
            </Button>
          ))}
      </Box>
    </>
  );
};

export default RecommendedNodeList;
