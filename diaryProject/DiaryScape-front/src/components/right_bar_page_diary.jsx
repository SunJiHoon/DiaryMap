import {
    Box,
    Button,
    IconButton,
    Checkbox,
    Select,
    Textarea,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react';

const RightBarPageDiary = ({
    children,
    isReadonly,
    totalReview,
    setTotalReview,
    generateDiaryRef,
}) => {
    return (
        <>
        {!isReadonly && (
            <Box>
            <Button
                w="100%"
                mb={2}
                colorScheme="teal"
                onClick={() => {
                if (generateDiaryRef.current) {
                    generateDiaryRef.current().then((res) => {
                    console.log(res);
                    setTotalReview(res);
                    });
                }
                }}
            >
                일기 생성
            </Button>
            <Button w="100%" mb={4} colorScheme="teal" onClick={() => {}}>
                일기 저장
            </Button>
            </Box>
        )}
        <Box fontSize="xl" fontWeight="semibold" mb={2}>
            일기
        </Box>
        <Textarea
            w="100%"
            border="2px"
            borderRadius={4}
            borderColor="gray.400"
            minH="200px"
            p={2}
            value={totalReview}
            onChange={(e) => setTotalReview(e.target.value)}
            readOnly={isReadonly}
        />
        </>
    )
}

export default RightBarPageDiary