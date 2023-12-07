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

const RightBar = ({ children, rightBarOpen, setRightBarOpen, setRightBarPage }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: rightBarOpen ? '0px' : '-400px',
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
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
        <IconButton
          mb={2}
          colorScheme="green"
          onClick={() => setRightBarPage(1)}
          icon={<IoCubeOutline />}
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
        <IconButton
          mb={2}
          colorScheme="green"
          onClick={() => setRightBarPage(2)}
          icon={<IoCubeOutline />}
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
        <IconButton
          mb={2}
          colorScheme="blue"
          onClick={() => setRightBarPage(3)}
          icon={<IoBook />}
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
        <IconButton
          colorScheme="gray"
          onClick={() => setRightBarPage(4)}
          icon={<IoSettings />}
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
      </Box>
      <Box
        mt={4}
        p={4}
        w="380px"
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
