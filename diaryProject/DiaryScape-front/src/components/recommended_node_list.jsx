import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import client from '../utility/client';
import axios from 'axios';
import { useEffect } from 'react';

const RecommendedNodeList = ({ getCurNodeRef, tripData, curNode, loadRecommendedOptionsRef }) => {
  const [nodeListData, setNodeListData] = useState(null);
  const [nodeListDataLoading, setNodeListDataLoading] = useState(false);
  const [nodeDataSelected, setNodeDataSelected] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  let source;
  useEffect(() => {
    if (!curNode) return;
    console.log('update');
    console.log(curNode);
    setNodeDataSelected(false);
    setNodeListDataLoading(true);

    if (source) {
      source.cancel();
    }

    source = axios.CancelToken.source();

    console.log(curNode.contentID + ' ' + tripData.mapId);
    client
      .get(
        'api/placeRecommend/recommendPlace?contentid=' +
          curNode.contentID +
          '&mapid=' +
          tripData.mapId,
        { cancelToken: source.token }
      )
      .then((res) => {
        console.log(res);
        setNodeListDataLoading(false);
        setNodeListData(res.data);
      });
  }, [curNode]);

  const onNodeDataSelect = (data, idx) => {
    setNodeDataSelected(true);
    setSelectedData({ data, idx });
    console.log(data);
    if (loadRecommendedOptionsRef.current) {
      loadRecommendedOptionsRef.current(data.nodeDTO_for_updateArrayList, -1);
    }
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
              key={'recommended_path ' + result.username + ' ' + idx}
              border="0px"
              borderBottom="1px"
              borderColor="gray.300"
              borderRadius="0px"
              bgColor={nodeDataSelected && selectedData.idx == idx ? 'blue.600' : 'white'}
              color={nodeDataSelected && selectedData.idx == idx ? 'white' : 'black'}
              _hover={{}}
              // h="40px"
              onClick={(e) => onNodeDataSelect(result, idx)}
            >
              <Box display="flex" fontWeight="medium">
                <Box fontWeight="semibold">{result.username}</Box>
                <Box mr={1}>님:&nbsp;</Box>
                {result.nodeDTO_for_updateArrayList.map((nodeData, idx_node) => (
                  <Box
                    key={
                      'recommended_node ' +
                      result.username +
                      ' ' +
                      idx +
                      ' ' +
                      idx_node +
                      ' ' +
                      nodeData.contentid
                    }
                  >
                    {nodeData.title}&nbsp;-&gt;&nbsp;
                  </Box>
                ))}
              </Box>
            </Button>
          ))}
      </Box>
    </>
  );
};

export default RecommendedNodeList;
