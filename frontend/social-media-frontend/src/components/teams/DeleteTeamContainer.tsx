import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'

function DeleteTeamContainer() {
    return (
        <Container className="d-grid">
            <Button variant="primary" type="submit">
                Delete Team
            </Button>
        </Container>
    )
}

export default DeleteTeamContainer