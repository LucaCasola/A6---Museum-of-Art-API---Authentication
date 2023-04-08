import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, Col, Row, Pagination } from 'react-bootstrap';
import useSWR from 'swr';
import Error from "next/error"

import ArtworkCard from "@/components/ArtworkCard";
import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function Artwork() {
    const [artworkList, setArtworkList] = useState(null);
    const [page, setPage] = useState(1);

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];  //get the query string from the URL

    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);
    console.log(`${data}`);
    function previousPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    function nextPage() {
        if (page < artworkList.length) {
            setPage(page + 1);
        }
    }


    useEffect(() => {
        if (data) {
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

            var results = [];  //declare an array to store the results
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }

            setArtworkList(results);
            setPage(1);
        }
    }, [data]);

    if (error) {
        return (<Error statusCode={404} />)
    }
    if (!artworkList) {
        return null;
    }
    
    return (
        <>
            {artworkList.length > 0 
            ? (
                <Row className="gy-4">
                    {artworkList[page - 1].map((currentObjectID) => (
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
                            Try searching for something else.
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}

            {artworkList.length > 0 && (
                <Row>
                    <Col>
                        <Pagination>
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>
                    </Col>
                </Row>
            )}
        </>
    )
}