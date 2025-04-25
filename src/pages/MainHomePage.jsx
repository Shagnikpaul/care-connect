import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from "../utils/firebase";
import HomePageVolunteer from './HomePageVolunteer';
import HomePageUser from "../pages/HomePageUser";
import { Text } from '@chakra-ui/react';






function MainHomePage() {

    const [userrole, setUserRole] = useState()

    useEffect(() => {
        const checkRole = async (id) => {
            const userRef = collection(db, 'users');
            const q = query(userRef, where('uid', '==', id));
            const querySnapshot = await getDocs(q);
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userRole = userData.role; // 'user' or 'volunteer'
            setUserRole(userRole)
        }
        const id = auth.currentUser.uid;
        checkRole(id);
    }, [])

    if (!userrole) {
        return <Text padding={'10'}>Loading...</Text>
    }

    return (
        <div>{(userrole === "user" ? <HomePageUser /> : <HomePageVolunteer />)}</div>
    )
}

export default MainHomePage 