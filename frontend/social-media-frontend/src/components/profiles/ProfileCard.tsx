import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'

const ProfileCard = ({ user }: any) => {
    return (
        <Card style={{ width: '18rem' }} className='p-3 mb-2 bg-secondary text-white'>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
                <Card.Title>WELCOME!</Card.Title>
                <Card.Title>{user.username}</Card.Title>
                <Card.Text>
                    Please look below to view all the teams!
                </Card.Text>
                <Button href="/profile" variant="primary">Click to View Your Profile</Button>
            </Card.Body>
        </Card>
    )
}

export default ProfileCard