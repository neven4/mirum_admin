import React, {useContext} from 'react';
import { withRouter, Link } from 'react-router-dom';
import Context from "../../Context/Context"
import Button from '@material-ui/core/Button';

import styles from './styles.module.css';

const Header = (props) => {
	const context = useContext(Context)

	return (
		<header className={ styles.header }>
			<Link to="/" className={ styles.logo }>
				Все кофейни
			</Link>

			<div className={ styles.cardsList }>
				{context.state.editableCards.map((el, i) => {
					return <Link to={`/editCard/${i}`} className={styles.headerCard}>
						<h6>{el.title}</h6>
						

						<div onClick={() => {
							if (window.confirm(`Are you shure you want to remove ${el.title}?`)) {
								context.removeCard(i)
							}
						}}>x</div>
					</Link>
				})}
				
			</div>

			<Button variant="contained" color="primary"
				className={ styles.addCafe }
				onClick={context.createNew}
			>
				Добавить кофейню
			</Button>
		</header>
	)
}

export default withRouter(Header);
