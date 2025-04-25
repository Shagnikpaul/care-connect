import React from 'react';
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { RoundHandshake } from './HandIcon';

const Navbar = ({ username, onSignOut }) => {
    return (
        <Box p={4} border={'1px'} borderColor={'blue.200'} borderWidth={'thick'} borderRadius={'2xl'}>
            <Flex align="center" justify="space-between">
                <Flex gap={'2'}>
                    <RoundHandshake />
                    <Text color="black" fontSize="xl" fontWeight="bold">
                        Unity Help
                    </Text>
                </Flex>



                <Flex align="center">
                    <Text color="black" mr={4}>
                        Signed in as {username}
                    </Text>
                    <Button colorScheme="red" onClick={onSignOut} color="white">
                        Sign Out
                    </Button>
                </Flex>
            </Flex>
        </Box >
    );
};

export default Navbar;
