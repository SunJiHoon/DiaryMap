import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
const MapStyleButtons = ({ changeMapStyle }) => {
  const [styleList, setStyleList] = useState([
    'streets-v12',
    'outdoors-v11',
    'light-v11',
    'dark-v11',
    'satellite-v11',
    'navigation-day-v1',
    'navigation-night-v1',
  ]);
  return (
    <Box diplay="flex" boxShadow="2xl">
      {styleList.map((style) => (
        <Button
          key={'mapstylebuttons ' + style}
          size="sm"
          colorScheme="teal"
          _hover={{
            transform: 'scale(1.15)',
          }}
          onClick={() => changeMapStyle(style)}
        >
          {style}
        </Button>
      ))}
    </Box>
  );
};

export default MapStyleButtons;
