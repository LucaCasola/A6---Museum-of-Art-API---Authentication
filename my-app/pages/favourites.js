import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';

export default function Favourites() {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    if(!favouritesList) return null;
    
    return (
        <>
            {favouritesList.length > 0 
            ? (
                <Row className="gy-4">
                    {favouritesList.map((currentObjectID) => (
                        <Col lg={3} key={currentObjectID}>
                            {currentObjectID && <ArtworkCard objectID={currentObjectID}/>}
                        </Col>
                    ))}
                </Row> 
            ) 
            : (
                <Card>
                    <Card.Body>
                        <Card.Title>Nothing Here</Card.Title>
                        <Card.Text>
                            Try adding some artwork to the list.
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </>
    )
}