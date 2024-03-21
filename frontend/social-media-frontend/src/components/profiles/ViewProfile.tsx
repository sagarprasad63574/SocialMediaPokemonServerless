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
                    <Card.Title style={{fontWeight: 'bold', fontSize: "30px"}}>{profile.name}</Card.Title>
                    <Card.Subtitle className='mt-4' style={{color: 'gray', fontSize: "20px"}}>{profile.email}</Card.Subtitle>
                    <Card.Text>{profile.biography}</Card.Text>
                    <Button onClick={handleEdit} variant="primary">Edit Profile</Button>
                </Card.Body>
            </Card>
        </div>
    )
};

export default ViewProfile