import {
  IoChevronForward,
  IoPencil,
  IoBook,
  IoChevronBack,
  IoHome,
  IoCubeOutline,
  IoSettings,
} from 'react-icons/io5';
import { Box, IconButton } from '@chakra-ui/react';

const RightBar = ({ children, rightBarOpen, setRightBarPage }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: rightBarOpen ? '0px' : '-360px',
        zIndex: '2',
        display: 'flex',
        alignItems: 'flex-start',
        marginRight: '1.6em',
        transition: 'right 0.3s',
      }}
    >
      <Box display="flex" flexDirection="column" mt={8}>
        <IconButton
          h="60px"
          mb={6}
          colorScheme="teal"
          onClick={() => setRightBarOpen(!rightBarOpen)}
          icon={rightBarOpen ? <IoChevronForward /> : <IoChevronBack />}
        />
        <IconButton
          mb={2}
          colorScheme="pink"
          onClick={() => setRightBarPage(0)}
          icon={<IoPencil />}
        />
        <IconButton
          mb={2}
          colorScheme="green"
          onClick={() => setRightBarPage(1)}
          icon={<IoCubeOutline />}
        />
        <IconButton colorScheme="blue" onClick={() => setRightBarPage(2)} icon={<IoBook />} />
        <IconButton colorScheme="blue" onClick={() => setRightBarPage(3)} icon={<IoSettings />} />
      </Box>
      <Box
        mt={4}
        p={4}
        w="360px"
        minH="300px"
        maxH="92vh"
        overflowY="scroll"
        bgColor="#ffffff"
        // border={1}
        borderRadius={4}
        // borderColor="gray"
        textAlign="left"
        boxShadow="2xl"
        className="custom-scrollbar"
      >
        {children}
      </Box>
    </div>
  );
};

export default RightBar;
