import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    useDisclosure,
    Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

function UserDetailsModal({ userId, type }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [contact, setContact] = useState(null);

    const fetchContact = async () => {
        if (!userId) return;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setContact(docSnap.data());
        }
    };

    // Fetch contact only when modal is opened
    useEffect(() => {
        if (isOpen) {
            fetchContact();
        }
    }, [isOpen]);

    return (
        <>
            <Button onClick={onOpen} >
                Contact {type}
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> {type}'s contact Information</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {contact ? (
                            <>
                                <Text><strong>Name:</strong> {contact.fullName}</Text>
                                <Text><strong>Email:</strong> {contact.email}</Text>
                                <Text><strong>Phone:</strong> {contact.phone}</Text>
                            </>
                        ) : (
                            <Text>Loading contact info...</Text>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UserDetailsModal     