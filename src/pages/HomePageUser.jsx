import { Button, Text, VStack, Card, Flex, CardBody, SimpleGrid, Center, Container, Box, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { auth, db } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import NewRequestModal from '../components/NewRequestModal';
import { collection, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import UserDetailsModal from '../components/UserDetailsModal';
import { sendVolunteerTaskCompletedMail } from '../utils/mailservice';
import EditRequestModal from '../components/EditRequestModal';



const bgColor = {
    "medium": "yellow.100",
    "high": "red.100",
    "low": "teal.100"
}




function HomePage() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const toast = useToast();

    const fetchRequests = async () => {


        const activeQuery = query(
            collection(db, "requests"),
            where("userId", "==", user.uid),
            where("status", "in", ["open", "pending", "in progress"])
        );

        const completedQuery = query(
            collection(db, "requests"),
            where("userId", "==", user.uid),
            where("status", "==", "done")
        );

        try {
            const [activeSnap, completedSnap] = await Promise.all([
                getDocs(activeQuery),
                getDocs(completedQuery)
            ]);
            let d = activeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('active rqe ', d);
            setActiveRequests(d);
            d = completedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('done rqe ', d);
            setCompletedRequests(d);

        } catch (err) {
            console.error("Error fetching requests:", err);
        }


    };





    useEffect(() => {
        const currentU = auth.currentUser
        setUserName(currentU.displayName)
        fetchRequests(currentU.uid)

    }, [])

    const [userName, setUserName] = useState("User Name")
    const [activeRequests, setActiveRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);





    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/signin");
    };


    const deleteRequest = async (requestId) => {
        try {
            await deleteDoc(doc(db, "requests", requestId));
            toast({ title: "Request deleted", status: "success", duration: 3000 });
            fetchRequests(); // refresh the list
        } catch (error) {
            console.log('error in delete request', error);

            toast({ title: "Error deleting request", status: "error", duration: 3000 });
        }
    }


    const completeRequest = async (requestId, requestTitle, volunteerId) => {

        const snapshot = await getDoc(doc(db, 'users', volunteerId));
        const volunteerData = snapshot.data();
        try {
            await updateDoc(doc(db, 'requests', requestId), {
                status: "done"
            });
            toast({ title: "Marked as Done", status: "success", duration: 3000 });
            fetchRequests(); // refresh the list
            sendVolunteerTaskCompletedMail(requestTitle, volunteerData.email)
        } catch (error) {
            console.log('error in completeing request', error);

        }
    }



    return (
        <Container maxW='8xl' marginTop={'10'}>
            <Navbar onSignOut={handleSignOut} username={userName}></Navbar>
            <Container maxW='full' p={8}>
                <VStack spacing={6} align="start">
                    <Text fontSize="2xl" fontWeight="bold">
                        Welcome, {userName}
                    </Text>

                    <Center>
                        <NewRequestModal currentUserId={user.uid} onRequestPosted={fetchRequests} />
                    </Center>

                    <Box w="100%">
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            Your Active Requests:
                        </Text>
                        {activeRequests.length === 0 ? (
                            <Text>No active requests. You can create one below.</Text>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {activeRequests.map((req) => (
                                    <Card border={(req.volunteerId !== null) ? "2px" : "0"} borderColor={'gray.600'} borderStyle={'dashed'} backgroundColor={bgColor[req.urgency]} key={req.id}>
                                        <CardBody>
                                            <Flex justifyContent={'space-between'}>
                                                <Text fontWeight="bold" fontSize={'2xl'}>{req.title}</Text>
                                                <Text backgroundColor={(req.status === 'in progress') ? 'red.300' : 'teal.500'} textColor={'white'} padding={'1.5'} borderRadius={'lg'}>{new String(req.status).toUpperCase()}</Text>
                                            </Flex>

                                            <Text>{req.description}</Text>
                                            <Text fontSize="sm" color="gray.500">Urgency: {req.urgency}</Text>
                                            <Text fontSize="sm" color="gray.500">Location: {req.location}</Text>


                                            <Flex marginTop={'3'} justifyContent={'space-between'}>
                                                <Flex gap={'6'}>
                                                    {(req.volunteerId !== null) ? <UserDetailsModal type={'Volunteer'} userId={req.volunteerId} /> : null}
                                                    {(req.status === 'in progress') ? null : <EditRequestModal requestId={req.id} onRequestPosted={fetchRequests} />}
                                                    <Button onClick={() => {
                                                        deleteRequest(req.id)
                                                    }} color={'red.500'}>Delete</Button>

                                                </Flex>

                                                {(req.status === "in progress") ? <Button color={'white'} backgroundColor={'teal.300'} onClick={() => {
                                                    completeRequest(req.id, req.title, req.volunteerId)
                                                }}>Mark as Done</Button> : null}

                                            </Flex>

                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>

                    <Box w={"full"} marginTop={'16'}>
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            Past completed requests:
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            {completedRequests.length === 0 ? (
                                <Text>No past requests.</Text>
                            ) :

                                completedRequests.map((req) => (
                                    <Card backgroundColor={bgColor[req.urgency]} key={req.id}>
                                        <CardBody>
                                            <Flex justifyContent={'space-between'}>
                                                <Text fontWeight="bold" fontSize={'2xl'}>{req.title}</Text>
                                                <Text backgroundColor={'teal.500'} textColor={'white'} padding={'1.5'} borderRadius={'lg'}>{new String(req.status).toUpperCase()}</Text>
                                            </Flex>

                                            <Text>{req.description}</Text>
                                            <Text fontSize="sm" color="gray.500">Urgency: {req.urgency}</Text>
                                            <Text fontSize="sm" color="gray.500">Location: {req.location}</Text>
                                            


                                        </CardBody>
                                    </Card>
                                ))}
                        </SimpleGrid>
                    </Box>

                </VStack>
            </Container>



        </Container >

    )
}














export default HomePage