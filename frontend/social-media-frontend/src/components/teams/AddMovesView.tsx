import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Error from '../common/Error';
import Form from 'react-bootstrap/esm/Form';
import { useSelector } from 'react-redux';
import { AddMoveToPokemon } from '../../api/pokemon/pokemonAPI';

const AddMovesView = ({ team_index, pokemon_index, toggleEditMove, userTeams, setTeams }: any) => {

  const { userToken } = useSelector((state: any) => state.auth)

  const [data, setData] = useState({
    move_name: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const pokemon = await AddMoveToPokemon(userToken, team_index, pokemon_index, data.move_name);
      setMessage(pokemon.message);
      console.log(pokemon);
      if (pokemon.response) { 
        setMessage(`${pokemon.message}: ${data.move_name}`);
        console.log(userTeams);
      } else {
        setMessage(pokemon.message);
      }


    } catch (error: any) {

      console.log("HEllo I am here: ", error);
    }
  }

  return (
    <Container className="d-flex">
      <Form onSubmit={handleSubmit}>
      <h5 style={{textTransform: 'uppercase'}}>{message && <Error>{message}</Error>}</h5>
        <Form.Group className="mb-3" controlId="add_move">
          <Form.Label style={{ fontSize: "25px", fontWeight: "bold" }}>Add Move</Form.Label>
          <Form.Control type="text" placeholder="Enter Move Name"
            onChange={(event) => setData({ ...data, move_name: event.target.value })} />
        </Form.Group>
        <Button variant="info" type="submit" className='mx-2'>
          Add
        </Button>
        <Button variant="info" onClick={() => toggleEditMove(false)}>
          Close
        </Button>
      </Form>
    </Container>
  )
}

export default AddMovesView