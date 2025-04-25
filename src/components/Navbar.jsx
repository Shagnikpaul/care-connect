import React from 'react';
import { Box, Flex, Button, Text } from '@chakra-ui/react';

const Navbar = ({ username, onSignOut }) => {
    return (
        <Box p={4} border={'1px'} borderColor={'blue.200'} borderWidth={'thick'} borderRadius={'2xl'}>
            <Flex align="center" justify="space-between">
                <Text color="black" fontSize="xl" fontWeight="bold">
                    CareConnect
                </Text>
                <Flex align="center">
                    <Text color="black" mr={4}>
                        Signed in as {username}
                    </Text>
                    <Button colorScheme="red" onClick={onSignOut} color="white">
                        Sign Out
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
