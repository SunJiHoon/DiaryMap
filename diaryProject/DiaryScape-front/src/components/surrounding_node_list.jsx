import { Box } from '@chakra-ui/react';
const SurroundingNodeList = ({ surroundingNodeList }) => {
  return (
    <Box>
      <Box>주변 노드</Box>
      <Box>
        {surroundingNodeList.map((nodeData) => {
          return <Box></Box>;
        })}
      </Box>
    </Box>
  );
};

export default SurroundingNodeList;
