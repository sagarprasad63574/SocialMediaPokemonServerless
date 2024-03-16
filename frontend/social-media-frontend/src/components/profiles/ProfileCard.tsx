import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Nav from 'react-bootstrap/esm/Nav'
import { Link } from 'react-router-dom'

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
                <Nav.Link as={Link} to='/profile'>
                    <Button variant="primary">Click to View Your Profile</Button>
                </Nav.Link>
            </Card.Body>
        </Card>
    )
}

export default ProfileCard