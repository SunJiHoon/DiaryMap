import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import client from '../utility/client';
import axios from 'axios';
import { useEffect } from 'react';
import { IoThumbsUpOutline } from 'react-icons/io5';

const RecommendedNodeList = ({
  dayModuleSelected,
  dayModuleSelectedData,
  setDayModuleSelected,
  setDayModuleSelectedData,
  getCurNodeRef,
  tripData,
  curNode,
  loadRecommendedOptionsRef,
}) => {
  const [dayModuleData, setNodeListData] = useState(null);
  const [dayModuleDataLoading, setNodeListDataLoading] = useState(false);

  let source;
  useEffect(() => {
    if (!curNode) return;
    console.log('update');
    console.log(curNode);
    setDayModuleSelected(false);
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

  const onDayModuleSelect = (data, idx) => {
    setDayModuleSelected(true);
    setDayModuleSelectedData({ data, idx });
    console.log(data);
    if (loadRecommendedOptionsRef.current) {
      loadRecommendedOptionsRef.current(data.nodeDTO_for_updateArrayList);
    }
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="semibold" mb={2}>
        다른 유저의 동선
      </Box>
      <Box display="flex" mb={2}>
        <Box>현재 노드 :&nbsp;</Box>
        <Box fontWeight="semibold">{curNode.title}</Box>
      </Box>
      <Box
        h={260}
        border="2px"
        borderRadius={4}
        borderColor="gray.400"
        overflowY="scroll"
        className="custom-scrollbar"
      >
        {!dayModuleDataLoading &&
          dayModuleData &&
          dayModuleData.map((result, idx) => (
            <Button
              key={'recommended_path ' + result.username + ' ' + idx}
              border="0px"
              borderBottom="1px"
              borderColor="gray.300"
              borderRadius="0px"
              bgColor={dayModuleSelected && dayModuleSelectedData.idx == idx ? 'blue.600' : 'white'}
              color={dayModuleSelected && dayModuleSelectedData.idx == idx ? 'white' : 'black'}
              _hover={{}}
              // h="40px"
              onClick={(e) => onDayModuleSelect(result, idx)}
            >
              <Box display="flex" fontWeight="medium">
                <Box fontWeight="semibold">{result.username}</Box>
                <Box mr={1}>님,&nbsp;</Box>
                <Box display="flex" mr={1}>
                  <IoThumbsUpOutline />
                  {result.totalImportedCount}
                </Box>
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
                    {nodeData.title}

                    {idx_node != result.nodeDTO_for_updateArrayList.length - 1 && (
                      <>&nbsp;-&gt;&nbsp;</>
                    )}
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
