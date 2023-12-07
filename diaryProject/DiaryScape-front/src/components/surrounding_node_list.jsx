import { Box, Button, IconButton } from '@chakra-ui/react';
import { IoAdd } from 'react-icons/io5';
import { useState, useEffect } from 'react';

const SurroundingNodeList = ({
  surroundingNodeList,
  selectedSurroundingNodeData,
  setSelectedSurroundingNodeData,
  plusSearchNodeRef,
}) => {
  const [selectedSurroundingNode, setSelectedSurroundingNode] = useState(false);

  useEffect(() => {
    setSelectedSurroundingNode(false);
  }, [surroundingNodeList]);

  console.log(surroundingNodeList);
  return (
    <Box>
      <Box fontSize="2xl" fontWeight="semibold" mb={2}>
        주변 노드
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
                selectedSurroundingNode && selectedSurroundingNodeData.idx == idx ? 'blue' : 'white'
              }
              onClick={() => {
                setSelectedSurroundingNode(true);
                setSelectedSurroundingNodeData({ nodeData, idx });
              }}
            >
              <Box>{nodeData.title}</Box>
              <Box>{nodeData.addr1}</Box>
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
