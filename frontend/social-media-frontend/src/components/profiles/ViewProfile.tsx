import React from 'react'
import { Button, Card, Stack } from 'react-bootstrap';

const ViewProfile = (props: any) => {
    const { profile, visible, setVisible } = props;
    const handleEdit = (event: any) => {
        setVisible(!visible);
    };
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold'}}>{profile.name}</Card.Title>
                    <Card.Subtitle style={{padding: '5px', color: 'gray'}}>{profile.email}</Card.Subtitle>
                    <Card.Text>{profile.biography}</Card.Text>
                    <Button onClick={handleEdit} variant="primary">Edit Profile</Button>
                </Card.Body>
            </Card>
            {/* <Stack gap={3}>
                <div className='p-2'>Name: {profile.name}</div>
                <div className='p-2'>Email: {profile.email}</div>
                <div className='p-2'>Biography: {profile.biography}</div>
            </Stack>
            <Button onClick={handleEdit}>Edit</Button> */}
        </div>
    )
};

export default ViewProfile