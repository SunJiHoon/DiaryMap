import { Box, Button } from '@chakra-ui/react';

const NodeMenu = ({
  children,
  nodeMenuOn,
  nodeMenuPosition,
  selectOptionData,
  onAddNodeButtonClick,
  isReadonly,
}) => {
  return (
    <div
      style={{
        visibility: nodeMenuOn ? 'visible' : 'hidden',
        position: 'fixed',
        top: nodeMenuPosition.y,
        left: nodeMenuPosition.x,
        zIndex: nodeMenuOn ? 4 : -2,
        maxH: nodeMenuOn ? '100vh' : '0vh',
        opacity: nodeMenuOn ? '1' : '0',
        transition:
          'visibility .3s linear .3s, z-index .3s linear .3s, opacity .3s linear .3s, maxH .3s linear .3s',
      }}
    >
      <Box
        bgColor="white"
        borderRadius="2px"
        w="200px"
        overflowY="hidden"
        boxShadow="2xl"
        textAlign="left"
        p={4}
        // transition="all .4s ease-in-out .3s"
      >
        <Box fontWeight="bold">노드 정보</Box>
        {selectOptionData.select_option && (
          <Box>
            {selectOptionData.select_option.userData.title}
            <br />
            {selectOptionData.select_option.userData.addr1}
            <br />
            {selectOptionData.select_option.userData.tel}
            <br />
          </Box>
        )}

        {!isReadonly && (
          <Button onClick={onAddNodeButtonClick} colorScheme="teal" mt={2}>
            노드 추가
          </Button>
        )}
      </Box>
    </div>
  );
};

export default NodeMenu;
