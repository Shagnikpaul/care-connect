import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Textarea,
    Heading,
    useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";

function ProfileSetup() {
    const user = auth.currentUser;
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        city: "",
        bio: "",
        role: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/signin");
        } else {
            setFormData((prev) => ({
                ...prev,
                fullName: user.displayName || "",
            }));
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            role: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            toast({
                title: "Role required",
                description: "Please select a role to continue.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                ...formData,
                profileComplete: true,
                createdAt: new Date(),
            });

            navigate("/");
        } catch (err) {
            console.error("Error saving profile:", err);
            toast({
                title: "Error",
                description: "Failed to save profile data.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
            <Heading mb={6} textAlign="center">
                Complete Your Profile
            </Heading>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4} isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4} isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4} isRequired>
                    <FormLabel>City</FormLabel>
                    <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Short Bio</FormLabel>
                    <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={6} isRequired>
                    <FormLabel>Select Role</FormLabel>
                    <RadioGroup onChange={handleRoleChange} value={formData.role}>
                        <Stack direction="row">
                            <Radio value="volunteer">Volunteer</Radio>
                            <Radio value="user">Normal User</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>

                <Button colorScheme="teal" type="submit" width="full">
                    Save and Continue
                </Button>
            </form>
        </Box>
    );
}

export default ProfileSetup;
