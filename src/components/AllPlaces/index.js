import React, {useEffect, useContext, useState} from 'react';
import Context from "../../Context/Context"
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

const AllPlaces = (props) => {
	const [loading, setLoading] = useState(false)
	const [filterValue, setFilterValue] = useState("")
	const context = useContext(Context)

	useEffect(() => {
		fetch("https://us-central1-mirum-e30cc.cloudfunctions.net/api/cafes")
			.then(res => res.json())
			.then(data => {
				console.log(data)
				setLoading(false)
				context.updateUploadedCards(data)
			})
			.catch(err => {
				console.log(err)
				setLoading(false)
			})

		setLoading(true)
	}, [])

	const onCafeClick = data => {
		let editableData = [...context.state.editableCards]
		const newDataIndex = editableData.length

		editableData.push(data)
		
		context.update(editableData)

		props.history.push(`/editCard/${newDataIndex}`)
	}

	return (
		<div>
			{loading
				? <h2 style={{textAlign: "center"}}>
					<CircularProgress />
				</h2>
				: <>
					<TextField
						label="Поиск"
						variant="outlined"
						onChange={e => setFilterValue(e.target.value)}
						value={filterValue}
					/>

					<div style={{
						display: "flex",
						flexWrap: "wrap",
						marginTop: "20px"
					}}>
						{context.state.uploadedCards
							.filter(el => el.title && el.title.includes(filterValue))
							.map(el => {
								return <div key={el.id}
									style={{padding: "10px"}}
									onClick={() => onCafeClick(el)}
								>
									{el.title}
								</div>
							})

						}
					</div>
				</>
			}
		</div>
	)
}

export default AllPlaces;
