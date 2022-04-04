import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toFirstCharUpperCase } from './constants';
import { makeStyles } from '@material-ui/core';
import { Typography, Button, CircularProgress, Container, Card, CardMedia, CardHeader, CardContent } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        maxWidth: '500px'
    }
});

const Pokemon = () => {
    const { pokemonId } = useParams();
    const navigate = useNavigate();
    const classes = useStyles();
    const [pokemon, setPokemon] = useState(undefined);

    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
            .then(function (response) {
                const { data } = response;
                setPokemon(data);
            })
            .catch(function (error) {
                setPokemon(false);
            });
    }, [pokemonId]);

    const generatePokemomJSX = () => {
        const { name, id, species, height, weight, types, sprites } = pokemon;
        // const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
        const { front_default } = sprites;
        return (
            <>
                <Container>
                    <Typography variant='h1'>
                        {`${id}. ${toFirstCharUpperCase(name)} `}
                        <img src={front_default} alt={name} />
                    </Typography>
                    <Container className={classes.container}>
                        <Card variant='outlined'>
                            <CardMedia>
                                <img src={front_default} alt={name} style={{ width: '300px', height: '300px' }} />
                            </CardMedia>
                            <hr style={{ border: '1px dashed red' }} />
                            <CardHeader>
                                <Typography variant='h2'>Pokemon Info</Typography>
                            </CardHeader>
                            <CardContent>
                                <Typography>
                                    {"Species: "}
                                    <Link to={species.url}>{species.name}</Link>
                                </Typography>
                                <Typography>Height: {height}</Typography>
                                <Typography>Weight: {weight}</Typography>
                                <Typography variant='h6'>Types: </Typography>
                                {
                                    types.map((typeInfo) => {
                                        const { type } = typeInfo;
                                        const { name } = type;
                                        return <Typography key={name}>{`${name}`}</Typography>
                                    })
                                }
                            </CardContent>
                        </Card>
                    </Container>
                </Container>
            </>
        );
    };
    return (
        <>
            {pokemon === undefined && <CircularProgress />}
            {pokemon !== undefined && pokemon && generatePokemomJSX()}
            {pokemon === false && <Typography>Pokemon Not Found</Typography>}
            {pokemon !== undefined && (
                <Container style={{marginTop: '7px'}}>
                    <Button fullWidth variant='contained' onClick={() => navigate('/')}>Back To Pokedex</Button>
                </Container>
            )}
        </>
    )
};

export default Pokemon;