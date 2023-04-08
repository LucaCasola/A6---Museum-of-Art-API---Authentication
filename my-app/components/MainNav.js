import Link from 'next/link';
import { Container, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { readToken, removeToken } from "@/lib/authenticate";
import { addToHistory } from '@/lib/userData';


export default function MainNav() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    let token = readToken();
    console.log(token);
    function logout() {
        setIsExpanded(false);
        removeToken();
        router.push("/login");
    }

    async function submitForm(e) {
        setIsExpanded(false);
        e.preventDefault();  //prevent the browser from automatically submitting the form
        const searchValue = e.target.search.value;
        setSearchHistory(await addToHistory(`title=true&q=${searchValue}`))
        router.push(`/artwork?title=true&q=${searchValue}`);
    }

    function onToggleClick() {
        setIsExpanded(!isExpanded)
    }

    function onNavLinkClick() {
        setIsExpanded(false);
    }

	return (
		<>
            {token && <h1>q</h1>}
			<Navbar className="fixed-top navbar-dark bg-primary" expanded={isExpanded} expand="lg">
				<Container className='fluid navbar-container'>
					<Navbar.Brand>Luca Casola</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbarScroll" onClick={onToggleClick}/>
					<Navbar.Collapse id="navbarScroll">
						<Nav className="me-auto">
                            <Link href="/" passHref legacyBehavior>
                                <Nav.Link onClick={onNavLinkClick} active={router.pathname === "/"}>
                                    Home
                                </Nav.Link>
                            </Link>

							{token &&
                            <Link href="/search" passHref legacyBehavior>
                                <Nav.Link onClick={onNavLinkClick} active={router.pathname === "/search"}>
                                    Advanced Search
                                </Nav.Link>
                            </Link>}
                                
						</Nav> &nbsp; 

                        {!token &&
                        <Nav className="d-flex">
                            <Link href="/register" passHref legacyBehavior>
                                <Nav.Link onClick={onNavLinkClick} active={router.pathname === "/register"}>
                                    Register
                                </Nav.Link>
                            </Link>

                            <Link href="/login" passHref legacyBehavior>
                                <Nav.Link onClick={onNavLinkClick} active={router.pathname === "/login"}>
                                    Login
                                </Nav.Link>
                            </Link>
                        </Nav>} &nbsp;

                        
                        {token &&
                        <Form className="d-flex" onSubmit={submitForm}>
                            <Form.Control
                                type="search"
                                name="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                />

                                <Button 
                                variant="outline-success" 
                                className="btn btn-secondary" 
                                type="submit">
                                    Search
                                </Button>
                        </Form>}
                         &nbsp;

                        {token &&
                        <NavDropdown title={token.userName} id="basic-nav-dropdown">
                            <Link href="/favourites" passHref legacyBehavior>
                                <NavDropdown.Item onClick={onNavLinkClick} expanded={isExpanded} active={router.pathname === "/favourites"}>
                                    Favourites
                                </NavDropdown.Item>
                            </Link>
                            <Link href="/history" passHref legacyBehavior>
                                <NavDropdown.Item onClick={onNavLinkClick} expanded={isExpanded} active={router.pathname === "/history"}>
                                    Search History
                                </NavDropdown.Item>
                            </Link>
                            <Link href="/history" passHref legacyBehavior>
                                <NavDropdown.Item onClick={logout} expanded={isExpanded}>
                                    Logout
                                </NavDropdown.Item>
                            </Link>
                        </NavDropdown> }
                        
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<br/> <br/>
		</>
	)
}