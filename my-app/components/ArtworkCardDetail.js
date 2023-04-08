import useSWR from 'swr';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Error from "next/error"
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';


export default function ArtworkCardDetail({objectID}) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(objectID))
    }, [favouritesList])    

    async function favouritesClicked() {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(objectID));
            setShowAdded(false);
        }
        else {
            setFavouritesList(await addToFavourites(objectID));
            setShowAdded(true);        
        }
    }
    
    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

    if (error) {
        console.log("Artwork Card Detail");
        return <Error statusCode={404} />
    }
    else if (!data) {
        return null;
    }
    
    return (
        <>
            <Card>
                {data.primaryImage && <Card.Img variant="top" src={data.primaryImage}/>}
                <Card.Body>
                    <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                    <Card.Text>
                        <strong>Date: </strong> {data.objectDate ? data.objectDate : "N/A"} <br/>
                        <strong>Classification: </strong> {data.classification ? data.classification : "N/A"} <br/>
                        <strong>Medium: </strong> {data.medium ? data.medium : "N/A"} 
                        <br/> <br/>

                        <strong>Artist: </strong> {data.artistDisplayName ? <>{data.artistDisplayName} ( <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> )</>  : "N/A"} <br/>
            
                        <strong>Credit Line: </strong> {data.creditLine ? data.creditLine : "N/A"} <br/>
                        <strong>Dimensions: </strong> {data.dimensions ? data.dimensions : "N/A"} <br/> <br/>

                        <Button id="btn" onClick={favouritesClicked} variant={showAdded ? "primary" : "outline-primary"}>
                            {showAdded ? "+ Favourite (added)"  : "+ Favourite"}
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
    
}