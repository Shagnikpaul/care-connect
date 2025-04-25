import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
    Input, Textarea, Select, useDisclosure, useToast
} from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Adjust as needed

const NewRequestModal = ({ currentUserId, onRequestPosted }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('medium');
    const [location, setLocation] = useState('');

    const handleSubmit = async () => {
        if (!title || !description || !location) {
            toast({ title: "Please fill all fields", status: "warning", duration: 3000 });
            return;
        }

        try {
            await addDoc(collection(db, "requests"), {
                userId: currentUserId,
                title,
                description,
                urgency,
                location,
                status: "open",
                timestamp: serverTimestamp(),
                volunteerId: null
            });

            toast({ title: "Request posted!", status: "success", duration: 3000 });
            onClose();
            setTitle('');
            setDescription('');
            setUrgency('medium');
            setLocation('');
            onRequestPosted();
        } catch (error) {
            console.log('eeror inn modal ', error);

            toast({ title: "Failed to post request", status: "error", duration: 3000 });
        }
    };

    return (
        <>
            <Button colorScheme="teal" onClick={onOpen}>
                Post a New Request
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Help Request</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired mb={4}>
                            <FormLabel>Title</FormLabel>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>Urgency</FormLabel>
                            <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Location</FormLabel>
                            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                        <Button colorScheme="teal" onClick={handleSubmit}>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NewRequestModal;
