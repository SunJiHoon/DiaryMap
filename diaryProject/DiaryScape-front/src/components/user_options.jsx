import { Box, Button, Select, IconButton } from '@chakra-ui/react';
import { IoHome } from 'react-icons/io5';
import client from '../utility/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserOptions = ({ tripData, mapStyleValue, setMapStyleValue, changeMapStyle }) => {
  const navigate = useNavigate();
  const mapStyles = [
    'streets-v12',
    'outdoors-v11',
    'light-v11',
    'dark-v11',
    'satellite-v9',
    'navigation-day-v1',
    'navigation-night-v1',
  ];

  const [accessibility, setAccessibility] = useState('Private');
  const updateAccessibility = (option) => {
    setAccessibility(option);
    client.post('api/obj/make' + option + '?mapId=' + tripData.mapId).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    client.get('api/obj/isPublic?mapId=' + tripData.mapId).then((res) => {
      console.log(res);
      if (res.data == 'private') setAccessibility('Private');
      else if (res.data == 'public') setAccessibility('Public');
    });
  }, []);

  return (
    <Box>
      <Box fontSize="2xl" fontWeight="semibold" mb={2}>
        옵션
      </Box>
      <IconButton
        icon={<IoHome />}
        w="100%"
        colorScheme="gray"
        onClick={() => navigate('/')}
        mb={4}
      />
      <Box>공개 범위</Box>
      <Select
        value={accessibility}
        onChange={(e) => {
          updateAccessibility(e.target.value);
          // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
          // dayManager.printStateData()
        }}
        mb={4}
      >
        <option value={'Public'}>Public</option>
        <option value={'Private'}>Private</option>
      </Select>

      <Box>맵 스타일</Box>
      <Select
        value={mapStyleValue}
        onChange={(e) => {
          changeMapStyle(e.target.value);
          // dayManager.updateFromFrontData(dayModuleList, setDayModuleList, dayCheckedList, currentDay, nextDayMenuId, tripData)
          // dayManager.printStateData()
        }}
      >
        {mapStyles.map((style) => (
          <option key={'mapstyle ' + style} value={style}>
            {style}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default UserOptions;
