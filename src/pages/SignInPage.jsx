import React from 'react'
import { useNavigate } from "react-router-dom";

import { signInWithPopup } from 'firebase/auth'

import { doc, getDoc } from "firebase/firestore";
import { Card, CardHeader, Text, Button, CardBody, Box, Heading, Stack, Center, Flex } from '@chakra-ui/react'
import { auth, provider, db } from '../utils/firebase'
import { LogoGoogle } from '../components/GoogleIcon';
function SignInPage() {


    const navigate = useNavigate();


    const handleSignIn = async () => {
        try {
            const creds = await signInWithPopup(auth, provider)
            console.log('Successfully signed in... ', creds.user.displayName);
            const user = creds.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log('user already exists ....');
                navigate("/");
            }
            else {
                console.log('new user is getting created');
                // Create new user document



                navigate('/profile-setup')

            }





        } catch (err) {
            console.error('Some erroe', err);

        }
    }
    return (
        <div>
            <Box bgImage={"url('https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"} bgPosition="bottom" minH="100vh" display="flex" alignItems="center" justifyContent="center">
                <Stack backgroundColor={'whiteAlpha.100'} backdropFilter="blur(5px)" borderRadius={'3xl'} padding={'20'} spacing={10} textAlign="center" color="white" maxW="500px" width="100%">
                    <Flex direction={'column'}>
                        <Text as="h1" size="lg" fontWeight="bold" color={'black'}>
                            Welcome to
                        </Text>
                        <Heading size={'2xl'}>CareConnect</Heading>
                    </Flex>


                    <Button
                        colorScheme="teal"
                        variant="solid"
                        width="full"
                        onClick={handleSignIn}
                        leftIcon={<LogoGoogle />}
                    >
                        Sign in with Google
                    </Button>

                    {/* Information text */}
                    <Text fontSize="lg" mt={4} color={'white'}>
                        If this is your first time signing up, you'll be automatically redirected to a form
                        to fill up relevant details.
                    </Text>
                </Stack>
            </Box>
        </div>
    )
}

export default SignInPage   