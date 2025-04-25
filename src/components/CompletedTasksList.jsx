import { Box, Flex, Card, CardHeader, CardBody, Heading, Text } from "@chakra-ui/react";

const CompletedTasksList = ({ tasks }) => {
    return (
        <Box>
            <Heading size="md" mb={4}>Past completed tasks</Heading>

            <Flex overflowX="auto" gap={4} p={2}>
                {tasks.map((task) => (
                    <Card key={task.id} minW="250px" maxW="300px" flexShrink={0} boxShadow="md" border={'2px'} borderStyle={'dashed'}>
                        <CardHeader>
                            <Heading size="sm">{task.title}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>{task.description}</Text>
                            <Text fontSize="sm" color="gray.500">Status: {task.status}</Text>
                        </CardBody>
                    </Card>
                ))}
            </Flex>
        </Box>
    );
};


export default CompletedTasksList