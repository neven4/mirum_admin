import React, {useState, useEffect, useContext} from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Context from "../../Context/Context"

const PlaceEdit = (props) => {
	const [images, setImages] = useState([])
	const context = useContext(Context)
	const cardIndex = props.match.params.index
	const cafeData = context.state.editableCards[cardIndex]

	const changeCafeData = (name, value, arrCoord) => {
		let data = [...context.state.editableCards]

		if (name === "addressCoord") {
			data[cardIndex][name][arrCoord] = value
		} else {
			data[cardIndex][name] = value
		}
		

		context.update(data)
	}


	const changePhotoAuth = (index, el) => {
		let data = [...context.state.editableCards]

		data[cardIndex]["photos"][index]["author"] = el.target.value
		

		context.update(data)
	}

	const filesUploaded = event => {
        const uploadedFiles = Array.from(event.target.files)
        let newFiles = []

        const afterLoad = () => {
			let data = [...context.state.editableCards]
			data[cardIndex]["photos"] = data[cardIndex]["photos"].concat(newFiles)

			context.update(data)  
        }

        uploadedFiles.forEach(elem => {
            const reader = new FileReader()
            const name = elem.name.indexOf((".")) !== -1 ? elem.name.substr(0, elem.name.indexOf(("."))) : elem.name
            reader.onload = () => {
                newFiles.push({
                    name,
					fileData: elem,
					author: ""
                })

                if (newFiles.length === uploadedFiles.length) {
                    afterLoad()
                }
            }
            reader.readAsArrayBuffer(elem)
        })
	}

	const uploadTextClick = () => {
		fetch("https://us-central1-mirum-e30cc.cloudfunctions.net/api/cards", {
			method: "POST",
			body: JSON.stringify(cafeData)
		})
	}

	return (
		<>
			{cafeData &&
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<TextField
							label="Название"
							variant="outlined"
							fullWidth={true}
							onChange={e => changeCafeData("title", e.target.value)}
							value={cafeData.title || ""}
						/>
					</Grid>
					<Grid item xs={1} />
					<Grid item xs={5} style={{display: "flex", justifyContent: "space-between"}}>
						<TextField
							label="Координата 1"
							variant="outlined"
							style={{
								flex: "0 0 47%"
							}}
							onChange={e => changeCafeData("addressCoord", e.target.value, 0)}
							value={cafeData.addressCoord[0] || "0"}
						/>
						<TextField
							label="Координата 2"
							variant="outlined"
							style={{
								flex: "0 0 47%"
							}}
							onChange={e => changeCafeData("addressCoord", e.target.value, 1)}
							value={cafeData.addressCoord[1] || "0"}
						/>
					</Grid>


					<Grid item xs={6}>
						<TextField
							label="Метро"
							variant="outlined"
							fullWidth={true}
							onChange={e => changeCafeData("metroName", e.target.value)}
							value={cafeData.metroName || ""}
						/>
					</Grid>
					<Grid item xs={1} />
					<Grid item xs={5}>
						<TextField
							label="Ссылка на инстаграм"
							variant="outlined"
							fullWidth={true}
							onChange={e => changeCafeData("instagramLink", e.target.value)}
							value={cafeData.instagramLink || ""}
						/>
					</Grid>


					<Grid item xs={6}>
						<TextField
							label="Маленький текст"
							variant="outlined"
							fullWidth={true}
							multiline={true}
							onChange={e => changeCafeData("smallText", e.target.value)}
							value={cafeData.smallText || ""}
						/>
					</Grid>
					<Grid item xs={1} />
					<Grid item xs={5}>
						<TextField
							label="Адрес"
							variant="outlined"
							fullWidth={true}
							onChange={e => changeCafeData("addressName", e.target.value)}
							value={cafeData.addressName || ""}
						/>
					</Grid>

					<Grid item xs={6}>
						<TextField
							label="Большой текст"
							variant="outlined"
							fullWidth={true}
							multiline={true}
							onChange={e => changeCafeData("mainText", e.target.value)}
							value={cafeData.mainText || ""}
						/>
					</Grid>
					<Grid item xs={6}>
						
					</Grid>
				</Grid>
			}
			
			<Button variant="contained" color="primary" onClick={uploadTextClick}
				style={{marginTop: "30px"}}
			>
				Upload text
			</Button>

			<div style={{display: "flex", flexWrap: "wrap"}}>
				{cafeData && cafeData.photos && cafeData.photos.map((el, i) => {
					
					return <div key={i} style={{width: "100px"}}>
						<img src={URL.createObjectURL(el.fileData)} width="100px" height="100px" />
						<TextField
							onChange={e => changePhotoAuth(i, e)}
							value={el.author}
							style={{width: "100px"}}
						/>
					</div>
					
				})}
			</div>

			<input type="file" multiple onChange={filesUploaded}/>
		</>
	)
}

export default PlaceEdit;
