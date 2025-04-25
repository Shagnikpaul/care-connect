import {
    CardHeader, Container, Heading, Text, VStack, Card, CardFooter, Flex
    , CardBody, SimpleGrid, Box,
    Button

} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import Navbar from '../components/Navbar'
import { query, where, getDocs, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import UserDetailsModal from '../components/UserDetailsModal';
import ExitIcon from '../components/ExitIcon'
import CompletedTasksList from '../components/CompletedTasksList';
import { sendUserRequestAcceptedByVolunteerMail } from '../utils/mailservice';


const bgColor = {
    "medium": "yellow.300",
    "high": "red.300",
    "low": "teal.300"
}








function HomePageVolunteer() {

    const [activeTask, setActiveTask] = useState(null);
    const [availableRequests, setAvailableRequests] = useState([])
    const [completedRequests, setCompletedRequests] = useState([])
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/signin");
    };



    const takeTask = async (volunteerId, requestId, requestTitle, userId) => {
        const snapshot = await getDoc(doc(db, 'users', userId))
        const userData = snapshot.data();

        const requestRef = doc(db, "requests", requestId);
        try {
            await updateDoc(requestRef, {
                volunteerId: volunteerId,
                status: "in progress", // optional: update status to in progress
            });
            console.log("Volunteer assigned successfully!");
            const newActiveTasks = await getActiveTask(volunteerId)
            setActiveTask(newActiveTasks)
            const newRequests = await getAvailableRequests();
            setAvailableRequests(newRequests)

            sendUserRequestAcceptedByVolunteerMail(requestTitle, auth.currentUser.displayName, auth.currentUser.email, userData.email)


        } catch (error) {
            console.error("Error assigning volunteer:", error);
        }

    }



    const leaveATask = async (requestId) => {
        const requestRef = doc(db, "requests", requestId);

        try {
            await updateDoc(requestRef, {
                volunteerId: null,
                status: "open"
            });
            console.log("Request has been reset to open.");
            const newActiveTasks = null;
            setActiveTask(newActiveTasks)
            const newRequests = await getAvailableRequests();
            setAvailableRequests(newRequests)

        } catch (error) {
            console.error("Error resetting request:", error);
        }
    }


    const getActiveTask = async (volunteerId) => {
        const q = query(
            collection(db, "requests"),
            where("volunteerId", "==", volunteerId),
            where("status", "!=", "done"),

        );

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
            };
        }

        return null;
    }


    const getAvailableRequests = async () => {
        const q = query(
            collection(db, "requests"),
            where("status", "==", "open")
        );

        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return requests;
    }


    const getCompletedRequests = async (volunteerId) => {
        const q = query(
            collection(db, "requests"),
            where("volunteerId", "==", volunteerId),
            where("status", "==", "done")
        );

        const querySnapshot = await getDocs(q);
        const completedrequests = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return completedrequests;
    }

    useEffect(() => {
        getActiveTask(auth.currentUser.uid).then((r) => {
            if (r) {
                console.log('active task ', r);

                setActiveTask(r)
            }
            else {
                console.log('no active tasks found');

            }
        })

        getAvailableRequests().then((r) => {
            console.log('available req ', r);

            setAvailableRequests(r)
        })


        getCompletedRequests(auth.currentUser.uid).then((r) => {
            console.log('done tasks', r);
            setCompletedRequests(r)
        })

    }, [])


    return (
        <Container maxW='8xl' marginTop={'10'}>

            <Navbar onSignOut={handleSignOut} username={auth.currentUser.displayName} />
            <VStack spacing={6} align="start" marginTop={'20'}>
                <Heading fontSize={'5xl'} >
                    Welcome, {auth.currentUser.displayName} 👋
                </Heading>



                <Heading fontSize={'xl'}>Current active task</Heading>
                {activeTask ? <Card width={'full'} backgroundColor={'blue.500'}>
                    <CardHeader>
                        <Flex

                            justifyContent={'space-between'}>
                            <Heading color={'white'}>{activeTask.title}</Heading>
                            <Text fontWeight={'medium'} color={'white'} backgroundColor={bgColor[activeTask.urgency]} padding={'2'} height={'fit-content'} borderRadius={'lg'}>{activeTask.urgency.toUpperCase()} Urgency</Text>
                        </Flex>

                        <Text color={'whiteAlpha.800'} fontSize={'lg'}>{activeTask.description}</Text>
                        <Text color={'whiteAlpha.800'}>Location : {activeTask.location}</Text>
                    </CardHeader>
                    <CardFooter>
                        <Flex justifyContent={'space-between'} gap={'6'}>
                            <UserDetailsModal type={'User'} userId={activeTask.userId} />


                            <Button backgroundColor={'red.300'} leftIcon={<ExitIcon />} onClick={() => {
                                leaveATask(activeTask.id)
                            }}>Leave task</Button>

                        </Flex>

                    </CardFooter>
                </Card> : <Text paddingBottom={'20'}>Please accept 1 task below to get started.</Text>}

                <Box w={'full'} paddingTop={'10'} >
                    <CompletedTasksList tasks={completedRequests} />
                </Box>

                <Box w={'full'} paddingBottom={'10'}>
                    <Heading fontSize={'2xl'} paddingTop={'10'}>Available Tasks</Heading>
                    <Text paddingBottom={'5'} color={'blackAlpha.700'}>Accept one task to see contact details of the user. Also only one task can be assigned to you at a time.</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {availableRequests.map((req) => (
                            <Card backgroundColor={bgColor[req.urgency]} key={req.id}>
                                <CardBody>
                                    <Flex justifyContent={'space-between'}>
                                        <Text fontWeight="bold" fontSize={'2xl'}>{req.title}</Text>
                                    </Flex>

                                    <Text>{req.description}</Text>
                                    <Text fontSize="sm" >Urgency: {req.urgency}</Text>
                                    <Text fontSize="sm" >Location: {req.location}</Text>


                                </CardBody>
                                <CardFooter>
                                    <Button backgroundColor={'wheat'} isDisabled={(activeTask)} onClick={() => {
                                        takeTask(auth.currentUser.uid, req.id, req.title, req.userId).then((r) => {
                                            console.log('assigned task successfully...');

                                        });
                                    }}>Take task</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>



            </VStack>

        </Container >
    )
}

export default HomePageVolunteer    