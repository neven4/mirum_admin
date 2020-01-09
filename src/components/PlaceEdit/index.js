import React, {useState, useEffect, useContext} from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Context from "../../Context/Context"
import CircularProgress from "@material-ui/core/CircularProgress"

const PlaceEdit = (props) => {
	const [loading, setLoading] = useState(false)
	const [loadingWithoutImages, setLoadingWithoutImages] = useState(false)
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

	const uploadClick = () => {
		const reqBody = {...cafeData}
		reqBody.photos = cafeData.photos.map(el => {
			return {author: el.author}})
		
		// http://localhost:5001/mirum-e30cc/europe-west1/api
		// https://europe-west1-mirum-e30cc.cloudfunctions.net/api
		fetch("https://europe-west1-mirum-e30cc.cloudfunctions.net/api/post-card", {
			method: "POST",
			body: JSON.stringify(reqBody)
		})
			.then(res => res.json())
			.then(data => {
				let photoLength = cafeData.photos.length
				cafeData.photos.forEach((el, i) => {
					const formPhotoData = new FormData()

					formPhotoData.append(`id`, data.data.id)
					formPhotoData.append(`author`, el.author)
					formPhotoData.append(`photo_${i}`, el.fileData)
					
					fetch("https://europe-west1-mirum-e30cc.cloudfunctions.net/api/post-card/photos", {
						method: "POST",
						body: formPhotoData
					})
						.then(res => {
							if (res.status === 200) {
								photoLength--
								if (photoLength === 0) {
									setLoading(false)
								}
							}
						})
				})
			})


		setLoading(true)
	}

	const uploadOnlyText = () => {
		let textData = {...cafeData}
		delete textData.photos
		delete textData.id

		fetch(`https://europe-west1-mirum-e30cc.cloudfunctions.net/api/updateCafeText/${cafeData.id}`, {
			method: "POST",
			body: JSON.stringify(textData)
		}).then(res => {
			if (res.status === 200) {
				setLoadingWithoutImages(false)
			}
		})

		
		setLoadingWithoutImages(true)
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
					<Grid item xs={6} style={{display: "flex", justifyContent: "space-between"}}>
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
					<Grid item xs={6}>
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
					<Grid item xs={6}>
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
						<TextField
							label="Likes"
							variant="outlined"
							fullWidth={true}
							onChange={e => changeCafeData("likes", e.target.value)}
							value={cafeData.likes || ""}
						/>
					</Grid>
					<Grid item xs={12}>
						{cafeData.id && 
							<div>Id: {cafeData.id}</div>
						}
					</Grid>

					{cafeData && cafeData.id &&
						<Grid item xs={12}>
							<Button variant="contained" color="secondary" onClick={uploadOnlyText}
								style={{marginTop: "20px"}}
								disabled={loadingWithoutImages}
							>
								Upload without images
								<div className="loading-container" style={!loadingWithoutImages ? {display: "none"} : {}}>
									<CircularProgress variant="indeterminate" size={20} thickness={5}/>
								</div>
							</Button>
						</Grid>
					}

					{cafeData && cafeData.id
						? <>
							{cafeData.photos.map((el, i) => {					
								return <Grid key={i} item xs={4}>
									<img src={el.source} width="100%" height="auto" />
									<TextField
										onChange={e => changePhotoAuth(i, e)}
										value={el.author}
										style={{width: "100%"}}
									/>
								</Grid>
							})}
						</>
						: <>
							{cafeData && cafeData.photos && cafeData.photos.map((el, i) => {					
								return <Grid key={i} item xs={4}>
									<img src={URL.createObjectURL(el.fileData)} width="100%" height="auto" />
									<TextField
										onChange={e => changePhotoAuth(i, e)}
										value={el.author}
										style={{width: "100%"}}
									/>
								</Grid>
							})}
						</>
					}
				</Grid>
			}

			<input type="file" multiple onChange={filesUploaded}/>

			<Button variant="contained" color="primary" onClick={uploadClick}
				style={{marginTop: "30px"}}
				disabled={loading || (cafeData && cafeData.id)}
			>
				Upload
				<div className="loading-container" style={!loading ? {display: "none"} : {}}>
                    <CircularProgress variant="indeterminate" size={20} thickness={5}/>
                </div>
			</Button>
		</>
	)
}

export default PlaceEdit;
