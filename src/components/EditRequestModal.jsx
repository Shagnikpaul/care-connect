import React, { useEffect, useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
    Input, Textarea, Select, useDisclosure, useToast
} from '@chakra-ui/react';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const EditRequestModal = ({ requestId, onRequestPosted }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('medium');
    const [location, setLocation] = useState('');

    const handleSubmit = async () => {
        await updateDoc(doc(db, 'requests', requestId), {
            title,
            description,
            urgency,
            location,
        })
        toast({ title: "Request updated", status: "success", duration: 2000 });
        onClose();
        onRequestPosted();
    };


    const getRequestData = async () => {
        const snapshot = await getDoc(doc(db, 'requests', requestId))
        const data = snapshot.data();
        return data;
    }


    useEffect(() => {
        getRequestData().then((r) => {
            setTitle(r.title)
            setDescription(r.description)
            setUrgency(r.urgency)
            setLocation(r.location)
        })
    }, [])

    return (
        <>
            <Button colorScheme="yellow" onClick={onOpen}>
                Edit
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Request Details</ModalHeader>
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

export default EditRequestModal;
