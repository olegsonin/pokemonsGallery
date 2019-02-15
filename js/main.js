var pokemons = []

var endpoints = {
    pokemons: 'https://pokeapi.co/api/v2/pokemon',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
}

var Card = React.createClass({
    getInitialState: function () {
        return {
            isOpened: false
        }
    },
    handleClick: function (event) {
        if(! (this.state.height && this.state.weight && this.state.moves)) {
            fetch(endpoints.pokemons + '/'+this.props.id)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        height: data.height,
                        weight: data.weight,
                        moves:  data.moves
                    })
                })
        }

        this.setState({
            isOpened: !this.state.isOpened
        })
    },
    render: function () {
        return (
            <li className={this.state.isOpened ? "card-clicked" : "card"} data-id={this.props.id} key={this.props.id} onClick={this.handleClick}>
                <img className="card-image" src={this.props.image} alt="" />
                <div className="card-info">
                    <div className="card-name">{this.props.name}</div>
                </div>
                <div className={this.state.isOpened ? "card-more" : "hidden"}>
                    <div className="card-height">Height: {this.state.height}</div>
                    <div className="card-weight">Weight: {this.state.weight}</div>
                    <div className="card-moves">Moves:
                        <ul>
                            {
                                this.state.moves ?
                                    this.state.moves.map(function (move, index) {
                                        return <li key={index}>{move.move.name}</li>
                                    }) : ''
                            }
                        </ul>
                    </div>
                </div>
            </li>
        )
    }
})

var CardsList = React.createClass({
    getInitialState: function () {
        return {
            displayedCards: [],
            offset: 0
        }
    },
    handlePrevious: function () {
        this.fetchPokemons(this.state.offset>=10 ? this.state.offset-10 : 0)
    },
    handleNext: function () {
        this.fetchPokemons(this.state.offset+10)
    },
    fetchPokemons: function (start) {
        var results = []
        fetch(endpoints.pokemons + '?offset=' + start + '&limit=10')
            .then(response => response.json())
            .then(data => {
                data.results.map(pokemon => {

                    var url = pokemon.url;
                    var id = url.substr(url.substr(0, url.length - 1).lastIndexOf('/') + 1)
                        id = id.substr(0, id.length - 1)
                    results.push({
                        id: id,
                        name: pokemon.name,
                        image: endpoints.image + id + '.png',
                    })
                    if (results.length >= 10) {
                        this.setState({displayedCards: results})
                    }
                })
                pokemons = results;
            })
        this.setState({ offset: start })
    },
    componentDidMount: function () {
        this.fetchPokemons(0)
    },
    handleSearch: function (event) {
        var searchQuery = event.target.value.toLowerCase()
        var displayedCards = pokemons.filter(function(el){
            var searchValue = el.name.toLowerCase()
            return searchValue.indexOf(searchQuery) !== -1
        })
        this.setState({
            displayedCards: displayedCards
        })
    },
    render: function() {
        return (
            <div className="cards-container">
                <input type="text"
                       name="search"
                       className="cards-search"
                       onChange={this.handleSearch}
                />
                <ul className="cards-list">
                    {
                        this.state.displayedCards.map(function (el, i) {
                            return <Card
                                id={el.id}
                                key={i}
                                name={el.name}
                                image={el.image}
                            />
                        })
                    }
                </ul>
                <button onClick={this.handlePrevious}>&lt;</button>
                <button onClick={this.handleNext}>&gt;</button>
            </div>
        )
    }
})

ReactDOM.render(
    <CardsList />,
    document.getElementById('container')
);