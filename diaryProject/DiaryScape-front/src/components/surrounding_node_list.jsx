import { Box, Button, IconButton } from '@chakra-ui/react';
import { IoAdd } from 'react-icons/io5';
import { useState, useEffect } from 'react';

const SurroundingNodeList = ({
  surroundingNodeList,
  selectedSurroundingNodeData,
  setSelectedSurroundingNodeData,
  plusSearchNodeRef,
  curNode,
}) => {
  const [selectedSurroundingNode, setSelectedSurroundingNode] = useState(false);

  useEffect(() => {
    setSelectedSurroundingNode(false);
  }, [surroundingNodeList]);

  console.log(surroundingNodeList);
  return (
    <Box>
      {/* <Box fontSize="2xl" fontWeight="semibold" mb={2}>
        주변 노드
      </Box> */}
      <Box display="flex">
        <Box mb={2}>현재 노드 :&nbsp;</Box>
        <Box fontWeight="semibold">{curNode && curNode.title}</Box>
      </Box>
      <Box
        className="custom-scrollbar"
        w="100%"
        mb={2}
        overflowY="scroll"
        h="300px"
        border="2px"
        borderRadius="4px"
        borderColor="gray.400"
      >
        {surroundingNodeList.map((nodeData, idx) => {
          return (
            <Button
              key={'surrounding_node ' + idx + ' ' + nodeData}
              display="flex"
              color={
                selectedSurroundingNode && selectedSurroundingNodeData.idx == idx
                  ? 'white'
                  : 'black'
              }
              bgColor={
                selectedSurroundingNode && selectedSurroundingNodeData.idx == idx
                  ? 'blue.300'
                  : 'white'
              }
              onClick={() => {
                setSelectedSurroundingNode(true);
                setSelectedSurroundingNodeData({ nodeData, idx });
              }}
              borderRadius="0px"
              _hover={{}}
            >
              <Box fontWeight="semibold" mr={2}>
                {nodeData.title}
              </Box>
              <Box fontWeight="medium">{nodeData.addr1}</Box>
            </Button>
          );
        })}
      </Box>
      <IconButton
        w="100%"
        icon={<IoAdd />}
        colorScheme="teal"
        onClick={() => {
          if (selectedSurroundingNode) {
            if (plusSearchNodeRef.current) {
              plusSearchNodeRef.current(selectedSurroundingNodeData.nodeData);
            }
          }
        }}
      />
    </Box>
  );
};

export default SurroundingNodeList;
