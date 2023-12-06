import { Box, Button } from '@chakra-ui/react';
import client from '../utility/client';

const UserOptions = ({ tripData }) => {
  const updateAccessibility = (option) => {
    client.post('api/obj/make' + option + '?mapId=' + tripData.mapId).then((res) => {
      console.log(res);
    });
  };
  return (
    <Box>
      Options
      <Box>공개 범위 설정</Box>
      <Box display="row">
        <Button onClick={() => updateAccessibility('Public')}>public</Button>
        <Button onClick={() => updateAccessibility('Private')}>private</Button>
      </Box>
    </Box>
  );
};

export default UserOptions;
