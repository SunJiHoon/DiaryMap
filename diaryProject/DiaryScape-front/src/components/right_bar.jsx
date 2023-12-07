import {
  IoChevronForward,
  IoPencil,
  IoBook,
  IoChevronBack,
  IoCubeOutline,
  IoSettings,
  IoThumbsUpOutline,
} from 'react-icons/io5';
import { Box, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
const RightBar = ({
  children,
  rightBarOpen,
  setRightBarOpen,
  rightBarPage,
  setRightBarPage,
  isReadonly,
}) => {
  const [title, setTitle] = useState('Day 정보');
  const translateXValue = '24px';
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
          mb={2}
          colorScheme="pink"
          onClick={() => {
            setRightBarOpen(true);
            setRightBarPage(0);
            setTitle('Day 정보');
          }}
          icon={<IoPencil />}
          transform={rightBarPage == 0 ? 'translateX(0px)' : `translateX(${translateXValue})`}
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
        {!isReadonly && (
          <IconButton
            mb={2}
            colorScheme="green"
            onClick={() => {
              setRightBarOpen(true);
              setRightBarPage(1);
              setTitle('다른 유저의 동선');
            }}
            icon={<IoThumbsUpOutline />}
            transform={rightBarPage == 1 ? 'translateX(0px)' : `translateX(${translateXValue})`}
            _hover={{
              transform: 'scale(1.15)',
            }}
            transition="all .3s"
          />
        )}
        {!isReadonly && (
          <IconButton
            mb={2}
            colorScheme="green"
            bgColor="green.400"
            onClick={() => {
              setRightBarOpen(true);
              setRightBarPage(2);
              setTitle('주변 노드');
            }}
            icon={<IoCubeOutline />}
            transform={rightBarPage == 2 ? 'translateX(0px)' : `translateX(${translateXValue})`}
            _hover={{
              transform: 'scale(1.15)',
            }}
            transition="all .3s"
          />
        )}
        <IconButton
          mb={2}
          colorScheme="blue"
          onClick={() => {
            setRightBarOpen(true);
            setRightBarPage(3);
            setTitle('일기');
          }}
          icon={<IoBook />}
          transform={rightBarPage == 3 ? 'translateX(0px)' : `translateX(${translateXValue})`}
          _hover={{
            transform: 'scale(1.15)',
          }}
          transition="all .3s"
        />
        <IconButton
          colorScheme="gray"
          onClick={() => {
            setRightBarOpen(true);
            setRightBarPage(4);
            setTitle('옵션');
          }}
          icon={<IoSettings />}
          transform={rightBarPage == 4 ? 'translateX(0px)' : `translateX(${translateXValue})`}
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
        zIndex={1}
      >
        <Box display="flex" w="100%" justifyContent="space-between" mb={2}>
          <Box fontSize="2xl" fontWeight="semibold" mb={2}>
            {title}
          </Box>
          <IconButton
            colorScheme="teal"
            onClick={() => setRightBarOpen(!rightBarOpen)}
            icon={rightBarOpen ? <IoChevronForward /> : <IoChevronBack />}
          />
        </Box>
        {children}
      </Box>
    </div>
  );
};

export default RightBar;
