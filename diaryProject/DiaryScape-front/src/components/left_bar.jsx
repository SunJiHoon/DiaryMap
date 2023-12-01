import { Box } from '@chakra-ui/react';

const LeftBar = ({ children, leftBarOpen }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: leftBarOpen ? '0' : '-260px',
        zIndex: '2',
        transition: 'left 0.3s',
      }}
    >
      <Box display="flex" alignItems="flex-start">
        {children}
      </Box>
    </div>
  );
};

export default LeftBar;
