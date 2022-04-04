import React, { useState, useEffect } from 'react';
import { AppBar, Card, CardContent, CardMedia, CircularProgress, Grid, Toolbar, Typography, TextField } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { toFirstCharUpperCase } from './constants';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    pokedexContainer: {
        paddingTop: '20px',
        paddingLeft: '50px',
        paddingRight: '50px',
    },
    cardMedia: {
        margin: 'auto'
    },
    cardContent: {
        textAlign: 'center'
    },
    searchContainer: {
        display: 'flex',
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        padding: '0 20px',
        margin: '5px 0',
    },
    searchIcon: {
        alignSelf: 'flex-end',
        marginBottom: '5px'
    },
    searchInput: {
        width: '200px',
        margin: '5px'
    }
}));


const Pokedex = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [pokemonData, setPokemonData] = useState({});
    const [filter, setFilter] = useState("");

    const handleSearchChange = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
    };

    useEffect(() => {
        axios.get("https://pokeapi.co/api/v2/pokemon?&limit=898")
            .then(function (response) {
                const { data } = response;
                const { results } = data;
                const newPokemonData = {};
                results.forEach((pokemon, index) => {
                    newPokemonData[index + 1] = {
                        id: index + 1,
                        name: pokemon.name,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                    };
                });
                setPokemonData(newPokemonData);
            });
    }, [])

    const getPokemonCard = (pokemonId) => {
        // console.log(pokemonData[`${pokemonId}`]);
        const { id, name, sprite } = pokemonData[pokemonId];

        return (
            <Grid item key={pokemonId} xs={12} sm={6} lg={4} xl={3}>
                <Card onClick={() => navigate(`/${pokemonId}`)}>
                    <CardMedia className={classes.cardMedia} image={sprite} style={{ width: '150px', height: '150px' }} />
                    <CardContent>
                        <Typography className={classes.cardContent}>{`${id}. ${toFirstCharUpperCase(name)}`}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    }

    return (
        <>
            <AppBar position='static'>
                <Toolbar>
                    <div className={classes.searchContainer}>
                        <Search className={classes.searchIcon} />
                        <TextField className={classes.searchInput} label='Pokemon' variant='standard' onChange={handleSearchChange} />
                    </div>
                </Toolbar>
            </AppBar>
            {pokemonData ? (
                <Grid container spacing={2} className={classes.pokedexContainer}>
                    {Object.keys(pokemonData).map((pokemonId) =>
                        pokemonData[pokemonId].name.includes(filter) &&
                        getPokemonCard(pokemonId)
                    )}
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </>
    )
};

export default Pokedex;