import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Provider from '../../Context/StateProvider';
import Container from '@material-ui/core/Container';

import AllPlaces from '../AllPlaces';
import PlaceEdit from '../PlaceEdit';
// import PostCard from '../PostCard';
// import Main from '../Main';
import Header from '../Header';
// import PopAppMap from '../PopAppMap';

const App = () => {
	return (
		<Provider>
			<Router>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Header />
                    <Container maxWidth="xl" style={{margin: "30px 0"}}>
                        <Route exact path='/' component={AllPlaces} />
                        <Route exact path='/editCard/:index' component={PlaceEdit} />
                    </Container>
                </div>
                
			</Router>
		</Provider>
	)
}

export default App;
