import styles from '@/styles/History.module.css';
import { ListGroup, Card, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import { removeFromHistory } from '@/lib/userData';


export default function History() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();

    if(!searchHistory) return null;

    function historyClicked(e, index) {
        router.push(`/artwork?${searchHistory[index]}`);
    }

    async function removeHistoryClicked(e, index) {
        e.stopPropagation(); //stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index])) 
    }

    let parsedHistory = [];
    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    
    
    return (
        <>
            {parsedHistory.length > 0 
            ? (
                <ListGroup>
                    {parsedHistory.map((historyItem, index) => (
                        <ListGroup.Item className={styles.historyListItem} key={`${index}`} action onClick={(e) => historyClicked(e, index)}>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className='my-1'>{Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}</p>
                                <Button variant="danger" onClick={(e) => removeHistoryClicked(e, index)}>Remove</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) 
            : (
                <Card>
                    <Card.Body>
                        <Card.Title>Nothing Here</Card.Title>
                        <Card.Text>
                            Try searching for some artwork.
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </>
    )
}