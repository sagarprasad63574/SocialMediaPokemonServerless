import React from 'react'
import { Button, Stack } from 'react-bootstrap';

const ViewProfile = (props: any) => {
    const {profile, visible, setVisible} = props;
    const handleEdit = (event: any) => {
        setVisible(!visible);
    };
    return (
        <div>
            <Stack gap={3}>
                <div className='p-2'>Name: {profile.name}</div>
                <div className='p-2'>Email: {profile.email}</div>
                <div className='p-2'>Biography: {profile.biography}</div>
            </Stack>
            <Button onClick={handleEdit}>Edit</Button>
        </div>
    )
};

export default ViewProfile